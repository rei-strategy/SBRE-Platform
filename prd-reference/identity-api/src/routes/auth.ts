import { Router } from "express";
import { prisma } from "../config/prisma";
import { hashPassword, verifyPassword } from "../utils/password";
import { audit } from "../services/audit.service";
import { sendVerificationEmail } from "../services/email.service";
import { env } from "../config/env";
import { v4 as uuid } from "uuid";
import { addMinutes, isBefore } from "date-fns";
import { createRateLimiter } from "../middleware/rate-limit";
import { signAccessToken, TokenPayload } from "../utils/tokens";
import { createSession } from "../services/session.service";
import { authenticate, enforceMfa } from "../middleware/auth";
import {
  generateMfaSecret,
  generateRecoveryCodes,
  verifyTotp,
} from "../services/mfa.service";
import {
  createGoogleAuthUrl,
  exchangeGoogleCode,
  verifyGoogleIdToken,
} from "../services/google.service";
import { ADMIN_ROLE, DEFAULT_ROLE } from "../config/roles";

const router = Router();
const signupLimiter = createRateLimiter("signup");
const loginLimiter = createRateLimiter("login");

const googleStateStore = new Map<string, string>();

router.post("/signup", signupLimiter, async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const defaultRole = await prisma.role.findFirst({
    where: { name: DEFAULT_ROLE },
  });
  if (!defaultRole) {
    return res
      .status(500)
      .json({ message: "Role configuration missing" });
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      firstName,
      lastName,
      roleId: defaultRole.id,
    },
  });

  const token = uuid();
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: addMinutes(new Date(), env.emailVerificationExpMinutes),
    },
  });

  await sendVerificationEmail(email, token);
  await audit({
    actorId: user.id,
    action: "auth.signup",
    target: user.id,
  });

  return res.status(201).json({
    message: "Verification email sent",
    devVerificationToken: token,
  });
});

router.post("/verify", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Token required" });
  }

  const verification = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (
    !verification ||
    isBefore(verification.expiresAt, new Date())
  ) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  await prisma.user.update({
    where: { id: verification.userId },
    data: { emailVerifiedAt: new Date() },
  });
  await prisma.emailVerificationToken.delete({
    where: { id: verification.id },
  });
  await audit({
    actorId: verification.userId,
    action: "auth.verify_email",
    target: verification.userId,
  });

  return res.json({ message: "Email verified" });
});

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password, totp, recoveryCode } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: { include: { permissions: { include: { permission: true } } } } },
  });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  if (!user.emailVerifiedAt) {
    return res.status(403).json({ message: "Email not verified" });
  }

  const passwordValid = await verifyPassword(user.passwordHash, password);
  if (!passwordValid) {
    await audit({ actorId: user.id, action: "auth.login_failed", metadata: { reason: "bad_password" } });
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.role.name === ADMIN_ROLE && !user.mfaEnabled) {
    return res.status(403).json({ message: "Admin must enroll MFA" });
  }

  if (user.mfaEnabled) {
    let passedMfa = false;
    if (totp && user.mfaSecret) {
      passedMfa = verifyTotp(user.mfaSecret, totp);
    }
    if (!passedMfa && recoveryCode) {
      const recovery = await prisma.recoveryCode.findFirst({
        where: { userId: user.id, used: false },
      });
      if (recovery && (await verifyPassword(recovery.codeHash, recoveryCode))) {
        passedMfa = true;
        await prisma.recoveryCode.update({
          where: { id: recovery.id },
          data: { used: true },
        });
      }
    }
    if (!passedMfa) {
      return res.status(401).json({ message: "MFA required" });
    }
  }

  const permissions =
    user.role.permissions.map(
      (rp: { permission: { name: string } }) => rp.permission.name
    ) ?? [];
  const tokenPayload: TokenPayload = {
    sub: user.id,
    role: user.role.name,
    permissions,
  };
  if (user.mfaEnabled) {
    tokenPayload.mfaCompleted = true;
  }
  const accessToken = signAccessToken(tokenPayload);
  const session = await createSession(user.id);

  await audit({
    actorId: user.id,
    action: "auth.login_success",
  });

  return res.json({
    accessToken,
    refreshToken: session.refreshToken,
    expiresAt: session.expiresAt,
  });
});

router.post("/google/start", async (req, res) => {
  const state = uuid();
  const codeVerifier = uuid();
  googleStateStore.set(state, codeVerifier);
  const url = createGoogleAuthUrl(state, codeVerifier);
  res.json({ url, state });
});

router.post("/google/callback", async (req, res) => {
  const { code, state, totp, recoveryCode } = req.body;
  const verifier = googleStateStore.get(state);
  if (!verifier) {
    return res.status(400).json({ message: "Invalid state" });
  }
  const tokens = await exchangeGoogleCode(code, verifier);
  if (!tokens.id_token) {
    return res.status(400).json({ message: "Missing id token" });
  }
  const payload = await verifyGoogleIdToken(tokens.id_token);
  if (!payload?.email || !payload.sub) {
    return res.status(400).json({ message: "Invalid Google payload" });
  }
  let user = await prisma.user.findUnique({
    where: { email: payload.email },
    include: { role: { include: { permissions: { include: { permission: true } } } } },
  });
  if (!user) {
    const memberRole = await prisma.role.findFirst({
      where: { name: DEFAULT_ROLE },
    });
    if (!memberRole) {
      throw new Error("Default role missing");
    }
    user = await prisma.user.create({
      data: {
        email: payload.email,
        emailVerifiedAt: new Date(),
        googleSub: payload.sub,
        firstName: payload.given_name ?? null,
        lastName: payload.family_name ?? null,
        roleId: memberRole.id,
      },
      include: { role: { include: { permissions: { include: { permission: true } } } } },
    });
  } else if (!user.googleSub) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleSub: payload.sub },
      include: { role: { include: { permissions: { include: { permission: true } } } } },
    });
  }

  if (!user) {
    throw new Error("Google auth failed");
  }

  if (user.role.name === ADMIN_ROLE && !user.mfaEnabled) {
    return res
      .status(403)
      .json({ message: "Admin must enroll MFA via password login" });
  }

  let mfaComplete = !user.mfaEnabled;
  if (user.mfaEnabled) {
    if (totp && user.mfaSecret) {
      mfaComplete = verifyTotp(user.mfaSecret, totp);
    }
    if (!mfaComplete && recoveryCode) {
      const recovery = await prisma.recoveryCode.findFirst({
        where: { userId: user.id, used: false },
      });
      if (recovery && (await verifyPassword(recovery.codeHash, recoveryCode))) {
        mfaComplete = true;
        await prisma.recoveryCode.update({
          where: { id: recovery.id },
          data: { used: true },
        });
      }
    }
    if (!mfaComplete) {
      return res.status(401).json({ message: "MFA required" });
    }
  }

  const permissions =
    user.role.permissions.map(
      (rp: { permission: { name: string } }) => rp.permission.name
    ) ?? [];
  const tokenPayload: TokenPayload = {
    sub: user.id,
    role: user.role.name,
    permissions,
  };
  if (mfaComplete) {
    tokenPayload.mfaCompleted = true;
  }
  const accessToken = signAccessToken(tokenPayload);
  const session = await createSession(user.id);
  await audit({
    actorId: user.id,
    action: "auth.google_login",
  });
  res.json({
    accessToken,
    refreshToken: session.refreshToken,
    expiresAt: session.expiresAt,
  });
});

router.post("/mfa/enroll", authenticate, async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const secret = generateMfaSecret();
  await prisma.user.update({
    where: { id: req.user.userId },
    data: { mfaSecret: secret.ascii },
  });
  await audit({
    actorId: req.user.userId,
    action: "auth.mfa_enroll_start",
  });
  res.json({
    otpauthUrl: secret.otpauth_url,
  });
});

router.post("/mfa/verify", authenticate, async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const { token } = req.body;
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
  });
  if (!user?.mfaSecret) {
    return res.status(400).json({ message: "MFA not initiated" });
  }
  const valid = verifyTotp(user.mfaSecret, token);
  if (!valid) {
    return res.status(400).json({ message: "Invalid token" });
  }
  const codes = await generateRecoveryCodes(user.id);
  await prisma.user.update({
    where: { id: user.id },
    data: { mfaEnabled: true },
  });
  await audit({
    actorId: user.id,
    action: "auth.mfa_enrolled",
  });
  res.json({ message: "MFA enabled", recoveryCodes: codes });
});

router.post(
  "/profile",
  authenticate,
  enforceMfa(),
  async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const { firstName, lastName } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user.userId },
      data: { firstName, lastName },
      select: { id: true, email: true, firstName: true, lastName: true },
    });
    await audit({
      actorId: req.user.userId,
      action: "profile.update",
      metadata: { fields: ["firstName", "lastName"] },
    });
    res.json(updated);
  }
);

export default router;

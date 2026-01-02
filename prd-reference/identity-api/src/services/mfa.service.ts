import crypto from "crypto";
import speakeasy from "speakeasy";
import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/password";

export const generateMfaSecret = () => {
  const secret = speakeasy.generateSecret({
    length: 20,
    name: "SBRE Connect",
  });
  return secret;
};

export const verifyTotp = (secret: string, token: string) => {
  return speakeasy.totp.verify({
    secret,
    encoding: "ascii",
    token,
    window: 1,
  });
};

export const generateRecoveryCodes = async (userId: string) => {
  await prisma.recoveryCode.deleteMany({ where: { userId } });
  const codes: string[] = [];
  for (let i = 0; i < env.mfaRecoveryCodes; i++) {
    const code = crypto.randomBytes(4).toString("hex");
    codes.push(code);
    await prisma.recoveryCode.create({
      data: {
        userId,
        codeHash: await hashPassword(code),
      },
    });
  }
  return codes;
};

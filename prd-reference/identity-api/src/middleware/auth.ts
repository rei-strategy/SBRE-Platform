import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokens";
import { prisma } from "../config/prisma";
import { hasPermission } from "../utils/rbac";
import { ADMIN_ROLE } from "../config/roles";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  try {
    const token = header.replace("Bearer ", "");
    const payload = verifyAccessToken(token);
    const userPayload: Express.UserPayload = {
      userId: payload.sub,
      role: payload.role,
      permissions: payload.permissions,
    };
    if (payload.mfaCompleted) {
      userPayload.mfaCompleted = payload.mfaCompleted;
    }
    req.user = userPayload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requirePermissions =
  (...required: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthenticated" });
    }
    if (!hasPermission(required, req.user.permissions)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };

export const enforceMfa =
  () => async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthenticated" });
    }
    const dbUser = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { mfaEnabled: true, role: { select: { name: true } } },
    });
    const roleRequiresMfa = dbUser?.role.name === ADMIN_ROLE;
    if ((dbUser?.mfaEnabled || roleRequiresMfa) && !req.user.mfaCompleted) {
      return res.status(401).json({ message: "MFA required" });
    }
    next();
  };

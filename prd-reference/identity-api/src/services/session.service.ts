import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { addDays } from "date-fns";
import { v4 as uuid } from "uuid";

export const createSession = async (userId: string) => {
  const refreshToken = uuid();
  const expiresAt = addDays(new Date(), env.refreshTokenTtlDays);
  await prisma.session.create({
    data: { userId, refreshToken, expiresAt },
  });
  return { refreshToken, expiresAt };
};

export const rotateSession = async (
  userId: string,
  oldToken: string
) => {
  await prisma.session.deleteMany({
    where: { refreshToken: oldToken, userId },
  });
  return createSession(userId);
};

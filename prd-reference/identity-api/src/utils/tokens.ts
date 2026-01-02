import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface TokenPayload {
  sub: string;
  role: string;
  permissions: string[];
  mfaCompleted?: boolean;
}

export const signAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: `${env.accessTokenTtlMinutes}m`,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
};

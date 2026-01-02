import rateLimit from "express-rate-limit";
import { env } from "../config/env";

export const createRateLimiter = (keyPrefix: string) =>
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    limit: env.rateLimitMax,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: "Too many requests, please try again later.",
    keyGenerator: (req) =>
      `${keyPrefix}:${req.ip}:${(req.body?.email as string) ?? ""}`,
  });

import "dotenv/config";

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: getEnv("DATABASE_URL"),
  jwtSecret: getEnv("JWT_SECRET"),
  accessTokenTtlMinutes: Number(
    process.env.ACCESS_TOKEN_TTL_MINUTES ?? 30
  ),
  refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 30),
  emailVerificationExpMinutes: Number(
    process.env.EMAIL_VERIFICATION_EXP_MINUTES ?? 30
  ),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 25),
  google: {
    clientId: getEnv("GOOGLE_CLIENT_ID"),
    clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
    redirectUri: getEnv("GOOGLE_REDIRECT_URI"),
  },
  mfaRecoveryCodes: Number(process.env.MFA_RECOVERY_CODE_COUNT ?? 8),
};

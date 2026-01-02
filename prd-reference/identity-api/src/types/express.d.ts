import "@types/express";

declare global {
  namespace Express {
    interface UserPayload {
      userId: string;
      role: string;
      permissions: string[];
      mfaCompleted?: boolean;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};

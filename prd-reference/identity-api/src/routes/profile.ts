import { Router } from "express";
import { authenticate, enforceMfa } from "../middleware/auth";
import { prisma } from "../config/prisma";

const router = Router();

router.get("/me", authenticate, enforceMfa(), async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: { select: { name: true } },
    },
  });
  res.json(user);
});

export default router;

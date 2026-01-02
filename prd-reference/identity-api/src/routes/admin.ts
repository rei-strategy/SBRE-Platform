import { Router } from "express";
import { prisma } from "../config/prisma";
import { authenticate, requirePermissions } from "../middleware/auth";
import { audit } from "../services/audit.service";

const router = Router();

const MANAGE_ROLES = "admin.manage_roles";

router.use(authenticate, requirePermissions(MANAGE_ROLES));

router.get("/roles", async (_req, res) => {
  const roles = await prisma.role.findMany({
    include: { permissions: { include: { permission: true } } },
  });
  res.json(roles);
});

router.post("/roles/:userId", async (req, res) => {
  const { userId } = req.params;
  const { roleId } = req.body;
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) return res.status(404).json({ message: "Role not found" });
  await prisma.user.update({
    where: { id: userId },
    data: { roleId },
  });
  await audit({
    ...(req.user?.userId ? { actorId: req.user.userId } : {}),
    action: "admin.role_change",
    target: userId,
    metadata: { roleId },
  });
  res.json({ message: "Role updated" });
});

router.get("/audit", async (_req, res) => {
  const items = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  res.json(items);
});

export default router;

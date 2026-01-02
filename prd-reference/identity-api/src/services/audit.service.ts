import { prisma } from "../config/prisma";

interface AuditInput {
  actorId?: string;
  action: string;
  target?: string;
  metadata?: Record<string, unknown>;
}

export const audit = async (input: AuditInput) => {
  await prisma.auditLog.create({
    data: {
      action: input.action,
      ...(input.actorId ? { actorId: input.actorId } : {}),
      ...(input.target ? { target: input.target } : {}),
      ...(input.metadata
        ? { metadata: JSON.stringify(input.metadata) }
        : {}),
    },
  });
};

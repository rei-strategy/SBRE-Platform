import { prisma } from "../config/prisma";

export const getRolePermissions = async (roleId: string) => {
  const role = await prisma.role.findUnique({
    where: { id: roleId },
    include: {
      permissions: {
        include: { permission: true },
      },
    },
  });
  return (
    role?.permissions.map(
      (rp: { permission: { name: string } }) => rp.permission.name
    ) ?? []
  );
};

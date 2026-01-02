import { prisma } from "../config/prisma";

const permissions = [
  { name: "admin.manage_roles", description: "Assign roles & permissions" },
  { name: "content.view_protected", description: "Access protected routes" },
];

const roles = [
  {
    name: "admin",
    description: "Platform administrators",
    permissions: permissions.map((p) => p.name),
  },
  {
    name: "member",
    description: "Default user",
    permissions: ["content.view_protected"],
  },
];

async function main() {
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  for (const role of roles) {
    const created = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: { name: role.name, description: role.description },
    });
    await prisma.permissionOnRole.deleteMany({
      where: { roleId: created.id },
    });
    for (const permName of role.permissions) {
      const perm = await prisma.permission.findUnique({
        where: { name: permName },
      });
      if (perm) {
        await prisma.permissionOnRole.create({
          data: { roleId: created.id, permissionId: perm.id },
        });
      }
    }
  }
  console.log("Seed completed");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

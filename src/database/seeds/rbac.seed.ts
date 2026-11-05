import { PERMISSION_DESCRIPTIONS, ROLE_DESCRIPTIONS, ROLE_PERMISSIONS } from '@/config/rbac.config';
import type { PrismaClient } from '../generated/prisma/client';

export async function seedRbac(prisma: PrismaClient): Promise<void> {
  for (const [name, description] of Object.entries(PERMISSION_DESCRIPTIONS)) {
    await prisma.permission.upsert({
      where: { name },
      update: { description, deletedAt: null },
      create: { name, description },
    });
  }

  for (const [roleName, permissionNames] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: { description: ROLE_DESCRIPTIONS[roleName as keyof typeof ROLE_DESCRIPTIONS], deletedAt: null },
      create: { name: roleName, description: ROLE_DESCRIPTIONS[roleName as keyof typeof ROLE_DESCRIPTIONS] },
    });
    const permissions = await prisma.permission.findMany({
      where: { name: { in: permissionNames } },
    });
    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: { deletedAt: null },
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }
}
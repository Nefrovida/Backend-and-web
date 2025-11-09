import { prisma } from '../util/prisma';
import { NotFoundError, ConflictError, BadRequestError } from '../util/errors.util';

/**
 * Get all roles with privileges
 */
export const getAllRoles = async () => {
  return await prisma.roles.findMany({
    include: {
      role_privileges: {
        include: {
          privilege: true,
        },
      },
    },
  });
};

/**
 * Get role by ID with privileges
 */
export const getRoleById = async (roleId: number) => {
  const role = await prisma.roles.findUnique({
    where: { role_id: roleId },
    include: {
      role_privileges: {
        include: {
          privilege: true,
        },
      },
    },
  });

  if (!role) {
    throw new NotFoundError('Role not found');
  }

  return role;
};

/**
 * Create a new role
 */
export const createRole = async (roleName: string) => {
  // Check if role already exists
  const existingRole = await prisma.roles.findFirst({
    where: { rol_name: roleName },
  });

  if (existingRole) {
    throw new ConflictError('Role already exists');
  }

  return await prisma.roles.create({
    data: { rol_name: roleName },
  });
};

/**
 * Update role by ID
 */
export const updateRole = async (roleId: number, roleName: string) => {
  const role = await prisma.roles.findUnique({
    where: { role_id: roleId },
  });

  if (!role) {
    throw new NotFoundError('Role not found');
  }

  return await prisma.roles.update({
    where: { role_id: roleId },
    data: { rol_name: roleName },
  });
};

/**
 * Delete role by ID
 */
export const deleteRole = async (roleId: number) => {
  const role = await prisma.roles.findUnique({
    where: { role_id: roleId },
  });

  if (!role) {
    throw new NotFoundError('Role not found');
  }

  // Check if any users have this role
  const usersWithRole = await prisma.users.count({
    where: { role_id: roleId },
  });

  if (usersWithRole > 0) {
    throw new BadRequestError('Cannot delete role: Users are assigned to this role');
  }

  // Delete role privileges first
  await prisma.role_privilege.deleteMany({
    where: { role_id: roleId },
  });

  // Delete role
  await prisma.roles.delete({
    where: { role_id: roleId },
  });
};

/**
 * Assign privileges to a role
 */
export const assignPrivilegesToRole = async (roleId: number, privilegeIds: number[]) => {
  // Check if role exists
  const role = await prisma.roles.findUnique({
    where: { role_id: roleId },
  });

  if (!role) {
    throw new NotFoundError('Role not found');
  }

  // Verify all privileges exist
  const privileges = await prisma.privileges.findMany({
    where: { privilege_id: { in: privilegeIds } },
  });

  if (privileges.length !== privilegeIds.length) {
    throw new NotFoundError('One or more privileges not found');
  }

  // Remove existing privileges
  await prisma.role_privilege.deleteMany({
    where: { role_id: roleId },
  });

  // Add new privileges
  await prisma.role_privilege.createMany({
    data: privilegeIds.map((privilegeId) => ({
      role_id: roleId,
      privilege_id: privilegeId,
    })),
  });

  return await getRoleById(roleId);
};

import { prisma } from '../util/prisma.js';
import { NotFoundError, ConflictError } from '../util/errors.util';

/**
 * Get all privileges
 */
export const getAllPrivileges = async () => {
  return await prisma.privileges.findMany();
};

/**
 * Get privilege by ID
 */
export const getPrivilegeById = async (privilegeId: number) => {
  const privilege = await prisma.privileges.findUnique({
    where: { privilege_id: privilegeId },
  });

  if (!privilege) {
    throw new NotFoundError('Privilege not found');
  }

  return privilege;
};

/**
 * Create a new privilege
 */
export const createPrivilege = async (description: string) => {
  // Check if privilege already exists
  const existingPrivilege = await prisma.privileges.findFirst({
    where: { description },
  });

  if (existingPrivilege) {
    throw new ConflictError('Privilege already exists');
  }

  return await prisma.privileges.create({
    data: { description },
  });
};

/**
 * Update privilege by ID
 */
export const updatePrivilege = async (privilegeId: number, description: string) => {
  const privilege = await prisma.privileges.findUnique({
    where: { privilege_id: privilegeId },
  });

  if (!privilege) {
    throw new NotFoundError('Privilege not found');
  }

  return await prisma.privileges.update({
    where: { privilege_id: privilegeId },
    data: { description },
  });
};

/**
 * Delete privilege by ID
 */
export const deletePrivilege = async (privilegeId: number) => {
  const privilege = await prisma.privileges.findUnique({
    where: { privilege_id: privilegeId },
  });

  if (!privilege) {
    throw new NotFoundError('Privilege not found');
  }

  // Delete role_privilege associations first
  await prisma.role_privilege.deleteMany({
    where: { privilege_id: privilegeId },
  });

  // Delete privilege
  await prisma.privileges.delete({
    where: { privilege_id: privilegeId },
  });
};

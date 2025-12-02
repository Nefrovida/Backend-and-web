import { prisma } from '../util/prisma.js';
import { hashPassword } from '../util/password.util';
import { UserWithRoleAndPrivileges, UpdateUserRequest } from '../types/user.types';
import { NotFoundError } from '../util/errors.util';

/**
 * Get all users with their roles and privileges
 */
export const getAllUsers = async (onlyRequestedReset: boolean = false): Promise<UserWithRoleAndPrivileges[]> => {
  const whereClause = onlyRequestedReset ? { password_reset_requested: true } : {};

  return await prisma.users.findMany({
    where: whereClause,
    include: {
      role: {
        include: {
          role_privileges: {
            include: {
              privilege: true,
            },
          },
        },
      },
    },
  });
};

/**
 * Get user by ID with role and privileges
 */
export const getUserById = async (userId: string): Promise<UserWithRoleAndPrivileges> => {
  const user = await prisma.users.findUnique({
    where: { user_id: userId },
    include: {
      role: {
        include: {
          role_privileges: {
            include: {
              privilege: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

/**
 * Update user by ID
 */
export const updateUser = async (
  userId: string,
  updateData: UpdateUserRequest
): Promise<UserWithRoleAndPrivileges> => {
  // Check if user exists
  const existingUser = await prisma.users.findUnique({
    where: { user_id: userId },
  });

  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  // Update user
  const updatedUser = await prisma.users.update({
    where: { user_id: userId },
    data: updateData,
    include: {
      role: {
        include: {
          role_privileges: {
            include: {
              privilege: true,
            },
          },
        },
      },
    },
  });

  return updatedUser;
};

/**
 * Delete user by ID (soft delete by setting active to false)
 */
export const deleteUser = async (userId: string): Promise<void> => {
  const user = await prisma.users.findUnique({
    where: { user_id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  await prisma.users.update({
    where: { user_id: userId },
    data: { active: false },
  });
};

/**
 * Get user by username
 */
export const getUserByUsername = async (username: string): Promise<UserWithRoleAndPrivileges | null> => {
  return await prisma.users.findFirst({
    where: { username: username },
    include: {
      role: {
        include: {
          role_privileges: {
            include: {
              privilege: true,
            },
          },
        },
      },
    },
  });
};

/**
 * Get user first login status by user Id
 */
export const isFirstLogin = async (userId: string): Promise<boolean> => {
  const user = await prisma.users.findUnique({
    where: { user_id: userId },
    select: { first_login: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user.first_login;
}

/**
 * Reset user password
 */
export const resetPassword = async (userId: string, newPassword: string): Promise<void> => {
  const user = await prisma.users.findUnique({
    where: { user_id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.users.update({
    where: { user_id: userId },
    data: {
      password: hashedPassword,
      password_reset_requested: false
    },
  });
};

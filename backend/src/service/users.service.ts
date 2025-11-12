import { prisma } from '../util/prisma';
import { UserWithRoleAndPrivileges, UpdateUserRequest } from '../types/user.types';
import { NotFoundError } from '../util/errors.util';
import userModel from '../model/user.model';

/**
 * Get all users with their roles and privileges
 */
export const getAllUsers = async (): Promise<UserWithRoleAndPrivileges[]> => {
  return await prisma.users.findMany({
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
 * 
 * @param userId 
 * @returns List appointment
 */
export const getAllAppointmentsByUserId = async (userId: string) => {
  return await userModel.getAppointmentByUserId(userId);
};

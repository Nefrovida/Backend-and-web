import { prisma } from "../util/prisma"; 
import { UserProfileDTO, UpdateProfileDTO } from "../types/profile.types";

export default class ProfileModel {
  
  ProfileModel() {
  }

  // Get profile (Prisma)
  static async getProfile(userId: string): Promise<UserProfileDTO | null> {
    const user = await prisma.users.findFirst({
      where: {
        user_id: userId,
        active: true
      },
      select: {
        user_id: true,
        name: true,
        parent_last_name: true,
        maternal_last_name: true,
        username: true,
        phone_number: true,
       
        role: { 
          select: {
            role_name: true
          }
        }
      }
    });

    if (!user) return null;

    
    return {
      user_id: user.user_id,
      name: user.name,
      parent_last_name: user.parent_last_name,
      maternal_last_name: user.maternal_last_name,
      username: user.username,
      phone_number: user.phone_number,
      role_name: user.role ? user.role.role_name : ''
    };
  }

  // Updating Profile (Prisma)
  static async updateProfile(userId: string, data: UpdateProfileDTO): Promise<UserProfileDTO | null> {
    try {
      const user = await prisma.users.update({
        where: { user_id: userId },
        data: {
          name: data.name || undefined,
          parent_last_name: data.parent_last_name || undefined,
          maternal_last_name: data.maternal_last_name || undefined,
          phone_number: data.phone_number || undefined,
        },
        select: {
          user_id: true,
          name: true,
          parent_last_name: true,
          maternal_last_name: true,
          username: true,
          phone_number: true,
          role: {
            select: { role_name: true }
          }
        }
      });

      return {
        user_id: user.user_id,
        name: user.name,
        parent_last_name: user.parent_last_name,
        maternal_last_name: user.maternal_last_name,
        username: user.username,
        phone_number: user.phone_number,
        role_name: user.role ? user.role.role_name : ''
      };
    } catch (error) {
      return null;
    }
  }

  // Get Hash (Prisma)
  static async getPasswordHash(userId: string): Promise<string | null> {
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: { password: true }
    });
    return user?.password || null;
  }

  // Update Password (Prisma)
  static async updatePassword(userId: string, newHash: string): Promise<boolean> {
    try {
      await prisma.users.update({
        where: { user_id: userId },
        data: { password: newHash }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
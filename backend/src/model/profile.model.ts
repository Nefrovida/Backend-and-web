import { prisma } from "../util/prisma";
import { UserProfileDTO, UpdateProfileDTO } from '../types/profile.types';

export class ProfileModel {

    // Obtener datos del perfil
    static async getProfile(userId: string): Promise<UserProfileDTO | null> {
        const user = await prisma.users.findUnique({
            where: { user_id: userId },
            select: {
                user_id: true,
                name: true,
                parent_last_name: true,
                maternal_last_name: true,
                username: true,
                phone_number: true,
                role: { select: { role_name: true } }
            }
        });

        if (!user) return null;

        return {
            user_id: user.user_id,
            name: user.name,
            parent_last_name: user.parent_last_name,
            maternal_last_name: user.maternal_last_name ?? '',
            username: user.username,
            phone_number: user.phone_number,
            role_name: user.role?.role_name ?? ''
        };
    }

    // Only general data can be updated
    static async updateProfile(userId: string, data: UpdateProfileDTO): Promise<UserProfileDTO | null> {
        const dataToUpdate: any = {};
        if (data.name !== undefined) dataToUpdate.name = data.name;
        if (data.parent_last_name !== undefined) dataToUpdate.parent_last_name = data.parent_last_name;
        if (data.maternal_last_name !== undefined) dataToUpdate.maternal_last_name = data.maternal_last_name;
        if (data.phone_number !== undefined) dataToUpdate.phone_number = data.phone_number;

        if (Object.keys(dataToUpdate).length === 0) return null;

        const updated = await prisma.users.updateMany({
            where: { user_id: userId },
            data: dataToUpdate
        });

        if (updated.count === 0) return null;

        // Return the updated record (fetch fresh to include role)
        return this.getProfile(userId);
    }

    // Obtener hash para validación
    static async getPasswordHash(userId: string): Promise<string | null> {
        const user = await prisma.users.findUnique({
            where: { user_id: userId },
            select: { password: true }
        });
        return user?.password ?? null;
    }

    // Guardar nueva contraseña
    static async updatePassword(userId: string, newHash: string): Promise<boolean> {
        const result = await prisma.users.updateMany({
            where: { user_id: userId },
            data: { password: newHash }
        });
        return (result.count ?? 0) > 0;
    }
}
import bcrypt from 'bcrypt';
import ProfileModel from '../model/profile.model'; 
import { ChangePasswordDTO, UpdateProfileDTO, UserProfileDTO } from '../types/profile.types';
import { PASSWORD_REGEX, BCRYPT_SALT_ROUNDS } from '../config/constants';

export class ProfileService {

    static async getMyProfile(userId: string): Promise<UserProfileDTO> {
        const user = await ProfileModel.getProfile(userId);
        if (!user) throw new Error('Usuario no encontrado o inactivo');
        return user;
    }

    static async updateMyProfile(userId: string, data: UpdateProfileDTO): Promise<UserProfileDTO> {
        // validate that theres data to update
        const hasData = Object.values(data).some(val => val !== undefined && val !== null);
        if (!hasData) {
            throw new Error('No hay datos para actualizar');
        }

        const updatedUser = await ProfileModel.updateProfile(userId, data);
        if (!updatedUser) throw new Error('No se pudo actualizar el perfil');
        return updatedUser;
    }

    static async changePassword(userId: string, data: ChangePasswordDTO): Promise<void> {
        const { currentPassword, newPassword, confirmNewPassword } = data;

        if (newPassword !== confirmNewPassword) {
            throw new Error('Las nuevas contraseñas no coinciden');
        }

        if (!PASSWORD_REGEX.test(newPassword)) {
            throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial [#?!@$%^&*-].');
        }

        const currentHash = await ProfileModel.getPasswordHash(userId);
        if (!currentHash) throw new Error('Usuario no encontrado');

        const isMatch = await bcrypt.compare(currentPassword, currentHash);
        if (!isMatch) throw new Error('La contraseña actual es incorrecta');

        const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
        const newHash = await bcrypt.hash(newPassword, salt);
        
        const success = await ProfileModel.updatePassword(userId, newHash);
        if (!success) throw new Error('Error al actualizar la contraseña en base de datos');
    }
}
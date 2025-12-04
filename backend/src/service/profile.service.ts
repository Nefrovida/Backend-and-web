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

        // validate field lengths
        if (data.name && String(data.name).trim().length > 50) {
            throw new Error('El nombre debe tener como máximo 50 caracteres');
        }
        if (data.parent_last_name && String(data.parent_last_name).trim().length > 50) {
            throw new Error('El apellido paterno debe tener como máximo 50 caracteres');
        }
        if (data.maternal_last_name && String(data.maternal_last_name).trim().length > 50) {
            throw new Error('El apellido materno debe tener como máximo 50 caracteres');
        }

        // validate gender length if provided
        if (data.gender && String(data.gender).trim().length > 20) {
            throw new Error('El género debe tener como máximo 20 caracteres');
        }

        // validate birthday if provided: valid date and not in the future
        if (data.birthday) {
            const d = new Date(String(data.birthday));
            if (isNaN(d.getTime())) {
                throw new Error('La fecha de nacimiento no es válida');
            }
            const today = new Date();
            const dOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const tOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            if (dOnly > tOnly) {
                throw new Error('La fecha de nacimiento no puede ser futura');
            }
        }

        // validate phone if provided: only digits, between 10 and 15
        if (data.phone_number) {
            const phone = String(data.phone_number).trim();
            if (!/^\d{10,15}$/.test(phone)) {
                throw new Error('El número de teléfono debe contener sólo dígitos y tener entre 10 y 15 caracteres');
            }
        }

        // map gender values to Prisma enum (MALE/FEMALE/OTHER)
        if (data.gender) {
            const raw = String(data.gender).trim();
            const lower = raw.toLowerCase();
            const map: Record<string, string> = {
                'male': 'MALE',
                'm': 'MALE',
                'masculino': 'MALE',
                'female': 'FEMALE',
                'f': 'FEMALE',
                'femenino': 'FEMALE',
                'other': 'OTHER',
                'o': 'OTHER',
                'otro': 'OTHER'
            };

            if (map[lower]) {
                data.gender = map[lower] as any;
            } else if (['MALE', 'FEMALE', 'OTHER'].includes(raw.toUpperCase())) {
                data.gender = raw.toUpperCase() as any;
            } else {
                throw new Error('Valor de género no válido');
            }
        }

        const updatedUser = await ProfileModel.updateProfile(userId, data);
        if (!updatedUser) throw new Error('No se pudo actualizar el perfil');
        return updatedUser;
    }

    static async changePassword(userId: string, data: ChangePasswordDTO): Promise<void> {
        const { newPassword, confirmNewPassword } = data;

        if (newPassword !== confirmNewPassword) {
            throw new Error('Las nuevas contraseñas no coinciden');
        }

        // maximum length for password
        if (newPassword.length > 15) {
            throw new Error('La contraseña no puede tener más de 15 caracteres');
        }

        if (!PASSWORD_REGEX.test(newPassword)) {
            throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial [#?!@$%^&*-].');
        }

        // Directly update password without requiring the current password
        const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
        const newHash = await bcrypt.hash(newPassword, salt);
        
        const success = await ProfileModel.updatePassword(userId, newHash);
        if (!success) throw new Error('Error al actualizar la contraseña en base de datos');
    }
}
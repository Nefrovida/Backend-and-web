import { Request, Response } from 'express';
import { ProfileService } from '../service/profile.service';

export class ProfileController {

    static async getMe(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.user_id; 
            if (!userId) return res.status(401).json({ message: 'No autorizado' });

            const profile = await ProfileService.getMyProfile(userId);
            res.status(200).json(profile);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateMe(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.user_id;
            if (!userId) return res.status(401).json({ message: 'No autorizado' });

            const updatedProfile = await ProfileService.updateMyProfile(userId, req.body);
            res.status(200).json({ 
                message: 'Perfil actualizado correctamente', 
                data: updatedProfile 
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async changePassword(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.user_id;
            if (!userId) return res.status(401).json({ message: 'No autorizado' });

            await ProfileService.changePassword(userId, req.body);
            res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
import { prisma } from "../util/prisma";
import { NotFoundError } from "../util/errors.util";

export default class Agenda {
  constructor() {}

    static async desactivateUser(id: string){
        console.log("dentro del model de desactivar");
        return await prisma.users.update({
            where: { user_id: id },
            data: { active: false },
        });
    }

    static async AdminRole(id: string): Promise<boolean> {
        console.log("Checking admin role for user ID:", id);
        const user = await prisma.users.findUnique({
            where: { user_id: id },
            select: { role_id: true },
        });

        console.log("User fetched:", user);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user.role_id === 1;
    }

    static async getActiveUsers() {
        return await prisma.users.findMany({
            where: { active: true }
        });
    }   
}

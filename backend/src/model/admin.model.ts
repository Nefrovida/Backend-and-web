import { prisma } from "../util/prisma";

export default class Agenda {
  constructor() {}

    static async desactivateUser(id: string){
        console.log("dentro del model de desactivar");
        return await prisma.users.update({
            where: { user_id: id },
            data: { active: false },
        });
    }

    static async AdminRole(id: string) {
        console.log("Checking admin role for user ID:", id);
        const role =  await prisma.users.findUnique({
            where: { user_id: id },
            select: { role_id: true },
        });

        console.log("Role fetched:", role);

        if(role.role_id === 1){
            return true;
        } else {
            return false;
        }
    }

    static async getActiveUsers() {
        return await prisma.users.findMany({
            where: { active: true }
        });
    }   
}

import { prisma } from "../util/prisma";

export default class Agenda {
  constructor() {}

    static async desactivateUser(id: string){
        return await prisma.users.update({
            where: { user_id: id },
            data: { active: false },
        });
    }

    static async AdminRole(id: string) {
        const role =  await prisma.users.findUnique({
            where: { user_id: id },
            select: { role_id: true },
        });


      if (!role) {
        throw new Error ("user not found");
    }

    return role.role_id === 1;
    }

    static async getActiveUsers() {
        return await prisma.users.findMany({
            where: { active: true }
        });
    }   
}

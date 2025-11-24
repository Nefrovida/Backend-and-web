import { prisma } from "#/src/util/prisma";
import { Notification } from "#/src/types/notification.types";


export const registerNotification = async (notification: Notification) => {
    try {
        const result = await prisma.notifications.create({
            data: notification,
        });
        return result;
    } catch (error) {
        console.error("Error registering notification:", error);
        throw new Error("Failed to register notification");
    }
}
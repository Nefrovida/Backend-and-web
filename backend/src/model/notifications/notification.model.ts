import { prisma } from "#/src/util/prisma";
import { Notification } from "#/src/types/notification.types";


export const registerNotification = async (notification: Notification) => {
    try {
        const result = await prisma.notifications.create({
            data: {
                user_id: notification.user_id,
                device_token: notification.device_token,
                appointment_id: notification.appointment_id,
                type: notification.type,
                answer: notification.answer,
                title: notification.title,
                content: notification.content,
                status: notification.status,
                created: notification.created,
                sendTime: notification.sendTime,
                sent: notification.sent,
            },
        });
        return result;
    } catch (error) {
        console.error("Error registering notification:", error);
        throw new Error("Failed to register notification");
    }
}

export const registerNotifications = async (notifications: Notification[]) => {
    try {
        const result = await prisma.notifications.createMany({
            data: notifications.map(notification => ({
                user_id: notification.user_id,
                device_token: notification.device_token,
                appointment_id: notification.appointment_id,
                type: notification.type,
                answer: notification.answer,
                title: notification.title,
                content: notification.content,
                status: notification.status,
                created: notification.created,
                sendTime: notification.sendTime,
                sent: notification.sent,
            })),
        });
        return result;
    } catch (error) {
        console.error("Error registering notifications:", error);
        throw new Error("Failed to register notifications");
    }
}

export const deletePreviousAssociatedNotifications = async (appointmentId: number) => {
    try {
        const result = await prisma.notifications.deleteMany({
            where: {
                appointment_id: appointmentId,
                status: "PENDING",
            },
        });
        return result;
    } catch (error) {
        console.error("Error deleting previous associated notifications:", error);
        throw new Error("Failed to delete previous associated notifications");
    }
}
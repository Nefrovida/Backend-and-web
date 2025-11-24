import * as notificationModel from "#/src/model/notifications/notification.model";
import { Notification } from "#/src/types/notification.types";

export const deletePreviousAssociatedNotifications = async (appointmentId: number) => {
// delete all notifications associated with the appointment

}

export const registerNotification = async (notification: Notification) => {
    const result = await notificationModel.registerNotification(notification);
}
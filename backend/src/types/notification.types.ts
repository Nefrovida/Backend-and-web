export enum NotificationType {
    APPOINTMENT_CREATION = "APPOINTMENT_CREATION",
    APPOINTMENT_CANCELLATION = "APPOINTMENT_CANCELLATION",
    APPOINTMENT_RESCHEDULE = "APPOINTMENT_RESCHEDULE",
    COMMUNITY = "COMMUNITY",
    OTHER = "OTHER",
}

export enum NotificationStatus {
    PENDING = "PENDING",
    SENT = "SENT",
}

export interface Notification {
    id?: number;
    user_id: string;
    device_token: string;
    appointment_id?: number;
    type: NotificationType;
    answer: string;
    title: string;
    content: string;
    status: NotificationStatus;
    created: Date;
    sendTime: Date;
    sent?: Date | null;
}

export interface NotificationTarget {
    user_id: string;
    device_token: string;
    user_type: "doctor" | "patient" | "secretary";
    sendTime: Date;
}
export enum NotificationType {
    APPOINTMENT_CREATION = "appointment_creation",
    APPOINTMENT_CANCELLATION = "appointment_cancellation",
    APPOINTMENT_RESCHEDULE = "appointment_rescheduled",
    COMMUNITY = "community",
    OTHER = "other",
}

export enum NotificationStatus {
    PENDING = "pending",
    SENT = "sent",
}

export interface Notification {
    id: number;
    userId: string;
    deviceToken: string;
    type: NotificationType;
    answer: string;
    title: string;
    content: string;
    status: NotificationStatus;
    created: Date;
    sendTime: Date;
    sent: Date;
}
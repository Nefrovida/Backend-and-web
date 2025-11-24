import * as appointmentsService from "#/src/service/appointments.service";
import * as notificationService from "#/src/service/notifications/notification.service";
import * as devicesService from "#/src/service/devices/devices.service";
import User from "#/src/model/user.model";
import { Notification, NotificationType, NotificationStatus, NotificationTarget } from "#/src/types/notification.types";
import { Status } from "@prisma/client";
import type { patient_appointment } from "@prisma/client";


export const NotificationFactory = {
    // Master function to send a notification
    sendNotification: async (appointmentId: number) => {
         try {
            // first find the appointment
            const appointment = await NotificationFactory.findAppointment(appointmentId);
            console.log("Appointment found:", appointment);

            // then infer the alert, aka what happened
            const notificationType = await NotificationFactory.inferNotificationType(appointment);
            console.log("Notification type:", notificationType);

            // find the devices of the user we need to send the notification to
            const targetList = await NotificationFactory.buildTargetList(appointment);
            console.log("Target list:", targetList);

            // delete previous associated notifications
            await NotificationFactory.deletePreviousAssociatedNotifications(appointmentId);
            console.log("Previous notifications deleted");

            // build the notification list
            const notificationList = await NotificationFactory.buildNotificationList(appointmentId, notificationType, targetList, appointment);
            console.log("Notification list:", notificationList);

            // execute the notifications
            await NotificationFactory.executeNotifications(notificationList);
            console.log("Notifications executed");

         } catch (error) {
            console.error("Error sending notification:", error);
            throw new Error("Failed to send notification");
         }
    },

    findAppointment: async (appointmentId: number) => {
        try {
            const appointment = await appointmentsService.getAppointmentById(appointmentId);
            if (!appointment) {
                throw new Error("Appointment not found");
            }
            return appointment;
        } catch (error) {
            console.error("Error finding appointment:", error);
            throw new Error("Failed to find appointment");
        }
    },

    inferNotificationType: async (appointment: any) => {
        // based on if the appointment is currently programmed, cancelled, or requested 
        // we will choose either 'appointment creation', 'appointment cancellation', or 'appointment rescheduled'
        try {
            const appointmentStatus = appointment?.appointment_status;
            switch (appointmentStatus) {
                case Status.PROGRAMMED:
                    return NotificationType.APPOINTMENT_CREATION;
                case Status.CANCELED:
                    return NotificationType.APPOINTMENT_CANCELLATION;
                case Status.REQUESTED:
                    return NotificationType.APPOINTMENT_RESCHEDULE;
            }
            return NotificationType.OTHER;
        } catch (error) {
            console.error("Error inferring notification type:", error);
            throw new Error("Failed to infer notification type");
        }
    },

    getSendTime: (appointmentDateHour: Date, hoursBeforeAppointment: number) => {
        const sendTime = new Date(appointmentDateHour);
        sendTime.setHours(sendTime.getHours() - hoursBeforeAppointment);
        return sendTime;
    },

    buildTargetList: async (appointment: any) => {
        // based on the notification type, we will build the target list of users to send the notification to
        // if the type is 'appointment creation' or 'appointment rescheduled' or 'appointment cancellation'
        // we will register a notification to the patient and the secretary to be sent immediately
        // 
        // then we will register and a notification to the doctor 1 hour before the appointment
        // if the type is 'appointment cancellation', we will send the notification to the patient and the doctor
        // if the type is 'appointment rescheduled', we will send the notification to the patient and the doctor
        try {
            const targetList: NotificationTarget[] = [];

            const doctorUserId = appointment.appointment.doctor.user_id;
            const doctorDeviceToken = await devicesService.getDeviceTokenByUserId(doctorUserId);
            if (doctorDeviceToken) {
                targetList.push({
                    user_id: doctorUserId,
                    device_token: doctorDeviceToken,
                    user_type: "doctor",
                    sendTime: new Date()
                });
                targetList.push({
                    user_id: doctorUserId,
                    device_token: doctorDeviceToken,
                    user_type: "doctor",
                    sendTime: NotificationFactory.getSendTime(appointment.date_hour, 1)
                });
            }

            const patientUserId = appointment.patient.user_id;
            const patientDeviceToken = await devicesService.getDeviceTokenByUserId(patientUserId);
            if (patientDeviceToken) {
                targetList.push({
                    user_id: patientUserId,
                    device_token: patientDeviceToken,
                    user_type: "patient",
                    sendTime: new Date()
                });
                targetList.push({
                    user_id: patientUserId,
                    device_token: patientDeviceToken,
                    user_type: "patient",
                    sendTime: NotificationFactory.getSendTime(appointment.date_hour, 24)
                });
            }

            const secretaryIds = await User.getAllSecretaryIds();

            for (const secretary of secretaryIds) {
                const secretaryDeviceToken = await devicesService.getDeviceTokenByUserId(secretary.user_id);
                if (secretaryDeviceToken) {
                    targetList.push({
                        user_id: secretary.user_id,
                        device_token: secretaryDeviceToken,
                        user_type: "secretary",
                        sendTime: new Date()
                    });
                }
            }

            return targetList;
        } catch (error) {
            console.error("Error building target list:", error);
            throw new Error("Failed to build target list");
        }
    },

    deletePreviousAssociatedNotifications: async (appointmentId: number) => {
        try {
            await notificationService.deletePreviousAssociatedNotifications(appointmentId);
        } catch (error) {
            console.error("Error deleting previous associated notifications:", error);
            throw new Error("Failed to delete previous associated notifications");
        }
    },

    getNotificationTitle: (notificationType: NotificationType) => {
        switch (notificationType) {
            case "APPOINTMENT_CREATION":
                return "Nueva Cita";
            case "APPOINTMENT_CANCELLATION":
                return "Cita Cancelada";
            case "APPOINTMENT_RESCHEDULE":
                return "Cita Reagendada";
            default: 
                return "Notificación";
        }
    },

    getNotificationContent: (appointment: any, notificationType: NotificationType, target: NotificationTarget) => {
        switch (target.user_type) {
            case "doctor":
                if (notificationType === NotificationType.APPOINTMENT_CREATION) {
                    return `La cita ${appointment.appointment.name} ha sido creada para las ${appointment.date_hour}`;
                } else if (notificationType === NotificationType.APPOINTMENT_CANCELLATION) {
                    return `Tu cita ${appointment.appointment.name} a las ${appointment.date_hour} ha sido cancelada`;
                } else if (notificationType === NotificationType.APPOINTMENT_RESCHEDULE) {
                    return `Tu cita ${appointment.appointment.name} ha sido reagendada para el ${appointment.date_hour}`;
                } else {
                    return "Accion de cita";
                }
            case "patient":
                if (notificationType === NotificationType.APPOINTMENT_CREATION) {
                    return `La cita ${appointment.appointment.name} para las ${appointment.date_hour} ha sido creada`;
                } else if (notificationType === NotificationType.APPOINTMENT_CANCELLATION) {
                    return `Tu cita ${appointment.appointment.name} a las ${appointment.date_hour} ha sido cancelada`;
                } else if (notificationType === NotificationType.APPOINTMENT_RESCHEDULE) {
                    return `Tu cita ${appointment.appointment.name} ha sido reagendada para el ${appointment.date_hour}`;
                } else {
                    return "Accion de cita";
                }
            case "secretary":
                if (notificationType === NotificationType.APPOINTMENT_CREATION) {
                    return `La cita ${appointment.appointment.name} para las ${appointment.date_hour} ha sido creada`;
                } else if (notificationType === NotificationType.APPOINTMENT_CANCELLATION) {
                    return `La cita ${appointment.appointment.name} a las ${appointment.date_hour} ha sido cancelada`;
                } else if (notificationType === NotificationType.APPOINTMENT_RESCHEDULE) {
                    return `La cita ${appointment.appointment.name} ha sido reagendada para el ${appointment.date_hour}`;
                } else {
                    return "Accion de cita";
                }
        }
    },

    buildNotificationList: async (appointmentId: number, notificationType: NotificationType, targetList: NotificationTarget[], appointment: any) => {
        try {
            const notificationList: Notification[] = [];

            for (const target of targetList) {
                const title = NotificationFactory.getNotificationTitle(notificationType);
                const content = NotificationFactory.getNotificationContent(appointment, notificationType, target);
                const notification: Notification = {
                    user_id: target.user_id,
                    device_token: target.device_token,
                    appointment_id: appointmentId,
                    type: notificationType,
                    answer: "",
                    title: title,
                    content: content,
                    status: NotificationStatus.PENDING,
                    created: new Date(),
                    sendTime: target.sendTime,
                    sent: null,
                };
                notificationList.push(notification);
            }

            return notificationList;                
        } catch (error) {
            console.error("Error building notification:", error);
            throw new Error("Failed to build notification");
        }
    },

    executeNotifications: async (notificationList: Notification[]) => {
        try {
            await notificationService.registerNotifications(notificationList);
        } catch (error) {
            console.error("Error executing notifications:", error);
            throw new Error("Failed to execute notifications");
        }
    },
}
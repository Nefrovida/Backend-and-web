import * as appointmentsService from "#/src/service/appointments.service";
import * as notificationService from "#/src/service/notifications/notification.service";
import * as devicesService from "#/src/service/devices/devices.service";
import * as userModel from "#/src/model/user.model";
import { Notification, NotificationType, NotificationStatus } from "#/src/types/notification.types";


export const NotificationFactory = {
    // Master function to send a notification
    sendNotification: async (appointmentId: number) => {
         try {
            // first find the appointment
            const appointment = await this.findAppointment(appointmentId);
            console.log("Appointment found:", appointment);

            // then infer the alert, aka what happened
            const notificationType = await this.inferNotificationType(appointment);
            console.log("Notification type:", notificationType);

            // find the devices of the user we need to send the notification to
            const targetList = await this.buildTargetList(appointment);
            console.log("Target list:", targetList);

            // delete previous associated notifications
            // major problem here, idk how to figure out which notifications 
            // were associated with the appointment. maybe if we add like a reference 
            // number or something, but idk, it might get complicated


            // build the notification list
            const notificationList = await this.buildNotificationList(appointmentId, notificationType, targetList);
            console.log("Notification list:", notificationList);

            // execute the notifications
            await this.executeNotifications(notificationList);
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

    inferNotificationType: async (appointment: Object) => {
        // based on if the appointment is currently programmed, cancelled, or requested 
        // we will choose either 'appointment creation', 'appointment cancellation', or 'appointment rescheduled'
        try {
            const appointmentStatus = appointment?.status;
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

    getSendTime: (appointmentDateHour: Date, setTime: number) => {
        const sendTime = new Date(appointmentDateHour);
        sendTime.setMinutes(sendTime.getHours() - setTime);
        return sendTime;
    },

    buildTargetList: async (appointment: Object) => {
        // based on the notification type, we will build the target list of users to send the notification to
        // if the type is 'appointment creation' or 'appointment rescheduled' or 'appointment cancellation'
        // we will register a notification to the patient and the secretary to be sent immediately
        // 
        // then we will register and a notification to the doctor 1 hour before the appointment
        // if the type is 'appointment cancellation', we will send the notification to the patient and the doctor
        // if the type is 'appointment rescheduled', we will send the notification to the patient and the doctor
        try {
            const targetList = [];

            const doctorUserId = appointment.appointment.doctor.user_id;
            const doctorDeviceId = devicesService.getDeviceIdByUserId(doctorUserId);
            targetList.push({
                user_id: doctorUserId,
                device_id: doctorDeviceId,
                user_type: "doctor",
                sendTime: new Date()
            });
            targetList.push({
                user_id: doctorUserId,
                device_id: doctorDeviceId,
                user_type: "doctor",
                sendTime: this.getSendTime(appointment.appointment.date_hour, 1)
            });

            const patientUserId = appointment.patient.user_id;
            const patientDeviceId = devicesService.getDeviceIdByUserId(patientUserId);
            targetList.push({
                user_id: patientUserId,
                device_id: patientDeviceId,
                user_type: "patient",
                sendTime: new Date()
            });
            targetList.push({
                user_id: patientUserId,
                device_id: patientDeviceId,
                user_type: "patient",
                sendTime: this.getSendTime(appointment.appointment.date_hour, 24)
            });

            const secretaryIds = userModel.getAllSecretaryIds();

            for (const secretaryId of secretaryIds) {
                const secretaryDeviceId = devicesService.getDeviceIdByUserId(secretaryId);
                targetList.push({
                    user_id: secretaryId,
                    device_id: secretaryDeviceId,
                    user_type: "secretary",
                    sendTime: new Date()
                });
            }

            return targetList;
        } catch (error) {
            console.error("Error building target list:", error);
            throw new Error("Failed to build target list");
        }
    },

    deletePreviousAssociatedNotifications: async (appointmentId: number) => {
        try {
            const result = await notificationService.deletePreviousAssociatedNotifications(appointmentId);
            // const notifications = await getNotificationsByAppointmentId(appointmentId);
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

    getNotificationContent: (appointment: Object, notificationType: NotificationType, target: Object) => {
        switch (target.user_type) {
            case "doctor":
                if (notificationType === "APPOINTMENT_CREATION") {
                    return `La cita ${appointment.appointment.name} ha sido creada para las ${appointment.appointment.date_hour}`;
                } else if (notificationType === "APPOINTMENT_CANCELLATION") {
                    return `Tu cita ${appointment.appointment.name} a las ${appointment.appointment.date_hour} ha sido cancelada`;
                } else if (notificationType === "APPOINTMENT_RESCHEDULE") {
                    return `Tu cita ${appointment.appointment.name} ha sido reagendada para el ${appointment.appointment.date_hour}`;
                } else {
                    return "Accion de cita";
                }
            case "patient":
                if (notificationType === "APPOINTMENT_CREATION") {
                    return `La cita ${appointment.appointment.name} para las ${appointment.appointment.date_hour} ha sido creada`;
                } else if (notificationType === "APPOINTMENT_CANCELLATION") {
                    return `Tu cita ${appointment.appointment.name} a las ${appointment.appointment.date_hour} ha sido cancelada`;
                } else if (notificationType === "APPOINTMENT_RESCHEDULE") {
                    return `Tu cita ${appointment.appointment.name} ha sido reagendada para el ${appointment.appointment.date_hour}`;
                } else {
                    return "Accion de cita";
                }
            case "secretary":
                if (notificationType === "APPOINTMENT_CREATION") {
                    return `La cita ${appointment.appointment.name} para las ${appointment.appointment.date_hour} ha sido creada`;
                } else if (notificationType === "APPOINTMENT_CANCELLATION") {
                    return `La cita ${appointment.appointment.name} a las ${appointment.appointment.date_hour} ha sido cancelada`;
                } else if (notificationType === "APPOINTMENT_RESCHEDULE") {
                    return `La cita ${appointment.appointment.name} ha sido reagendada para el ${appointment.appointment.date_hour}`;
                } else {
                    return "Accion de cita";
                }
        }
    },

    buildNotificationList: async (appointmentId: string, notificationType: NotificationType, targetList: Object[]) => {
        try {
            const notificationList = [];

            for (const target of targetList) {
                const title = this.getNotificationTitle(target);
                const content = this.getNotificationContent(target);
                const notification = {
                    type: notificationType,
                    answer: "",
                    title: title,
                    content: content,
                    status: "PENDING",
                    created: new Date(),
                    sendTime: target.sendTime,
                    sent: null,
                }
            }

            return notificationList;                
        } catch (error) {
            console.error("Error building notification:", error);
            throw new Error("Failed to build notification");
        }
    },

    registerNotifications: async (notificationList: Notification[]) => {
        try {
            const result = await notificationService.registerNotifications(notificationList);
        } catch (error) {
            console.error("Error executing notifications:", error);
            throw new Error("Failed to execute notifications");
        }
    },
}
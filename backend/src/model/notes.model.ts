import { prisma } from "src/util/prisma";

export default class Notes {
  Notes() {}

  static async createNote(data: {
    patient_id: string;
    patient_appointment_id?: number;
    title: string;
    content: string;
    general_notes?: string;
    ailments?: string;
    prescription?: string;
    additional_notes?: string;
    visibility?: boolean;
  }) {
    return await prisma.notes.create({
      data: {
        patient_id: data.patient_id,
        patient_appointment_id: data.patient_appointment_id,
        title: data.title,
        content: data.content,
        general_notes: data.general_notes,
        ailments: data.ailments,
        prescription: data.prescription,
        additional_notes: data.additional_notes,
        visibility: data.visibility ?? true,
      },
    });
  }

  static async getNotesByPatient(page: number, patientId: string, filterByVisibility: boolean = false) {
    const pagination = 10;
    const notes = await prisma.notes.findMany({
      where: {
        patient_id: patientId,
        ...(filterByVisibility ? { visibility: true } : {}),
      },
      include: {
        patient_appointment: {
          include: {
            appointment: true,
          },
        },
      },
      orderBy: {
        creation_date: "desc",
      },
      take: pagination,
      skip: pagination * page,
    });

    return notes;
  }

  static async patientBelogsToDoctor(patientId: string, userId: string) {
    const result = await prisma.patient_appointment.findFirst({
      where: {
        patient_id: patientId,
        appointment: {
          doctor: {
            user_id: userId,
          },
        },
      },
    });
    return result !== null;
  }

  static async appointmentBelongsToPatient(
    appointmentId: number,
    patientId: string
  ) {
    const result = await prisma.patient_appointment.findFirst({
      where: {
        patient_appointment_id: appointmentId,
        patient_id: patientId,
      },
    });
    return result !== null;
  }
}

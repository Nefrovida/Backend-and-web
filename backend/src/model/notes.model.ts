import { prisma } from "src/util/prisma";

export default class Notes {
  Notes() {

  }

  static async createNote(data: {
    patient_id: string;
    title: string;
    content: string;
    general_notes?: string;
    ailments?: string;
    prescription?: string;
    visibility?: boolean;
  }) {
    return await prisma.notes.create({
      data: {
        patient_id: data.patient_id,
        title: data.title,
        content: data.content,
        general_notes: data.general_notes,
        ailments: data.ailments,
        prescription: data.prescription,
        visibility: data.visibility ?? true,
      }
    });
  }

  static async getNotesByPatient(patientId: string) {
    return await prisma.notes.findMany({
      where: {
        patient_id: patientId
      },
      orderBy: {
        creation_date: 'desc'
      }
    });
  }
}

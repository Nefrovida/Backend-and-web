import { prisma } from "../util/prisma";

export default class MedicalRecord {
  MedicalRecord() {}

  /**
   * Get complete medical record for a patient
   * @param patientId - The patient's UUID
   * @returns Complete medical record with all related data
   */
  static async getMedicalRecord(patientId: string) {
    // Get patient basic info
    const patient = await prisma.patients.findUnique({
      where: { patient_id: patientId },
      select: {
        patient_id: true,
        curp: true,
        user: {
          select: {
            user_id: true,
            name: true,
            parent_last_name: true,
            maternal_last_name: true,
            phone_number: true,
            birthday: true,
            gender: true,
          },
        },
      },
    });

    if (!patient) {
      return null;
    }

    // Get all appointments
    const appointments = await prisma.patient_appointment.findMany({
      where: { patient_id: patientId },
      select: {
        patient_appointment_id: true,
        date_hour: true,
        duration: true,
        appointment_type: true,
        appointment_status: true,
        link: true,
        place: true,
        appointment: {
          select: {
            appointment_id: true,
            name: true,
            general_cost: true,
            community_cost: true,
            image_url: true,
            doctor: {
              select: {
                specialty: true,
                license: true,
                user: {
                  select: {
                    name: true,
                    parent_last_name: true,
                    maternal_last_name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        date_hour: "desc",
      },
    });

    // Get all clinical notes
    const notes = await prisma.notes.findMany({
      where: { patient_id: patientId },
      select: {
        note_id: true,
        title: true,
        content: true,
        general_notes: true,
        ailments: true,
        prescription: true,
        visibility: true,
        creation_date: true,
        patient_appointment_id: true,
      },
      orderBy: {
        creation_date: "desc",
      },
    });

    // Get all analysis
    const analysis = await prisma.patient_analysis.findMany({
      where: { patient_id: patientId },
      select: {
        patient_analysis_id: true,
        analysis_date: true,
        results_date: true,
        analysis_status: true,
        place: true,
        duration: true,
        analysis: {
          select: {
            analysis_id: true,
            name: true,
            description: true,
            previous_requirements: true,
            general_cost: true,
            community_cost: true,
            image_url: true,
          },
        },
        laboratorist: {
          select: {
            laboratorist_id: true,
            user: {
              select: {
                name: true,
                parent_last_name: true,
                maternal_last_name: true,
              },
            },
          },
        },
        results: {
          select: {
            result_id: true,
            date: true,
            path: true,
            interpretation: true,
          },
        },
      },
      orderBy: {
        analysis_date: "desc",
      },
    });

    // Get clinical history (patient_history)
    const clinicalHistory = await prisma.patient_history.findMany({
      where: { patient_id: patientId },
      select: {
        question_id: true,
        patient_id: true,
        answer: true,
        question: {
          select: {
            description: true,
            type: true,
          },
        },
      },
    });

    // Get user reports (for now, get reports made by this patient)
    // NOTE: This will need to be updated when user_reports endpoints are created
    const reports = await prisma.user_reports.findMany({
      where: { user_id: patient.user.user_id },
      select: {
        report_id: true,
        user_id: true,
        reported_message: true,
        cause: true,
        date: true,
        status: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return {
      patient,
      appointments,
      notes,
      analysis,
      clinicalHistory,
      reports,
    };
  }

  /**
   * Verify if a doctor has access to a patient's medical record
   * @param doctorUserId - The doctor's user UUID
   * @param patientId - The patient's UUID
   * @returns Boolean indicating if doctor has access
   */
  static async verifyDoctorAccess(
    doctorUserId: string,
    patientId: string
  ): Promise<boolean> {
    const appointment = await prisma.patient_appointment.findFirst({
      where: {
        patient_id: patientId,
        appointment: {
          doctor: {
            user_id: doctorUserId,
          },
        },
      },
    });

    return !!appointment;
  }

  /**
   * Verify if a user is the patient or their familiar
   * @param userId - The user's UUID
   * @param patientId - The patient's UUID
   * @returns Boolean indicating if user has access
   */
  static async verifyPatientOrFamiliarAccess(
    userId: string,
    patientId: string
  ): Promise<boolean> {
    // Check if user is the patient
    const isPatient = await prisma.patients.findFirst({
      where: {
        patient_id: patientId,
        user_id: userId,
      },
    });

    if (isPatient) return true;

    // Check if user is a familiar of the patient
    const isFamiliar = await prisma.familiars.findFirst({
      where: {
        user_id: userId,
        patient_id: patientId,
      },
    });

    return !!isFamiliar;
  }
}
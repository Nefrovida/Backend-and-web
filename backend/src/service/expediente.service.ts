import MedicalRecord from "../model/expediente.model";
import { NotFoundError, ForbiddenError } from "../util/errors.util";

/**
 * Get complete medical record for a patient
 * Verifies access permissions before returning data
 */
export const getMedicalRecord = async (
  requestingUserId: string,
  patientId: string,
  userRoleId: number
) => {
  // Verify patient exists and get medical record
  const medicalRecord = await MedicalRecord.getMedicalRecord(patientId);

  if (!medicalRecord) {
    throw new NotFoundError("Patient not found");
  }

  // Use the actual patient_id from the medical record for access verification
  const actualPatientId = medicalRecord.patient.patient_id;

  // Admin (role_id = 1) has access to all records
  if (userRoleId === 1) {
    return medicalRecord;
  }

  // Doctor (role_id = 2) - verify they have treated this patient
  if (userRoleId === 2) {
    const hasAccess = await MedicalRecord.verifyDoctorAccess(
      requestingUserId,
      actualPatientId
    );
    if (!hasAccess) {
      throw new ForbiddenError(
        "No tienes acceso a este expediente"
      );
    }
    return medicalRecord;
  }

  // Patient (role_id = 3) or Familiar (role_id = 5) - verify identity
  if (userRoleId === 3 || userRoleId === 5) {
    const hasAccess = await MedicalRecord.verifyPatientOrFamiliarAccess(
      requestingUserId,
      actualPatientId
    );
    if (!hasAccess) {
      throw new ForbiddenError("No tienes acceso a este expediente");
    }
    return medicalRecord;
  }

  // Other roles don't have access
  throw new ForbiddenError("No tienes permiso para ver los expedientes médicos");
};
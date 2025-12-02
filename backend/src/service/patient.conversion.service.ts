import { prisma } from '../util/prisma.js';
import { ConflictError, NotFoundError, BadRequestError } from '../util/errors.util';
import { DEFAULT_ROLES } from '../config/constants';

/**
 * Convert an external user to a patient by creating a patient record
 * External users are users with first_login = false
 */
export const convertExternalUserToPatient = async (
  userId: string,
  curp: string
): Promise<{ success: boolean; message: string; patient_id: string }> => {
  // Validate CURP format (18 characters)
  if (!curp || curp.length !== 18) {
    throw new BadRequestError('CURP must be exactly 18 characters');
  }

  // Check if user exists and is active
  const user = await prisma.users.findUnique({
    where: { user_id: userId },
    include: {
      patients: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (!user.active) {
    throw new BadRequestError('Cannot convert inactive user to patient');
  }

  // Check if user is external (first_login = false and role_id = PATIENT)
  if (user.first_login !== false || user.role_id !== DEFAULT_ROLES.PATIENT) {
    throw new ConflictError('User is not an external user');
  }

  // Check if CURP is already in use
  const existingPatientWithCurp = await prisma.patients.findUnique({
    where: { curp: curp.toUpperCase() },
  });

  if (existingPatientWithCurp) {
    throw new ConflictError('CURP already registered to another patient');
  }

  // Create patient record (if doesn't exist) and update first_login to true
  const result = await prisma.$transaction(async (tx) => {
    let patient;
    
    // Check if patient record already exists
    if (user.patients.length > 0) {
      patient = user.patients[0];
    } else {
      // Create patient record
      patient = await tx.patients.create({
        data: {
          user_id: userId,
          curp: curp.toUpperCase(),
        },
      });
    }

    // Update first_login to true to mark as no longer external
    await tx.users.update({
      where: { user_id: userId },
      data: { 
        first_login: true,
      },
    });

    return patient;
  });

  return {
    success: true,
    message: 'User successfully converted to patient',
    patient_id: result.patient_id,
  };
};

/**
 * Check if a user is an external user (first_login = false and role_id = PATIENT)
 */
export const isExternalUser = async (userId: string): Promise<boolean> => {
  const user = await prisma.users.findUnique({
    where: { user_id: userId },
    select: { 
      first_login: true,
      role_id: true,
    },
  });

  if (!user) {
    return false;
  }

  return user.first_login === false && user.role_id === DEFAULT_ROLES.PATIENT;
};

/**
 * Get all external users (users with first_login = false and role_id = PATIENT)
 */
export const getAllExternalUsers = async () => {
  const externalUsers = await prisma.users.findMany({
    where: { 
      active: true,
      first_login: false,
      role_id: DEFAULT_ROLES.PATIENT,
    },
    include: {
      role: true,
    },
  });

  // Return only necessary fields
  return externalUsers.map((user) => ({
    user_id: user.user_id,
    name: user.name,
    parent_last_name: user.parent_last_name,
    maternal_last_name: user.maternal_last_name,
    phone_number: user.phone_number,
    username: user.username,
    birthday: user.birthday,
    gender: user.gender,
    registration_date: user.registration_date,
    role_id: user.role_id,
    role_name: user.role.role_name,
  }));
};

import userModel from '../../model/appointment.model.js';

/**
 * 
 * @param userId 
 * @returns List appointment
 */
export const getAllAppointmentsByUserId = async (userId: string) => {
  return await userModel.getAppointmentByUserId(userId);
};
import { Request, Response } from 'express';
import * as patientConversionService from '../service/patient.conversion.service';

/**
 * Convert an external user to a patient
 * Only accessible by doctors
 */
export const convertUserToPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { curp } = req.body;

    if (!curp) {
      res.status(400).json({ error: 'CURP is required' });
      return;
    }

    const result = await patientConversionService.convertExternalUserToPatient(userId, curp);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Check if a user is an external user
 */
export const checkIfExternalUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const isExternal = await patientConversionService.isExternalUser(userId);
    res.status(200).json({ isExternal });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Get all external users
 */
export const getExternalUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const externalUsers = await patientConversionService.getAllExternalUsers();
    res.status(200).json(externalUsers);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

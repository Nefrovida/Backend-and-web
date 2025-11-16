import { Request, Response } from 'express';
import * as privilegesService from '../service/privileges.service';

/**
 * Get all privileges
 */
export const getAllPrivileges = async (req: Request, res: Response): Promise<void> => {
  try {
    const privileges = await privilegesService.getAllPrivileges();
    res.status(200).json(privileges);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Get privilege by ID
 */
export const getPrivilegeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const privilegeId = parseInt(req.params.id);
    const privilege = await privilegesService.getPrivilegeById(privilegeId);
    res.status(200).json(privilege);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Create a new privilege
 */
export const createPrivilege = async (req: Request, res: Response): Promise<void> => {
  try {
    const { description } = req.body;
    const privilege = await privilegesService.createPrivilege(description);
    res.status(201).json(privilege);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Update privilege
 */
export const updatePrivilege = async (req: Request, res: Response): Promise<void> => {
  try {
    const privilegeId = parseInt(req.params.id);
    const { description } = req.body;
    const privilege = await privilegesService.updatePrivilege(privilegeId, description);
    res.status(200).json(privilege);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Delete privilege
 */
export const deletePrivilege = async (req: Request, res: Response): Promise<void> => {
  try {
    const privilegeId = parseInt(req.params.id);
    await privilegesService.deletePrivilege(privilegeId);
    res.status(200).json({ message: 'Privilege deleted successfully' });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

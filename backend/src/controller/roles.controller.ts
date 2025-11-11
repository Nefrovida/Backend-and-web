import { Request, Response } from 'express';
import * as rolesService from '../service/roles.service';

/**
 * Get all roles
 */
export const getAllRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await rolesService.getAllRoles();
    res.status(200).json(roles);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Get role by ID
 */
export const getRoleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const roleId = parseInt(req.params.id);
    const role = await rolesService.getRoleById(roleId);
    res.status(200).json(role);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Create a new role
 */
export const createRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role_name } = req.body;
    const role = await rolesService.createRole(role_name);
    res.status(201).json(role);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Update role
 */
export const updateRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const roleId = parseInt(req.params.id);
    const { role_name } = req.body;
    const role = await rolesService.updateRole(roleId, role_name);
    res.status(200).json(role);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Delete role
 */
export const deleteRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const roleId = parseInt(req.params.id);
    await rolesService.deleteRole(roleId);
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Assign privileges to role
 */
export const assignPrivileges = async (req: Request, res: Response): Promise<void> => {
  try {
    const roleId = parseInt(req.params.id);
    const { privilege_ids } = req.body;
    const role = await rolesService.assignPrivilegesToRole(roleId, privilege_ids);
    res.status(200).json(role);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

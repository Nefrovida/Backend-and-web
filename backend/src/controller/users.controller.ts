import { Request, Response } from 'express';
import * as usersService from '../service/users.service';
import { UpdateUserRequest } from '../types/user.types';

/**
 * Get all users
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await usersService.getUserById(id);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Update user
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateUserRequest = req.body;
    const updatedUser = await usersService.updateUser(id, updateData);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Delete user (soft delete)
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await usersService.deleteUser(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await usersService.getUserById(req.user.userId);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getUserAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appointments = await usersService.getAllAppointmentsByUserId(id);
    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const postUserRiskForms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const riskFormData = req.body;
    const result = await usersService.getAllAppointmentsByUserId(id, );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

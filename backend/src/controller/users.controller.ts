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

/**
 * Get first login status
 */
export const isFirstLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id  = req.params.user_id;
    if (!user_id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const isFirstLogin = await usersService.isFirstLogin(user_id);
    res.status(200).json({ isFirstLogin });
    
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

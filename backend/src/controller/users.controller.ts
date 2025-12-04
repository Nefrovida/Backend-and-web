import { Request, Response } from 'express';
import * as usersService from '../service/users.service';
import { UpdateUserRequest } from '../types/user.types';
import * as userService from "../service/users.service";

/**
 * Get all users
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const onlyRequestedReset = req.query.resetRequested === 'true';
    const users = await usersService.getAllUsers(onlyRequestedReset);
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
 * Get all pending users (awaiting approval)
 */
export const getPendingUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const pendingUsers = await usersService.getPendingUsers();
    res.status(200).json(pendingUsers);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Get all rejected users
 */
export const getRejectedUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const rejectedUsers = await usersService.getRejectedUsers();
    res.status(200).json(rejectedUsers);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Approve a user
 */
export const approveUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const approvedUser = await usersService.approveUser(id, req.user.userId);
    res.status(200).json({
      message: 'User approved successfully',
      user: approvedUser
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Reject a user
 */
export const rejectUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const rejectedUser = await usersService.rejectUser(id);
    res.status(200).json({
      message: 'User rejected successfully',
      user: rejectedUser
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Get first login status
 */
export const isFirstLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = req.params.user_id;
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

/**
 * Reset user password
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ error: 'Se requiere la contraseña' });
      return;
    }

    await usersService.resetPassword(id, password);
    res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};


// Report user

export const reportUser = async (req: Request, res: Response) => {
  try {
    const userIdToReport = req.params.id;
    const { messageId, cause } = req.body;

    if (!userIdToReport || !messageId || !cause) {
      return res.status(400).json({ message: "Faltan datos para el reporte." });
    }

    const result = await userService.reportUser(userIdToReport, messageId, cause);

    if (result.success) {
      return res.status(200).json({ message: "Usuario reportado con éxito" });
    } else {
      return res.status(400).json({ message: "No se pudo reportar al usuario" });
    }

  } catch (error) {
    console.error("Error reporting user:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
/**
 * Get all external users
 */
export const getAllExternalUsers = async (req: Request, res: Response) => {
  try {
    const externalUsers = await usersService.getAllExternalUsers();
    res.status(200).json(externalUsers);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Convert external user to patient
 * @param userId
 */
export const convertExternalToPatient = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const patient = await usersService.convertExternalToPatient(userId);
    res.status(200).json({
      message: 'User converted to patient successfully',
      patient
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

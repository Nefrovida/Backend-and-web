import { Request, Response } from 'express';
import * as authService from '../service/auth.service';
import { LoginRequest, RegisterRequest } from '../types/auth.types';

/**
 * Login controller
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const loginData: LoginRequest = req.body;
    const result = await authService.login(loginData);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Register controller
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const registerData: RegisterRequest = req.body;
    const result = await authService.register(registerData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Refresh token controller
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // User should be attached by auth middleware
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const newAccessToken = await authService.refreshAccessToken(req.user.userId);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Logout controller (client-side token removal)
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  // With JWT, logout is typically handled client-side by removing the token
  // This endpoint can be used for logging purposes or token blacklisting if implemented
  res.status(200).json({ message: 'Logged out successfully' });
};

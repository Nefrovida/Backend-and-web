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
    // Set tokens in httpOnly cookies
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    // Return only user data, not tokens by default
    // Mobile/native clients can request tokens in the JSON response by
    // sending the header 'x-return-tokens: true' or query param 'returnTokens=true'
    const returnTokensHeader = String(req.headers['x-return-tokens'] || '').toLowerCase() === 'true';
    const returnTokensQuery = String(req.query.returnTokens || '').toLowerCase() === 'true';

    if (returnTokensHeader || returnTokensQuery) {
      res.status(200).json({ user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken });
      return;
    }

    res.status(200).json({ user: result.user });
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
    
    // Set tokens in httpOnly cookies
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    // Return only user data, not tokens by default
    // Mobile/native clients can request tokens in the JSON response by
    // sending the header 'x-return-tokens: true' or query param 'returnTokens=true'
    const returnTokensHeader = String(req.headers['x-return-tokens'] || '').toLowerCase() === 'true';
    const returnTokensQuery = String(req.query.returnTokens || '').toLowerCase() === 'true';

    if (returnTokensHeader || returnTokensQuery) {
      res.status(201).json({ user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken });
      return;
    }

    res.status(201).json({ user: result.user });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Refresh token controller
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get refresh token from cookie
    let refreshTokenFromCookie = req.cookies?.refreshToken;

    // If cookie isn't available (native/mobile clients), allow Authorization: Bearer <refreshToken>
    if (!refreshTokenFromCookie) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        refreshTokenFromCookie = authHeader.substring(7);
      }
    }
    
    if (!refreshTokenFromCookie) {
      res.status(401).json({ error: 'No refresh token provided' });
      return;
    }

    const result = await authService.refreshAccessToken(refreshTokenFromCookie);
    
    // Update accessToken cookie
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.status(200).json({ user: result.user });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Logout controller
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  // Clear httpOnly cookies
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  });
  
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  });
  
  res.status(200).json({ message: 'Logged out successfully' });
};

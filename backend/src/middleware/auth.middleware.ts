import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../util/jwt.util';
import { UnauthorizedError } from '../util/errors.util';

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies?.accessToken;

    if (!token) {
      // Fallback to Authorization header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('No token provided');
      }
      
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }

    // Verify token and attach user to request
    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    // Pasar el error al error handler global
    next(error instanceof UnauthorizedError ? error : new UnauthorizedError('Invalid or expired token'));
  }
};
import { Request, Response, NextFunction } from 'express';
import { 
  UnauthorizedError, 
  ForbiddenError, 
  BadRequestError, 
  NotFoundError, 
  ConflictError 
} from '../util/errors.util';

/**
 * Global error handler middleware
 * DEBE ir AL FINAL de todas las rutas en app.ts
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err);

  // Manejo de errores personalizados
  if (
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof BadRequestError ||
    err instanceof NotFoundError ||
    err instanceof ConflictError
  ) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message
      }
    });
    return;
  }

  // Error genérico no manejado
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error'
    }
  });
}
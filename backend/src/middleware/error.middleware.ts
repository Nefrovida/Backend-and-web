/**
 * Global Error Handling Middleware
 * 
 * Captura errores de toda la aplicación y los formatea en respuestas consistentes
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '../../prisma/database/prisma/client';

/**
 * Middleware global de manejo de errores
 * DEBE ser el último middleware registrado en la aplicación
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log del error en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Error capturado:', error);
  }

  // 1. Errores de validación con Zod
  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Los datos enviados no son válidos',
      issues: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  // 2. Errores de Prisma - Record not found
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      res.status(404).json({
        error: 'Not Found',
        message: 'El recurso solicitado no existe',
      });
      return;
    }

    // P2002: Unique constraint violation
    if (error.code === 'P2002') {
      const target = (error.meta?.target as string[]) || [];
      res.status(409).json({
        error: 'Conflict',
        message: `Ya existe un registro con estos valores: ${target.join(', ')}`,
      });
      return;
    }

    // P2003: Foreign key constraint violation
    if (error.code === 'P2003') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Referencia a un recurso inexistente',
      });
      return;
    }
  }

  // 3. Errores personalizados con statusCode
  if ('statusCode' in error && typeof error.statusCode === 'number') {
    res.status(error.statusCode).json({
      error: error.name || 'Error',
      message: error.message,
    });
    return;
  }

  // 4. Error genérico (500)
  res.status(500).json({
    error: 'Internal Server Error',
    message:
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'Ocurrió un error inesperado',
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
    }),
  });
}

/**
 * Middleware para manejar rutas no encontradas (404)
 * Registrar ANTES del errorHandler
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.status(404).json({
    error: 'Not Found',
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
}

/**
 * Clase para errores HTTP personalizados
 */
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * Helper para lanzar errores 404
 */
export function notFound(message: string = 'Recurso no encontrado'): never {
  throw new HttpError(404, message);
}

/**
 * Helper para lanzar errores 403
 */
export function forbidden(message: string = 'Acceso denegado'): never {
  throw new HttpError(403, message);
}

/**
 * Helper para lanzar errores 400
 */
export function badRequest(message: string = 'Solicitud inválida'): never {
  throw new HttpError(400, message);
}

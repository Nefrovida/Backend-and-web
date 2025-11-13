/**
 * Authentication Middleware
 * 
 * Verifica el token JWT en el header Authorization
 * y carga el usuario autenticado con su rol y privilegios
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

/**
 * Middleware para autenticar requests con JWT
 * 
 * - Lee token del header Authorization: Bearer <token>
 * - Verifica firma JWT con SECRET
 * - Carga usuario completo desde base de datos con rol y privilegios
 * - Adjunta usuario a req.user
 * 
 * @throws 401 si no hay token o es inválido
 * @throws 401 si el usuario no existe o está inactivo
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // 1. Extraer token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No se proporcionó token de autenticación',
      });
      return;
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // 2. Verificar token JWT
    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error('SECRET no está configurado en variables de entorno');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    // 3. Cargar usuario desde base de datos con rol y privilegios
    const user = await prisma.users.findUnique({
      where: { user_id: decoded.userId },
      include: {
        role: {
          include: {
            role_privileges: {
              include: {
                privilege: true,
              },
            },
          },
        },
      },
    });

    // 4. Validar que el usuario exista y esté activo
    if (!user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Usuario no encontrado',
      });
      return;
    }

    if (!user.active) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Usuario inactivo',
      });
      return;
    }

    // 5. Adjuntar usuario autenticado a la request
    req.user = user;

    next();
  } catch (error) {
    // Errores de JWT (token expirado, firma inválida, etc.)
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token inválido',
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token expirado',
      });
      return;
    }

    // Error inesperado
    next(error);
  }
}

/**
 * Middleware opcional: permite requests sin autenticación
 * pero carga el usuario si hay token válido
 */
export async function optionalAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  
  // Si no hay token, continuar sin usuario
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  // Si hay token, intentar autenticar (pero no fallar si es inválido)
  try {
    await authenticate(req, res, next);
  } catch {
    // Ignorar errores y continuar sin usuario
    next();
  }
}

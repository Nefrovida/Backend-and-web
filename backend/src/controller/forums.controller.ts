// backend/src/controller/forums.controller.ts
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { createForumSchema, updateForumSchema, replyToMessageSchema } from '../validators/forum.validator';
import * as forumsService from '../service/forums.service';

import * as forumModel from '../model/forum.model';
import { BadRequestError, NotFoundError } from '../util/errors.util.js';
import { DEFAULT_ROLES } from '../config/constants';


/**
 * Create a new forum (Admin only)
 */

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createForumSchema.parse(req.body);
    const userId = req.user!.userId;
    const newForum = await forumsService.createForum(validatedData, userId);
    res.status(201).json(newForum);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const formatted = error.issues.map((issue) => {
        const field = issue.path?.[0];
        let message = issue.message;

        if (field === 'name') {
          if (issue.code === 'too_big') message = 'El nombre no puede exceder 100 caracteres';
          if (issue.code === 'too_small') message = 'El nombre debe tener al menos 3 caracteres';
        }

        if (field === 'description') {
          if (issue.code === 'too_big') message = 'La descripción no puede exceder 255 caracteres';
        }

        return { field, message };
      });

      res.status(400).json({ errors: formatted });
      return;
    }

    res.status(error.statusCode || 400).json({ error: error.message });
  }
};

/**
 * Get all forums
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    let isPublic = req.query.isPublic === 'true' ? true :
      req.query.isPublic === 'false' ? false :
        undefined;

    // If the user is a Patient and did not specify a visibility filter, default to public-only forums
    if (req.query.isPublic === undefined && req.user?.roleId === DEFAULT_ROLES.PATIENT) {
      isPublic = true;
    }

    // Call service to get forums
    const forums = await forumsService.getAllForums(page, limit, { search, isPublic });
    res.status(200).json(forums);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Get a single forum by id
 *
 * GET /api/forums/:forumId
 * Middlewares:
 *  - authenticate
 *  - requirePrivileges([Privilege.VIEW_FORUMS])
 */
export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const forumId = parseInt(req.params.forumId);

    if (isNaN(forumId)) {
      res.status(400).json({ error: 'ID de foro inválido' });
      return;
    }

    const forum = await forumsService.getForumById(forumId);

    if (!forum) {
      res.status(404).json({ error: 'Foro no encontrado' });
      return;
    }

    // If the forum is private, ensure the user is member or has special privileges
    if (!forum.public_status) {
      const isMember = await forumsService.isUserMemberOfForum(forumId, req.user!.userId);
      if (!isMember) {
        // Non-members cannot access private forums
        res.status(403).json({ error: 'No tiene permisos para ver este foro' });
        return;
      }
    }

    res.status(200).json(forum);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Get forums where the authenticated user is a member
 *
 * GET /api/forums/me
 */
export const getMyForums = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const forums = await forumsService.getForumsForUser(userId);

    res.status(200).json(forums);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

/**
 * Update a forum (Admin only)
 */
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = updateForumSchema.parse(req.body);
    const forumId = parseInt(req.params.forumId);

    if (isNaN(forumId)) {
      res.status(400).json({ field: 'forumId', message: 'ID de foro inválido' });
      return;
    }

    const updatedForum = await forumsService.updateForum(forumId, validatedData);
    res.status(200).json(updatedForum);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const formatted = error.issues.map((issue) => {
        const field = issue.path?.[0];
        let message = issue.message;

        if (field === 'name') {
          if (issue.code === 'too_big') message = 'El nombre no puede exceder 100 caracteres';
          if (issue.code === 'too_small') message = 'El nombre debe tener al menos 3 caracteres';
        }

        if (field === 'description') {
          if (issue.code === 'too_big') message = 'La descripción no puede exceder 255 caracteres';
        }

        return { field, message };
      });

      res.status(400).json({ errors: formatted });
      return;
    }

    res.status(error.statusCode || 400).json({ error: error.message });
  }
};

/**
 * Get all admin users with pagination
 * 
 * User Story: "Admin: View Admin Users List"
 * 
 * Flow:
 * 1. Extract query parameters (page, limit)
 * 2. Calculate skip and take values for pagination
 * 3. Call model function to retrieve admin users
 * 4. Return paginated admin users with metadata
 * 
 * Prerequisites (handled by middlewares):
 * - authenticate: Ensures req.user exists and is valid
 * - requirePrivileges(['MANAGE_USERS']): Ensures user has permission
 * 
 * Query Parameters:
 * - page: number (default: 1, minimum: 1)
 * - limit: number (default: 10, minimum: 1, maximum: 100)
 * 
 * Response format:
 * {
 *   data: User[],
 *   pagination: {
 *     currentPage: number,
 *     pageSize: number,
 *     totalRecords: number,
 *     totalPages: number,
 *     hasNext: boolean,
 *     hasPrevious: boolean
 *   }
 * }
 * 
 * @param req - Express request with query params
 * @param res - Express response
 */
export const getAdminUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract and validate query parameters
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));

    // Calculate pagination values
    const skip = (page - 1) * limit;
    const take = limit;

    // Get admin users and total count in parallel for better performance
    const [adminUsers, totalCount] = await Promise.all([
      forumModel.getAdminUsersWithPagination(skip, take),
      forumModel.countAdminUsers()
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    // Build response with data and pagination metadata
    const response = {
      data: adminUsers,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalRecords: totalCount,
        totalPages,
        hasNext,
        hasPrevious
      }
    };

    // Respond with paginated admin users
    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Error interno del servidor al obtener administradores'
    });
  }
};

/**
 * Check if a specific user is admin
 * 
 * User Story: "System: Verify Admin Status"
 * 
 * @param req - Express request with userId in params
 * @param res - Express response
 */
export const checkAdminStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      res.status(400).json({ error: 'ID de usuario requerido' });
      return;
    }

    const isAdmin = await forumModel.isUserAdmin(userId);

    res.status(200).json({
      userId,
      isAdmin,
      message: isAdmin ? 'El usuario es administrador' : 'El usuario no es administrador'
    });
  } catch (error: any) {
    console.error('Error checking admin status:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Error interno del servidor al verificar estado de administrador'
    });
  }
};

/**
 * Get forum administrators
 */
export const getForumAdministrators = async (req: Request, res: Response): Promise<void> => {
  try {
    const forumId = parseInt(req.params.forumId);

    if (isNaN(forumId)) {
      res.status(400).json({ error: 'ID de foro inválido' });
      return;
    }

    // Verificar que el foro existe
    const forum = await forumModel.findById(forumId);
    if (!forum) {
      res.status(404).json({ error: 'Foro no encontrado' });
      return;
    }

    // Obtener administradores del foro (OWNER y MODERATOR)
    const administrators = await forumModel.getForumAdministrators(forumId);

    res.status(200).json({
      data: administrators,
      forum: {
        forum_id: forum.forum_id,
        name: forum.name
      }
    });
  } catch (error: any) {
    console.error('Error fetching forum administrators:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Error interno del servidor'
    });
  }
};

/**
 * Add administrator to forum
 */
export const addForumAdministrator = async (req: Request, res: Response): Promise<void> => {
  try {
    const forumId = parseInt(req.params.forumId);
    const { user_id } = req.body;

    if (isNaN(forumId)) {
      res.status(400).json({ error: 'ID de foro inválido' });
      return;
    }

    if (!user_id) {
      res.status(400).json({ error: 'ID de usuario requerido' });
      return;
    }

    // Verificar que el foro existe
    const forum = await forumModel.findById(forumId);
    if (!forum) {
      res.status(404).json({ error: 'Foro no encontrado' });
      return;
    }

    // Verificar que el usuario es admin global
    const isAdmin = await forumModel.isUserAdmin(user_id);
    if (!isAdmin) {
      res.status(400).json({ error: 'Solo los administradores globales pueden ser asignados como administradores de foro' });
      return;
    }

    // Verificar si ya está en el foro
    const existingRole = await forumModel.getUserRole(forumId, user_id);

    if (existingRole) {
      // Si ya está en el foro, actualizar a MODERATOR
      await forumModel.updateUserRole(forumId, user_id, 'MODERATOR');
    } else {
      // Si no está en el foro, agregarlo como MODERATOR
      await forumModel.addUserToForum(forumId, user_id, 'MODERATOR');
    }

    res.status(200).json({
      message: 'Usuario asignado como administrador del foro exitosamente',
      user_id,
      forum_id: forumId,
      role: 'MODERATOR'
    });
  } catch (error: any) {
    console.error('Error adding forum administrator:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Error interno del servidor'
    });
  }
};

/**
 * Remove administrator from forum
 */
export const removeForumAdministrator = async (req: Request, res: Response): Promise<void> => {
  try {
    const forumId = parseInt(req.params.forumId);
    const userId = req.params.userId;

    if (isNaN(forumId)) {
      res.status(400).json({ error: 'ID de foro inválido' });
      return;
    }

    if (!userId) {
      res.status(400).json({ error: 'ID de usuario requerido' });
      return;
    }

    // Verificar que el foro existe
    const forum = await forumModel.findById(forumId);
    if (!forum) {
      res.status(404).json({ error: 'Foro no encontrado' });
      return;
    }

    // Verificar que el usuario está en el foro
    const userRole = await forumModel.getUserRole(forumId, userId);
    if (!userRole) {
      res.status(404).json({ error: 'Usuario no encontrado en el foro' });
      return;
    }

    // No permitir remover al OWNER
    if (userRole === 'OWNER') {
      res.status(400).json({ error: 'No se puede remover al creador del foro' });
      return;
    }

    // Remover del foro completamente
    await forumModel.removeUserFromForum(forumId, userId);

    res.status(200).json({
      message: 'Administrador removido del foro exitosamente',
      user_id: userId,
      forum_id: forumId
    });
  } catch (error: any) {
    console.error('Error removing forum administrator:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Error interno del servidor'
    });
  }
};

/**
 * Get all regular users (non-admin) with pagination
 */
export const getRegularUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract and validate query parameters
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));

    // Calculate pagination values
    const skip = (page - 1) * limit;
    const take = limit;

    // Get regular users and total count in parallel for better performance
    const [regularUsers, totalCount] = await Promise.all([
      forumModel.getNonAdminUsersWithPagination(skip, take),
      forumModel.countNonAdminUsers()
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    // Build response with data and pagination metadata
    const response = {
      data: regularUsers,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalRecords: totalCount,
        totalPages,
        hasNext,
        hasPrevious
      }
    };

    // Respond with paginated regular users
    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error fetching regular users:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Error interno del servidor al obtener usuarios'
    });
  }
};

/**
 * Get forum members (regular members)
 */
export const getForumMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const forumId = parseInt(req.params.forumId);

    if (isNaN(forumId)) {
      res.status(400).json({ error: 'ID de foro inválido' });
      return;
    }

    // Verificar que el foro existe
    const forum = await forumModel.findById(forumId);
    if (!forum) {
      res.status(404).json({ error: 'Foro no encontrado' });
      return;
    }

    // Obtener miembros regulares del foro (MEMBER y VIEWER)
    const members = await forumModel.getForumRegularMembers(forumId);

    res.status(200).json({
      data: members,
      forum: {
        forum_id: forum.forum_id,
        name: forum.name
      }
    });
  } catch (error: any) {
    console.error('Error fetching forum members:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Error interno del servidor'
    });
  }
};

/**
 * Add member to forum
 */
export const addForumMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const forumId = parseInt(req.params.forumId);
    const { user_id } = req.body;

    if (isNaN(forumId)) {
      res.status(400).json({ error: 'ID de foro inválido' });
      return;
    }

    if (!user_id) {
      res.status(400).json({ error: 'ID de usuario requerido' });
      return;
    }

    // Verificar que el foro existe
    const forum = await forumModel.findById(forumId);
    if (!forum) {
      res.status(404).json({ error: 'Foro no encontrado' });
      return;
    }

    // Verificar que el usuario no es admin (los admins se manejan en otro endpoint)
    const isAdmin = await forumModel.isUserAdmin(user_id);
    if (isAdmin) {
      res.status(400).json({ error: 'Los administradores deben ser agregados a través del endpoint de administradores' });
      return;
    }

    // Verificar si ya está en el foro
    const existingRole = await forumModel.getUserRole(forumId, user_id);

    if (existingRole) {
      res.status(400).json({ error: 'El usuario ya es miembro de este foro' });
      return;
    }

    // Agregar como MEMBER
    await forumModel.addUserToForum(forumId, user_id, 'MEMBER');

    res.status(200).json({
      message: 'Usuario agregado como miembro del foro exitosamente',
      user_id,
      forum_id: forumId,
      role: 'MEMBER'
    });
  } catch (error: any) {
    console.error('Error adding forum member:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Error interno del servidor'
    });
  }
};

/**
 * Remove member from forum
 */
export const removeForumMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const forumId = parseInt(req.params.forumId);
    const userId = req.params.userId;

    if (isNaN(forumId)) {
      res.status(400).json({ error: 'ID de foro inválido' });
      return;
    }

    if (!userId) {
      res.status(400).json({ error: 'ID de usuario requerido' });
      return;
    }

    // Verificar que el foro existe
    const forum = await forumModel.findById(forumId);
    if (!forum) {
      res.status(404).json({ error: 'Foro no encontrado' });
      return;
    }

    // Verificar que el usuario está en el foro
    const userRole = await forumModel.getUserRole(forumId, userId);
    if (!userRole) {
      res.status(404).json({ error: 'Usuario no encontrado en el foro' });
      return;
    }

    // No permitir remover al OWNER o MODERATOR desde este endpoint
    if (userRole === 'OWNER' || userRole === 'MODERATOR') {
      res.status(400).json({ error: 'Los administradores deben ser removidos a través del endpoint de administradores' });
      return;
    }

    // Remover del foro completamente
    await forumModel.removeUserFromForum(forumId, userId);

    res.status(200).json({
      message: 'Miembro removido del foro exitosamente',
      user_id: userId,
      forum_id: forumId
    });
  } catch (error: any) {
    console.error('Error removing forum member:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Error interno del servidor'
    });
  }
};


/**
 * Reply to a message in a forum
 */
export const replyToMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = replyToMessageSchema.parse(req.body);
    const forumId = parseInt(req.params.forumId);

    if (isNaN(forumId)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FORUM_ID',
          message: 'El ID del foro debe ser un número válido',
          field: 'forumId'
        }
      });
      return;
    }

    const userId = req.user!.userId;

    const result = await forumsService.replyToMessageService(
      forumId,
      userId,
      validatedData.parentMessageId,
      validatedData.content
    );

    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const formatted = error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Error de validación en los datos enviados',
          details: formatted
        }
      });
      return;
    }

    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message
        }
      });
      return;
    }

    if (error instanceof BadRequestError) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: error.message
        }
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor al procesar la respuesta'
      }
    });
  }
};
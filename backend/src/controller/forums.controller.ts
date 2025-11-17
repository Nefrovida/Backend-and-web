import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { createForumSchema, updateForumSchema } from '../validators/forum.validator';
import * as forumsService from '../service/forums.service';
import * as forumModel from '../model/forum.model';

/**
 * Create a new forum (Admin only)
 * 
 * User Story: "Admin: Create Forums"
 * 
 * Flow:
 * 1. Validate request body with Zod schema
 * 2. Extract userId from authenticated user (req.user)
 * 3. Call service to create forum with business logic
 * 4. Return created forum with 201 status
 * 
 * Prerequisites (handled by middlewares):
 * - authenticate: Ensures req.user exists and is valid
 * - requirePrivileges(['CREATE_FORUMS']): Ensures user has permission
 * 
 * @param req - Express request with validated user and body
 * @param res - Express response
 */

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body with Zod
    // This ensures type safety and data integrity before reaching the service
    const validatedData = createForumSchema.parse(req.body);

    // Extract userId from JWT payload (guaranteed to exist after authenticate middleware)
    const userId = req.user!.userId;

    // Call service to execute business logic
    const newForum = await forumsService.createForum(validatedData, userId);

    // Respond with created forum
    res.status(201).json(newForum);
  } catch (error: any) {
    // Handle Zod validation errors with friendly, field-specific messages
    if (error instanceof ZodError) {
      const formatted = error.errors.map((e) => {
        const field = e.path && e.path.length ? String(e.path[0]) : undefined;
        // Provide friendly messages for common validation failures
        let message = e.message;

        if (field === 'name') {
          if ((e as any).code === 'too_big') message = 'El nombre no puede exceder 100 caracteres';
          if ((e as any).code === 'too_small') message = 'El nombre debe tener al menos 3 caracteres';
        }

        if (field === 'description') {
          if ((e as any).code === 'too_big') message = 'La descripción no puede exceder 255 caracteres';
        }

        return { field, message };
      });

  res.status(400).json({ errors: formatted });
  return;
    }

    // Delegate other errors to Express-style response
    res.status(error.statusCode || 400).json({ error: error.message });
  }
};

/**
 * Get all forums
 * 
 * User Story: "User: View Forums List"
 * 
 * Flow:
 * 1. Extract query parameters (page, limit, search, isPublic)
 * 2. Call service to retrieve forums with filters
 * 3. Return array of forums with 200 status
 * 
 * Prerequisites (handled by middlewares):
 * - authenticate: Ensures req.user exists and is valid
 * - requirePrivileges(['VIEW_FORUMS']): Ensures user has permission
 * 
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 20)
 * - search: string (optional)
 * - isPublic: boolean (optional)
 * 
 * @param req - Express request with query params
 * @param res - Express response
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract and parse query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    const isPublic = req.query.isPublic === 'true' ? true : 
                     req.query.isPublic === 'false' ? false : 
                     undefined;

    // Call service to get forums
    const forums = await forumsService.getAllForums(page, limit, {
      search,
      isPublic,
    });

    // Respond with forums array
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
    // Validate request body with Zod
    const validatedData = updateForumSchema.parse(req.body);

    // Extract forumId from URL params
    const forumId = parseInt(req.params.forumId);
    if (isNaN(forumId)) {
      res.status(400).json({ error: 'ID de foro inválido' });
      return;
    }

    // Call service to execute business logic
    const updatedForum = await forumsService.updateForum(forumId, validatedData);

    // Respond with updated forum
    res.status(200).json(updatedForum);
  } catch (error: any) {
    // Handle Zod validation errors with friendly, field-specific messages
    if (error instanceof ZodError) {
      const formatted = error.errors.map((e) => {
        const field = e.path && e.path.length ? String(e.path[0]) : undefined;
        let message = e.message;

        if (field === 'name') {
          if ((e as any).code === 'too_big') message = 'El nombre no puede exceder 100 caracteres';
          if ((e as any).code === 'too_small') message = 'El nombre debe tener al menos 3 caracteres';
        }

        if (field === 'description') {
          if ((e as any).code === 'too_big') message = 'La descripción no puede exceder 255 caracteres';
        }

        return { field, message };
      });

      res.status(400).json({ errors: formatted });
      return;
    }

    // Delegate other errors to Express-style response
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


/**
 * Forums Controller
 * 
 * Maneja las peticiones HTTP para la gestión de foros
 */

import { Request, Response, NextFunction } from 'express';
import {
  createForumSchema,
  updateForumSchema,
  getForumsSchema,
  getForumByIdSchema,
  deleteForumSchema,
  type CreateForumInput,
  type UpdateForumInput,
  type GetForumsInput,
  type GetForumByIdInput,
  type DeleteForumInput,
} from '../dto/forums.dto';
import * as forumsService from '../service/forums.service';

/**
 * POST /api/forums
 * Crea un nuevo foro
 */
export async function createForum(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validar input
    const validatedData = createForumSchema.parse({ body: req.body });

    // Extraer user_id del usuario autenticado
    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    // Crear foro
    const forum = await forumsService.createForum({
      title: validatedData.body.title,
      description: validatedData.body.description,
      visibility: validatedData.body.visibility,
      createdById: req.user.user_id,
    });

    res.status(201).json({
      message: 'Foro creado exitosamente',
      data: forum,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/forums
 * Lista todos los foros con paginación
 */
export async function getForums(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validar query params
    const validatedParams = getForumsSchema.parse({ query: req.query });

    // Extraer privilegios del usuario (si está autenticado)
    const userPrivileges = req.user?.role.role_privileges.map(
      (rp) => rp.privilege.description
    ) || [];

    // Obtener foros
    const result = await forumsService.getForums({
      page: validatedParams.query.page,
      limit: validatedParams.query.limit,
      visibility: validatedParams.query.visibility,
      userId: req.user?.user_id,
      userPrivileges,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/forums/:id
 * Obtiene un foro por ID
 */
export async function getForumById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validar params
    const validatedParams = getForumByIdSchema.parse({ params: req.params });

    // Extraer privilegios del usuario (si está autenticado)
    const userPrivileges = req.user?.role.role_privileges.map(
      (rp) => rp.privilege.description
    ) || [];

    // Obtener foro
    const forum = await forumsService.getForumById(
      validatedParams.params.id,
      req.user?.user_id,
      userPrivileges
    );

    res.status(200).json({
      data: forum,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/forums/:id
 * Actualiza un foro
 */
export async function updateForum(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validar params
    const validatedParams = getForumByIdSchema.parse({ params: req.params });

    // Validar body
    const validatedData = updateForumSchema.parse({ 
      params: req.params,
      body: req.body 
    });

    // Verificar autenticación
    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    // Extraer privilegios
    const userPrivileges = req.user.role.role_privileges.map(
      (rp) => rp.privilege.description
    );

    // Actualizar foro
    const forum = await forumsService.updateForum(
      validatedParams.params.id,
      { visibility: validatedData.body.visibility },
      req.user.user_id,
      userPrivileges
    );

    res.status(200).json({
      message: 'Foro actualizado exitosamente',
      data: forum,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/forums/:id
 * Elimina un foro
 */
export async function deleteForum(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validar params
    const validatedParams = deleteForumSchema.parse({ params: req.params });

    // Verificar autenticación
    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    // Extraer privilegios
    const userPrivileges = req.user.role.role_privileges.map(
      (rp) => rp.privilege.description
    );

    // Eliminar foro
    await forumsService.deleteForum(
      validatedParams.params.id,
      req.user.user_id,
      userPrivileges
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/forums/:id/members
 * Agrega un miembro a un foro PRIVATE
 */
export async function addMember(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validar params
    const validatedParams = getForumByIdSchema.parse({ params: req.params });

    // Validar body
    const { userId } = req.body;
    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ error: 'userId es requerido y debe ser string' });
      return;
    }

    // Verificar autenticación
    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    // Extraer privilegios
    const userPrivileges = req.user.role.role_privileges.map(
      (rp) => rp.privilege.description
    );

    // Agregar miembro
    const membership = await forumsService.addForumMember(
      validatedParams.params.id,
      userId,
      req.user.user_id,
      userPrivileges
    );

    res.status(201).json({
      message: 'Miembro agregado exitosamente',
      data: membership,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/forums/:id/members/:userId
 * Remueve un miembro de un foro
 */
export async function removeMember(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validar params
    const { id, userId } = req.params;

    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ error: 'userId es requerido' });
      return;
    }

    // Verificar autenticación
    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    // Extraer privilegios
    const userPrivileges = req.user.role.role_privileges.map(
      (rp) => rp.privilege.description
    );

    // Remover miembro
    await forumsService.removeForumMember(
      id,
      userId,
      req.user.user_id,
      userPrivileges
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

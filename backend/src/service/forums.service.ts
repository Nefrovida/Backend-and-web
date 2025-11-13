/**
 * Forums Service
 * 
 * Lógica de negocio para la gestión de foros
 */

import { prisma } from '../lib/prisma';
import { Visibility } from '../../prisma/database/prisma/enums';
import { notFound, forbidden } from '../middleware/error.middleware';
import { Privilege } from '../types/rbac.types';

// Types para los parámetros de entrada
export interface CreateForumInput {
  title: string;
  description?: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  createdById: string;
}

export interface UpdateForumInput {
  title?: string;
  description?: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
}

export interface GetForumsParams {
  page: number;
  limit: number;
  visibility?: 'PUBLIC' | 'PRIVATE';
  userId?: string; // Para filtrar foros del usuario autenticado
  userPrivileges?: string[]; // Para determinar acceso
}

/**
 * Crea un nuevo foro
 */
export async function createForum(input: CreateForumInput) {
  const forum = await prisma.forum.create({
    data: {
      title: input.title,
      description: input.description,
      visibility: input.visibility as Visibility,
      createdById: input.createdById,
    },
    include: {
      createdBy: {
        select: {
          user_id: true,
          name: true,
          parent_last_name: true,
          maternal_last_name: true,
        },
      },
      _count: {
        select: {
          messages: true,
          members: true,
        },
      },
    },
  });

  return forum;
}

/**
 * Obtiene lista de foros con paginación
 * 
 * Reglas de visibility:
 * - PUBLIC: Visible para todos
 * - PRIVATE: Solo visible para:
 *   - Miembros del foro (users_forums)
 *   - Creador del foro
 *   - Usuarios con privilegio VIEW_ALL_FORUMS
 */
export async function getForums(params: GetForumsParams) {
  const { page, limit, visibility, userId, userPrivileges = [] } = params;
  const skip = (page - 1) * limit;

  // Construir filtros WHERE
  const where: any = {};

  // Filtro por visibility (si se especifica)
  if (visibility) {
    where.visibility = visibility;
  }

  // Si NO tiene privilegio MANAGE_FORUMS (admin), aplicar filtros de acceso
  const canViewAll = userPrivileges.includes(Privilege.MANAGE_FORUMS);

  if (!canViewAll && userId) {
    // Usuario debe ver:
    // 1. Todos los foros PUBLIC
    // 2. Foros PRIVATE donde es miembro
    // 3. Foros PRIVATE que él creó
    where.OR = [
      { visibility: Visibility.PUBLIC },
      { 
        AND: [
          { visibility: Visibility.PRIVATE },
          { createdById: userId }
        ]
      },
      {
        AND: [
          { visibility: Visibility.PRIVATE },
          { members: { some: { user_id: userId } } }
        ]
      }
    ];
  }

  // Ejecutar queries en paralelo
  const [forums, total] = await Promise.all([
    prisma.forum.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        createdBy: {
          select: {
            user_id: true,
            name: true,
            parent_last_name: true,
            maternal_last_name: true,
          },
        },
        _count: {
          select: {
            messages: true,
            members: true,
          },
        },
      },
    }),
    prisma.forum.count({ where }),
  ]);

  return {
    data: forums,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Obtiene un foro por ID
 * 
 * Valida acceso según visibility:
 * - PUBLIC: Todos pueden ver
 * - PRIVATE: Solo miembros, creador o admin
 */
export async function getForumById(
  forumId: string,
  userId?: string,
  userPrivileges: string[] = []
) {
  const forum = await prisma.forum.findUnique({
    where: { id: forumId },
    include: {
      createdBy: {
        select: {
          user_id: true,
          name: true,
          parent_last_name: true,
          maternal_last_name: true,
        },
      },
      members: {
        select: {
          user_id: true,
          user: {
            select: {
              name: true,
              parent_last_name: true,
              maternal_last_name: true,
            },
          },
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  if (!forum) {
    notFound('Foro no encontrado');
  }

  // Validar acceso si es PRIVATE
  if (forum.visibility === Visibility.PRIVATE) {
    const canViewAll = userPrivileges.includes(Privilege.MANAGE_FORUMS);
    const isCreator = forum.createdById === userId;
    const isMember = forum.members.some((m: any) => m.user_id === userId);

    if (!canViewAll && !isCreator && !isMember) {
      forbidden('No tiene acceso a este foro privado');
    }
  }

  return forum;
}

/**
 * Actualiza un foro
 * 
 * Solo el creador o usuarios con UPDATE_ANY_FORUM pueden modificar
 */
export async function updateForum(
  forumId: string,
  input: UpdateForumInput,
  userId: string,
  userPrivileges: string[] = []
) {
  // Verificar que el foro existe
  const existingForum = await prisma.forum.findUnique({
    where: { id: forumId },
  });

  if (!existingForum) {
    notFound('Foro no encontrado');
  }

  // Validar permisos: creador o privilegio UPDATE_FORUMS/MANAGE_FORUMS
  const canUpdateAny = userPrivileges.includes(Privilege.UPDATE_FORUMS) || 
                       userPrivileges.includes(Privilege.MANAGE_FORUMS);
  const isCreator = existingForum.createdById === userId;

  if (!canUpdateAny && !isCreator) {
    forbidden('Solo el creador o administradores pueden modificar este foro');
  }

  // Actualizar
  const updatedForum = await prisma.forum.update({
    where: { id: forumId },
    data: {
      ...(input.title && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.visibility && { visibility: input.visibility as Visibility }),
    },
    include: {
      createdBy: {
        select: {
          user_id: true,
          name: true,
          parent_last_name: true,
          maternal_last_name: true,
        },
      },
      _count: {
        select: {
          messages: true,
          members: true,
        },
      },
    },
  });

  return updatedForum;
}

/**
 * Elimina un foro
 * 
 * Solo el creador o usuarios con DELETE_ANY_FORUM pueden eliminar
 */
export async function deleteForum(
  forumId: string,
  userId: string,
  userPrivileges: string[] = []
) {
  // Verificar que el foro existe
  const existingForum = await prisma.forum.findUnique({
    where: { id: forumId },
  });

  if (!existingForum) {
    notFound('Foro no encontrado');
  }

  // Validar permisos: creador o privilegio DELETE_FORUMS/MANAGE_FORUMS
  const canDeleteAny = userPrivileges.includes(Privilege.DELETE_FORUMS) ||
                       userPrivileges.includes(Privilege.MANAGE_FORUMS);
  const isCreator = existingForum.createdById === userId;

  if (!canDeleteAny && !isCreator) {
    forbidden('Solo el creador o administradores pueden eliminar este foro');
  }

  // Eliminar (Cascade borrará messages y members relacionados)
  await prisma.forum.delete({
    where: { id: forumId },
  });

  return { success: true };
}

/**
 * Agrega un usuario como miembro de un foro PRIVATE
 * 
 * Solo el creador o admin pueden agregar miembros
 */
export async function addForumMember(
  forumId: string,
  memberUserId: string,
  requestingUserId: string,
  userPrivileges: string[] = []
) {
  const forum = await prisma.forum.findUnique({
    where: { id: forumId },
  });

  if (!forum) {
    notFound('Foro no encontrado');
  }

  // Validar permisos (solo MANAGE_FORUMS puede agregar miembros)
  const canManageMembers = userPrivileges.includes(Privilege.MANAGE_FORUMS);
  const isCreator = forum.createdById === requestingUserId;

  if (!canManageMembers && !isCreator) {
    forbidden('Solo el creador o administradores pueden agregar miembros');
  }

  // Crear membresía (upsert para evitar duplicados)
  const membership = await prisma.users_forums.upsert({
    where: {
      user_id_forum_id: {
        user_id: memberUserId,
        forum_id: forumId,
      },
    },
    update: {},
    create: {
      user_id: memberUserId,
      forum_id: forumId,
      rol_forum: 'member', // Rol por defecto
    },
  });

  return membership;
}

/**
 * Remueve un miembro de un foro
 */
export async function removeForumMember(
  forumId: string,
  memberUserId: string,
  requestingUserId: string,
  userPrivileges: string[] = []
) {
  const forum = await prisma.forum.findUnique({
    where: { id: forumId },
  });

  if (!forum) {
    notFound('Foro no encontrado');
  }

  // Validar permisos (solo MANAGE_FORUMS puede remover miembros)
  const canManageMembers = userPrivileges.includes(Privilege.MANAGE_FORUMS);
  const isCreator = forum.createdById === requestingUserId;

  if (!canManageMembers && !isCreator) {
    forbidden('Solo el creador o administradores pueden remover miembros');
  }

  // Eliminar membresía
  await prisma.users_forums.delete({
    where: {
      user_id_forum_id: {
        user_id: memberUserId,
        forum_id: forumId,
      },
    },
  });

  return { success: true };
}

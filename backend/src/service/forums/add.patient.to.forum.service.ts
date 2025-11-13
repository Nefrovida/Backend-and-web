import {
  findForumById,
  findPatientByUserId,
  findUserInForum,
  addUserToForum
} from '../../model/forums/add.patient.to.forum.model';
import {
  NotFoundError,
  BadRequestError,
  ConflictError
} from '../../util/errors.util.js';
import type { AddPatientToForumResponse } from '../../types/forums/add.patient.to.forum.types';

/**
 * Servicio para añadir un paciente a un foro privado
 */
export async function addPatientToForumService(
  forumId: number,
  userId: string,
  forumRole: string
): Promise<AddPatientToForumResponse> {
  
  // 1. Verificar que el foro existe
  const forum = await findForumById(forumId);
  if (!forum) {
    throw new NotFoundError('Forum not found');
  }

  // 2. Verificar que el foro es privado
  if (forum.public_status) {
    throw new BadRequestError('Only private forums can have users added manually');
  }

  // 3. Verificar que el foro está activo
  if (!forum.active) {
    throw new BadRequestError('Forum is not active');
  }

  // 4. Verificar que el usuario es un paciente
  const patient = await findPatientByUserId(userId);
  if (!patient) {
    throw new BadRequestError('User is not a patient');
  }

  // 5. Verificar que el usuario no está ya en el foro
  const existingMembership = await findUserInForum(userId, forumId);
  if (existingMembership) {
    throw new ConflictError('User is already a member of this forum');
  }

  // 6. Añadir el usuario al foro
  const userForum = await addUserToForum(userId, forumId, forumRole);

  // 7. Retornar respuesta
  return {
    userId: userForum.user_id,
    forumId: userForum.forum_id,
    forumRole: userForum.forum_role
  };
}
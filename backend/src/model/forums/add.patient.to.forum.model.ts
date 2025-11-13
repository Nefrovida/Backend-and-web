import { prisma } from '../../util/prisma.js';
import type { ForumData, PatientData, UserForumData } from '../../types/forums/add.patient.to.forum.types';

/**
 * Verifica si un foro existe
 */
export async function findForumById(forumId: number): Promise<ForumData | null> {
  return await prisma.forums.findUnique({
    where: {
      forum_id: forumId
    }
  });
}

/**
 * Verifica si un usuario es paciente
 */
export async function findPatientByUserId(userId: string): Promise<PatientData | null> {
  return await prisma.patients.findFirst({
    where: {
      user_id: userId
    }
  });
}

/**
 * Verifica si un usuario ya está en el foro
 */
export async function findUserInForum(userId: string, forumId: number): Promise<UserForumData | null> {
  return await prisma.users_forums.findUnique({
    where: {
      user_id_forum_id: {
        user_id: userId,
        forum_id: forumId
      }
    }
  });
}

/**
 * Añade un usuario a un foro
 */
export async function addUserToForum(
  userId: string,
  forumId: number,
  forumRole: string
): Promise<UserForumData> {
  return await prisma.users_forums.create({
    data: {
      user_id: userId,
      forum_id: forumId,
      forum_role: forumRole
    }
  });
}
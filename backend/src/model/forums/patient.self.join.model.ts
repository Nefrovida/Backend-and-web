import { prisma } from '../../util/prisma.js';
import type { 
  Patient, 
  UserForumData,
  ForumData,
  ForumRole 
} from '../../types/forums/patient.self.join.types.js';

/**
 * Verify if forum exists
 */
export async function findForumById(forumId: number): Promise<ForumData | null> {
  return await prisma.forums.findUnique({
    where: {
      forum_id: forumId
    }
  });
}

/**
 * Verify if patient exists
 */
export async function findPatientByUserId(userId: string): Promise<Patient | null> {
  return await prisma.patients.findFirst({
    where: {
      user_id: userId
    }
  });
}

/**
 * Verify if user is already in forum
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
 * Add user to forum
 */
export async function addUserToForum(
  userId: string,
  forumId: number,
  forumRole: ForumRole
): Promise<UserForumData> {
  return await prisma.users_forums.create({
    data: {
      user_id: userId,
      forum_id: forumId,
      forum_role: forumRole
    }
  });
}
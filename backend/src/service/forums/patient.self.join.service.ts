import {
  findForumById,
  findPatientByUserId,
  findUserInForum,
  addUserToForum
} from '../../model/forums/patient.self.join.model';
import {
  NotFoundError,
  BadRequestError,
  ConflictError
} from '../../util/errors.util.js';
import type {
  PatientSelfJoinResponse
} from '../../types/forums/patient.self.join.types';
import { ForumRole } from '@prisma/client';

/**
 * Service for patient to self-join a public forum
 */
export async function patientSelfJoinService(
  forumId: number,
  userId: string
): Promise<PatientSelfJoinResponse> {

  // 1. Verify that forum exists
  const forum = await findForumById(forumId);
  if (!forum) {
    throw new NotFoundError('Forum not found');
  }

  // 2. Verify that forum is public
  if (!forum.public_status) {
    throw new BadRequestError('Only public forums can be joined directly');
  }

  // 3. Verify that forum is active
  if (!forum.active) {
    throw new BadRequestError('Forum is not active');
  }

  // 4. Verify that user is a patient
  const patient = await findPatientByUserId(userId);
  if (!patient) {
    throw new BadRequestError('User is not a patient');
  }

  // 5. Verify that user is not already in forum
  const existingMembership = await findUserInForum(userId, forumId);
  if (existingMembership) {
    throw new ConflictError('User is already a member of this forum');
  }

  // 6. Add user to forum with MEMBER role
  const userForum = await addUserToForum(userId, forumId, ForumRole.MEMBER);

  // 7. Return success response
  return {
    success: true,
    message: 'Successfully joined the forum',
    data: {
      userId: userForum.user_id,
      forumId: userForum.forum_id,
      forumRole: userForum.forum_role
    }
  };
}
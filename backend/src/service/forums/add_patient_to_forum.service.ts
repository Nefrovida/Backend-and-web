import {
  findForumById,
  findPatientByUserId,
  findUserInForum,
  addUserToForum
} from '../../model/forums/add_patient_to_forum.model';
import {
  NotFoundError,
  BadRequestError,
  ConflictError
} from '../../util/errors.util.js';
import type {
  AddPatientToForumResponse,
  ForumRole
} from '../../types/forums/add_patient_to_forum.types';
import { FORUM_ROLES } from '../../types/forums/add_patient_to_forum.types';

/**
 * Service to add patient to forum
 */
export async function addPatientToForumService(
  forumId: number,
  userId: string,
  forumRole: ForumRole
): Promise<AddPatientToForumResponse> {

  // 1. Verify that forum exists
  const forum = await findForumById(forumId);
  if (!forum) {
    throw new NotFoundError('Forum not found');
  }

  // 2. Verify that forum is private
  if (forum.public_status) {
    throw new BadRequestError('Only private forums can have users added manually');
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

  // 6. Add user to forum
  const userForum = await addUserToForum(userId, forumId, forumRole);

  // 7. Return success response
  return {
    success: true,
    message: 'Patient added to forum successfully',
    data: {
      userId: userForum.user_id,
      forumId: userForum.forum_id,
      forumRole: userForum.forum_role
    }
  };
}

/**
 * Service: join a public forum as a patient (self-join)
 */
export async function joinForumService(
  forumId: number,
  userId: string
): Promise<AddPatientToForumResponse> {
  // 1. Verify that forum exists
  const forum = await findForumById(forumId);
  if (!forum) {
    throw new NotFoundError('Forum not found');
  }

  // 2. Only public forums can be joined by users
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
    // Return success if already a member (idempotent)
    return {
      success: true,
      message: 'User is already a member of this forum',
      data: {
        userId: existingMembership.user_id,
        forumId: existingMembership.forum_id,
        forumRole: existingMembership.forum_role,
      }
    };
  }

  // 6. Add user to forum with default MEMBER role
  const userForum = await addUserToForum(userId, forumId, FORUM_ROLES.MEMBER as unknown as ForumRole);

  return {
    success: true,
    message: 'Successfully joined the forum',
    data: {
      userId: userForum.user_id,
      forumId: userForum.forum_id,
      forumRole: userForum.forum_role,
    }
  };
}

/**
 * Service: subscribe any authenticated user to a public forum
 * Allows non-patient users to subscribe to public forums.
 */
export async function subscribeToForumService(
  forumId: number,
  userId: string
): Promise<AddPatientToForumResponse> {
  // 1. Verify that forum exists
  const forum = await findForumById(forumId);
  if (!forum) {
    throw new NotFoundError('Forum not found');
  }

  // 2. Only public forums can be subscribed directly
  if (!forum.public_status) {
    throw new BadRequestError('Only public forums can be joined directly');
  }

  // 3. Verify that forum is active
  if (!forum.active) {
    throw new BadRequestError('Forum is not active');
  }

  // 4. Verify that user is not already in forum
  const existingMembership = await findUserInForum(userId, forumId);
  if (existingMembership) {
    // Return success if already a member (idempotent)
    return {
      success: true,
      message: 'User is already a member of this forum',
      data: {
        userId: existingMembership.user_id,
        forumId: existingMembership.forum_id,
        forumRole: existingMembership.forum_role,
      }
    };
  }

  // 5. Add user to forum with default MEMBER role
  const userForum = await addUserToForum(userId, forumId, FORUM_ROLES.MEMBER as unknown as ForumRole);

  return {
    success: true,
    message: 'Successfully subscribed to the forum',
    data: {
      userId: userForum.user_id,
      forumId: userForum.forum_id,
      forumRole: userForum.forum_role,
    }
  };
}
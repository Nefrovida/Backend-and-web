// backend/src/service/forums.service.ts
import { CreateForumInputValidated, UpdateForumInputValidated } from '../validators/forum.validator';
import { ForumEntity } from '../types/forum.types';
import { existsAndActive, isUserMember } from '../model/forum.model'
import * as forumModel from '../model/forum.model';
import { ConflictError, NotFoundError, BadRequestError } from '../util/errors.util';

/**
 * Create a new forum
 * 
 * Business logic:
 * 1. Check if a forum with the same name already exists (case-insensitive)
 * 2. Create the forum in the database
 * 3. Assign the creator (userId) to the created_by field
 * 
 * @param data - Validated forum data from the controller
 * @param userId - User ID from the JWT token (authenticated user)
 * @returns The created forum entity
 * @throws ConflictError if a forum with the same name already exists
 */
export const createForum = async (
  data: CreateForumInputValidated,
  userId: string
): Promise<ForumEntity> => {
  const { name, description, public_status } = data;

  // Check for duplicate forum name (case-insensitive)
  const existingForum = await forumModel.findByName(name);

  if (existingForum) {
    throw new ConflictError('A forum with this name already exists');
  }

  // Create the forum using the model layer
  const newForum = await forumModel.create({
    name,
    description,
    public_status,
    created_by: userId,
    // active defaults to true in Prisma
    // creation_date defaults to now() in Prisma
  });

  return newForum;
};

/**
 * Get all forums
 * 
 * Business logic:
 * 1. Retrieve all active forums from the database
 * 2. Apply pagination (default: page 1, limit 20)
 * 3. Apply filters if provided (search, public status)
 * 
 * @param page - Page number (1-indexed)
 * @param limit - Number of items per page
 * @param filters - Optional filters (search term, public status)
 * @returns Array of forum entities
 */
export const getAllForums = async (
  page: number = 1,
  limit: number = 20,
  filters?: {
    search?: string;
    isPublic?: boolean;
  },
  userId?: string
): Promise<ForumEntity[]> => {
  const skip = (page - 1) * limit;

  const forums = await forumModel.findAll(skip, limit, {
    search: filters?.search,
    isPublic: filters?.isPublic,
    active: true,
  }, userId);

  return forums;
};

/**
 * Get forum by id
 */
export const getForumById = async (forumId: number): Promise<ForumEntity | null> => {
  return await forumModel.findByIdWithCreator(forumId);
};

export const getForumsForUser = async (userId: string) => {
  return await forumModel.getUserForums(userId);
};

export const isUserMemberOfForum = async (forumId: number, userId: string) => {
  return await forumModel.isUserMember(forumId, userId);
};

/**
 * Update a forum
 * 
 
 */
export const updateForum = async (
  forumId: number,
  data: UpdateForumInputValidated
): Promise<ForumEntity> => {
  // Check if forum exists
  const existingForum = await forumModel.findById(forumId);
  if (!existingForum) {
    throw new NotFoundError('Foro no encontrado');
  }

  // Check for duplicate name if name is being updated
  if (data.name && data.name !== existingForum.name) {
    const duplicateForum = await forumModel.findByName(data.name);
    if (duplicateForum) {
      throw new ConflictError('Ya existe un foro con este nombre');
    }
  }

  // Update the forum
  const updatedForum = await forumModel.update(forumId, data);
  return updatedForum;
};


/**
 * Service: Reply to a message in a forum
 */
export const replyToMessageService = async (
  forumId: number,
  userId: string,
  parentMessageId: number,
  content: string
) => {
  // 1. Validate that the forum exists and is active
  const forumExists = await existsAndActive(forumId);
  if (!forumExists) {
    throw new NotFoundError('El foro no existe o está inactivo');
  }

  // 2. Validate that the user is a member of the forum
  const isMember = await isUserMember(forumId, userId);
  if (!isMember) {
    throw new BadRequestError('El usuario no es miembro del foro');
  }

  // 3. Validate that the parent message exists, is active, and belongs to the forum
  const parentMessage = await forumModel.findMessageInForum(parentMessageId, forumId);
  if (!parentMessage) {
    throw new NotFoundError('El mensaje padre no existe, está inactivo o no pertenece a este foro');
  }

  // 4. Create the reply
  const reply = await forumModel.createReplyToMessage(forumId, userId, parentMessageId, content);

  // 5. Transform the response to match the expected format
  return {
    success: true,
    message: 'Respuesta creada exitosamente',
    data: {
      messageId: reply.message_id,
      forumId: reply.forum_id,
      userId: reply.user_id,
      content: reply.content,
      parentMessageId: reply.parent_message_id,
      publicationTimestamp: reply.publication_timestamp,
      active: reply.active,
      author: {
        userId: reply.user.user_id,
        name: reply.user.name,
        parentLastName: reply.user.parent_last_name,
        maternalLastName: reply.user.maternal_last_name,
        username: reply.user.username
      },
      stats: {
        repliesCount: reply._count.messages,
        likesCount: reply._count.likes
      }
    }
  };
};
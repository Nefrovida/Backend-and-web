import { prisma } from "../util/prisma";
import { ForumRole } from ".prisma/client";
import { Message } from "../types/forum.types";

export default class Forum {
  Forum() {}

  static async postNewMessage(
    userId: string,
    forumId: number,
    content: string
  ) {
    return await prisma.messages.create({
      data: {
        forum_id: forumId,
        user_id: userId,
        content: content,
      },
    });
  }

  private static async getPublicForums() {
    return await prisma.forums.findMany({
      where: {
        public_status: true,
        active: true,
      },
      select: {
        forum_id: true,
        name: true,
      },
      take: 5,
    });
  }

  static async getMyForums(userId: string) {
    const myForums = await prisma.users_forums.findMany({
      where: {
        user_id: userId,
      },
      select: {
        forum: {
          select: {
            forum_id: true,
            name: true,
          },
        },
      },
      take: 5,
    });

    const publicForums = await this.getPublicForums();

    return [...myForums, ...publicForums];
  }

  static async getMyForumsWeb(userId: string) {
    const myForums = await prisma.users_forums
      .findMany({
        where: {
          user_id: userId,
        },
        select: {
          forum: {
            select: {
              forum_id: true,
              name: true,
            },
          },
        },
        take: 5,
      })
      .then((data) => {
        return data.map((f) => ({
          forum_id: f.forum.forum_id,
          name: f.forum.name,
        }));
      });

    const publicForums = await this.getPublicForums();

    return [...myForums, ...publicForums];
  }

  static async getForumFeed(
    page: number,
    userId: string,
    forumId?: number
  ): Promise<Message[]> {
    const pagination = 6;
    return await prisma.messages.findMany({
      take: pagination,
      skip: pagination * page,
      where: {
        forum: {
          OR: [
            { public_status: true },
            {
              users_forums: {
                some: {
                  user_id: userId,
                },
              },
            },
          ],
          ...(forumId ? { AND: { forum_id: forumId } } : {}),
        },
        parent_message_id: null,
        active: true,
      },
      select: {
        message_id: true,
        content: true,
        publication_timestamp: true,
        _count: {
          select: {
            likes: true,
            messages: true,
          },
        },
        forum: {
          select: {
            forum_id: true,
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            parent_last_name: true,
            maternal_last_name: true,
            username: true,
          },
        },
      },
      orderBy: {
        publication_timestamp: "desc",
      },
    });
  }

  static async getMessage(messageId: number) {
    return await prisma.messages.findUnique({
      where: {
        message_id: messageId,
      },
      select: {
        message_id: true,
        forum_id: true,
        user_id: true,
        content: true,
        user: {
          select: {
            username: true,
            user_id: true,
          },
        },
      },
    });
  }
}

/**
 * Find forum by name (case-insensitive)
 */
export const findByName = async (name: string) => {
  return await prisma.forums.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });
};

/**
 * Find forum by ID
 */
export const findById = async (forumId: number) => {
  return await prisma.forums.findUnique({
    where: { forum_id: forumId },
  });
};

/**
 * Find forum by ID with creator details
 */
export const findByIdWithCreator = async (forumId: number) => {
  return await prisma.forums.findUnique({
    where: { forum_id: forumId },
    include: {
      user: {
        select: {
          user_id: true,
          name: true,
          parent_last_name: true,
          maternal_last_name: true,
          username: true,
        },
      },
    },
  });
};

/**
 * Create new forum
 */
export const create = async (data: {
  name: string;
  description: string;
  public_status: boolean;
  created_by: string;
}) => {
  return await prisma.forums.create({
    data,
  });
};

/**
 * Find all forums with pagination, search, and filters
 */
export const findAll = async (
  skip: number,
  take: number,
  filters?: {
    search?: string;
    isPublic?: boolean;
    active?: boolean;
    createdBy?: string;
  },
  userId?: string
) => {
  const whereClause: any = {};

  // Search by name
  if (filters?.search) {
    whereClause.name = {
      contains: filters.search,
      mode: "insensitive" as const,
    };
  }

  // Filter by active status
  if (filters?.active !== undefined) {
    whereClause.active = filters.active;
  }

  // Filter by creator
  if (filters?.createdBy) {
    whereClause.created_by = filters.createdBy;
  }

  // Complex visibility logic
  if (filters?.isPublic !== undefined) {
    // Explicit public filter requested
    whereClause.public_status = filters.isPublic;

    // If requesting private forums (isPublic=false) and userId is provided,
    // ensure user only sees private forums they are a member of
    if (filters.isPublic === false && userId) {
      whereClause.users_forums = {
        some: {
          user_id: userId,
        },
      };
    }
  } else if (userId) {
    // No explicit public filter, but user is logged in
    // Show: Public forums OR Private forums where user is a member
    whereClause.OR = [
      { public_status: true },
      {
        AND: [
          { public_status: false },
          {
            users_forums: {
              some: {
                user_id: userId,
              },
            },
          },
        ],
      },
    ];
  }

  return await prisma.forums.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          user_id: true,
          name: true,
          parent_last_name: true,
          maternal_last_name: true,
          username: true,
        },
      },
      // Include users_forums to check membership status if needed
      users_forums: userId
        ? {
            where: {
              user_id: userId,
            },
            select: {
              forum_role: true,
            },
          }
        : false,
    },
    orderBy: {
      creation_date: "desc",
    },
    skip,
    take,
  });
};

/**
 * Count total forums (for pagination)
 */
export const count = async (filters?: {
  search?: string;
  isPublic?: boolean;
  active?: boolean;
  createdBy?: string;
}) => {
  const whereClause: any = {};

  if (filters?.search) {
    whereClause.name = {
      contains: filters.search,
      mode: "insensitive" as const,
    };
  }

  if (filters?.isPublic !== undefined) {
    whereClause.public_status = filters.isPublic;
  }

  if (filters?.active !== undefined) {
    whereClause.active = filters.active;
  }

  if (filters?.createdBy) {
    whereClause.created_by = filters.createdBy;
  }

  return await prisma.forums.count({
    where: whereClause,
  });
};

/**
 * Update forum by ID
 */
export const update = async (
  forumId: number,
  data: {
    name?: string;
    description?: string;
    public_status?: boolean;
    active?: boolean;
  }
) => {
  return await prisma.forums.update({
    where: { forum_id: forumId },
    data,
  });
};

/**
 * Delete forum by ID (soft delete by setting active to false)
 */
export const softDelete = async (forumId: number) => {
  return await prisma.forums.update({
    where: { forum_id: forumId },
    data: { active: false },
  });
};

/**
 * Delete forum by ID (hard delete)
 */
export const deleteById = async (forumId: number) => {
  return await prisma.forums.delete({
    where: { forum_id: forumId },
  });
};

/**
 * Find duplicate forum by name (excluding current ID)
 */
export const findDuplicateName = async (name: string, excludeId: number) => {
  return await prisma.forums.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
      NOT: {
        forum_id: excludeId,
      },
    },
  });
};

/**
 * Find all public and active forums
 */
export const findPublicForums = async (skip: number, take: number) => {
  return await prisma.forums.findMany({
    where: {
      public_status: true,
      active: true,
    },
    include: {
      user: {
        select: {
          user_id: true,
          name: true,
          username: true,
        },
      },
    },
    orderBy: {
      creation_date: "desc",
    },
    skip,
    take,
  });
};

/**
 * Check if forum exists and is active
 */
export const existsAndActive = async (forumId: number) => {
  const forum = await prisma.forums.findUnique({
    where: { forum_id: forumId },
    select: { active: true },
  });
  return forum?.active ?? false;
};

// ========== FORUM MEMBERS MANAGEMENT ==========

/**
 * Add user to forum with role
 */
export const addUserToForum = async (
  forumId: number,
  userId: string,
  role: ForumRole
) => {
  return await prisma.users_forums.create({
    data: {
      forum_id: forumId,
      user_id: userId,
      forum_role: role,
    },
  });
};

/**
 * Remove user from forum
 */
export const removeUserFromForum = async (forumId: number, userId: string) => {
  return await prisma.users_forums.delete({
    where: {
      user_id_forum_id: {
        user_id: userId,
        forum_id: forumId,
      },
    },
  });
};

/**
 * Update user role in forum
 */
export const updateUserRole = async (
  forumId: number,
  userId: string,
  role: ForumRole
) => {
  return await prisma.users_forums.update({
    where: {
      user_id_forum_id: {
        user_id: userId,
        forum_id: forumId,
      },
    },
    data: {
      forum_role: role,
    },
  });
};

/**
 * Get user role in forum
 */
export const getUserRole = async (forumId: number, userId: string) => {
  const member = await prisma.users_forums.findUnique({
    where: {
      user_id_forum_id: {
        user_id: userId,
        forum_id: forumId,
      },
    },
    select: {
      forum_role: true,
    },
  });
  return member?.forum_role ?? null;
};

/**
 * Check if user is member of forum
 */
export const isUserMember = async (forumId: number, userId: string) => {
  const member = await prisma.users_forums.findFirst({
    where: {
      OR: [
        {
          user_id: userId,
          forum_id: forumId,
        },
        {
          forum: {
            public_status: true,
          },
        },
      ],
    },
  });
  return member !== null;
};

/**
 * Get all forum members with pagination
 */
export const getForumMembers = async (
  forumId: number,
  skip: number,
  take: number
) => {
  return await prisma.users_forums.findMany({
    where: {
      forum_id: forumId,
    },
    include: {
      user: {
        select: {
          user_id: true,
          name: true,
          parent_last_name: true,
          maternal_last_name: true,
          username: true,
        },
      },
    },
    orderBy: {
      forum_role: "asc", // OWNER first, then MODERATOR, MEMBER, VIEWER
    },
    skip,
    take,
  });
};

/**
 * Count forum members
 */
export const countForumMembers = async (forumId: number) => {
  return await prisma.users_forums.count({
    where: {
      forum_id: forumId,
    },
  });
};

/**
 * Get all forums where user is member
 */
export const getUserForums = async (userId: string) => {
  return await prisma.users_forums.findMany({
    where: {
      user_id: userId,
    },
    include: {
      forum: {
        include: {
          user: {
            select: {
              user_id: true,
              name: true,
              username: true,
            },
          },
        },
      },
    },
    orderBy: {
      forum: {
        creation_date: "desc",
      },
    },
  });
};

/**
 * Get all admin users (role_id = 1)
 */
export const getAdminUsers = async () => {
  return await prisma.users.findMany({
    where: {
      role_id: 1,
      active: true, // Solo usuarios activos
    },
    select: {
      user_id: true,
      name: true,
      parent_last_name: true,
      maternal_last_name: true,
      username: true,
      phone_number: true,
      registration_date: true,
      role: {
        select: {
          role_name: true,
        },
      },
    },
    orderBy: {
      registration_date: "desc",
    },
  });
};

/**
 * Get admin users with pagination
 */
export const getAdminUsersWithPagination = async (
  skip: number,
  take: number
) => {
  return await prisma.users.findMany({
    where: {
      role_id: 1,
      active: true,
    },
    select: {
      user_id: true,
      name: true,
      parent_last_name: true,
      maternal_last_name: true,
      username: true,
      phone_number: true,
      registration_date: true,
      role: {
        select: {
          role_name: true,
        },
      },
    },
    orderBy: {
      registration_date: "desc",
    },
    skip,
    take,
  });
};

/**
 * Count total admin users
 */
export const countAdminUsers = async () => {
  return await prisma.users.count({
    where: {
      role_id: 1,
      active: true,
    },
  });
};

/**
 * Check if user is admin
 */
export const isUserAdmin = async (userId: string) => {
  const user = await prisma.users.findUnique({
    where: {
      user_id: userId,
    },
    select: {
      role_id: true,
      active: true,
    },
  });

  return user?.role_id === 1 && user?.active === true;
};

/**
 * Get forum administrators (OWNER and MODERATOR)
 */
export const getForumAdministrators = async (forumId: number) => {
  const result = await prisma.users_forums.findMany({
    where: {
      forum_id: forumId,
      forum_role: {
        in: ["OWNER", "MODERATOR"],
      },
    },
    include: {
      user: {
        select: {
          user_id: true,
          name: true,
          parent_last_name: true,
          maternal_last_name: true,
          username: true,
          phone_number: true,
          registration_date: true,
        },
      },
    },
    orderBy: [
      {
        forum_role: "asc", // OWNER primero, luego MODERATOR
      },
      {
        user: {
          registration_date: "desc",
        },
      },
    ],
  });

  // Aplanar la estructura para que sea más fácil de usar en el frontend
  return result.map((item) => ({
    user_id: item.user.user_id,
    name: item.user.name,
    parent_last_name: item.user.parent_last_name,
    maternal_last_name: item.user.maternal_last_name,
    username: item.user.username,
    phone_number: item.user.phone_number,
    registration_date: item.user.registration_date,
    forum_role: item.forum_role,
  }));
};

/**
 * Get all non-admin users (role_id != 1) with pagination
 */
export const getNonAdminUsersWithPagination = async (
  skip: number,
  take: number
) => {
  return await prisma.users.findMany({
    where: {
      role_id: {
        not: 1, // Excluir administradores
      },
      active: true,
    },
    select: {
      user_id: true,
      name: true,
      parent_last_name: true,
      maternal_last_name: true,
      username: true,
      phone_number: true,
      registration_date: true,
      role: {
        select: {
          role_name: true,
        },
      },
    },
    orderBy: {
      registration_date: "desc",
    },
    skip,
    take,
  });
};

/**
 * Count total non-admin users
 */
export const countNonAdminUsers = async () => {
  return await prisma.users.count({
    where: {
      role_id: {
        not: 1, // Excluir administradores
      },
      active: true,
    },
  });
};

/**
 * Get forum members (all roles except OWNER and MODERATOR)
 */
export const getForumRegularMembers = async (forumId: number) => {
  const result = await prisma.users_forums.findMany({
    where: {
      forum_id: forumId,
      forum_role: {
        in: ["MEMBER", "VIEWER"],
      },
    },
    include: {
      user: {
        select: {
          user_id: true,
          name: true,
          parent_last_name: true,
          maternal_last_name: true,
          username: true,
          phone_number: true,
          registration_date: true,
          role: {
            select: {
              role_name: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        forum_role: "asc", // MEMBER primero, luego VIEWER
      },
      {
        user: {
          registration_date: "desc",
        },
      },
    ],
  });

  // Aplanar la estructura para que sea más fácil de usar en el frontend
  return result.map((item) => ({
    user_id: item.user.user_id,
    name: item.user.name,
    parent_last_name: item.user.parent_last_name,
    maternal_last_name: item.user.maternal_last_name,
    username: item.user.username,
    phone_number: item.user.phone_number,
    registration_date: item.user.registration_date,
    forum_role: item.forum_role,
    role: item.user.role, // Incluir información del rol del usuario
  }));
};

/**
 * Find message by ID (ignoring forum context)
 */
export const findMessageById = async (messageId: number) => {
  return await prisma.messages.findUnique({
    where: {
      message_id: messageId,
    },
  });
};

/**
 * Check if a message exists and belongs to a specific forum
 */
export const findMessageInForum = async (
  messageId: number,
  forumId: number
) => {
  return await prisma.messages.findFirst({
    where: {
      message_id: messageId,
      forum_id: forumId,
      active: true,
    },
  });
};

/**
 * Create a reply to a message
 */
export const createReplyToMessage = async (
  forumId: number,
  userId: string,
  parentMessageId: number,
  content: string
) => {
  return await prisma.messages.create({
    data: {
      forum_id: forumId,
      user_id: userId,
      parent_message_id: parentMessageId,
      content: content.trim(),
      active: true,
    },
    include: {
      user: {
        select: {
          user_id: true,
          name: true,
          parent_last_name: true,
          maternal_last_name: true,
          username: true,
        },
      },
      _count: {
        select: {
          messages: true,
          likes: true,
        },
      },
    },
  });
};

/**
 * Find messages by forum ID with pagination
 */
export const findMessagesByForumId = async (
  forumId: number,
  skip: number,
  take: number
) => {
  return await prisma.messages.findMany({
    where: {
      forum_id: forumId,
      active: true,
      parent_message_id: null, // Only root messages (threads)
    },
    include: {
      user: {
        select: {
          user_id: true,
          name: true,
          parent_last_name: true,
          maternal_last_name: true,
          username: true,
        },
      },
      _count: {
        select: {
          messages: true, // Count of replies
          likes: true,
        },
      },
    },
    orderBy: {
      publication_timestamp: "desc",
    },
    skip,
    take,
  });
};

/**
 * Count root messages in a forum
 */
export const countForumMessages = async (forumId: number) => {
  return await prisma.messages.count({
    where: {
      forum_id: forumId,
      active: true,
      parent_message_id: null,
    },
  });
};

/**
 * Find replies to a message with pagination
 */
export const findRepliesByMessageId = async (
  parentMessageId: number,
  skip: number,
  take: number
) => {
  return await prisma.messages.findMany({
    where: {
      parent_message_id: parentMessageId,
      active: true,
    },
    include: {
      user: {
        select: {
          user_id: true,
          name: true,
          parent_last_name: true,
          maternal_last_name: true,
          username: true,
        },
      },
      _count: {
        select: {
          messages: true, // Count of nested replies (if any, though usually 1 level deep)
          likes: true,
        },
      },
    },
    orderBy: {
      publication_timestamp: "asc", // Replies usually shown oldest to newest
    },
    skip,
    take,
  });
};

/**
 * Count replies to a message
 */
export const countReplies = async (parentMessageId: number) => {
  return await prisma.messages.count({
    where: {
      parent_message_id: parentMessageId,
      active: true,
    },
  });
};

/**
 * Soft delete a message by ID (sets active to false)
 */
export const softDeleteMessage = async (messageId: number) => {
  return await prisma.messages.update({
    where: { message_id: messageId },
    data: { active: false },
  });
};

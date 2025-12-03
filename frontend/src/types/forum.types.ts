/**
 * Forum Types
 *
 * Interfaces for the Forums module
 */

export interface Forum {
  forum_id: number;
  name: string;
  description: string;
  public_status: boolean;
  created_by: string;
  active: boolean;
  creation_date: string;
}

export interface CreateForumData {
  name: string;
  description: string;
  public_status: boolean;
}

export type BasicForumInfo = {
  forumId: number;
  name: string;
};

export type Message = {
  messageId: number;
  content: string;
  likes: number;
  liked: number;
  replies: number;
  forums: { forumId: number; name: string };
};

export type SimpleMessage = {
  messageId: number;
  content: string;
  forumId: number;
  user: {
    userId: string;
    userName: string;
  };
};

export type Reply = {
  author: {
    userId: string;
    name: string;
    lastName: string;
  };
  content: string;
  liked: number;
  forumId: number;
  id: number;
  parentMessageId: number;
  stats: {
    likesCount: number;
    repliesCount: number;
  };
};

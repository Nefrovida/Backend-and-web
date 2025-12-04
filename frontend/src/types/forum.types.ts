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
  userName?: string;
};

export type Reply = {
  author: {
    userId: string;
    name: string;
    parentLastName: string | null;
    maternalLastName: string | null;
    username: string;
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
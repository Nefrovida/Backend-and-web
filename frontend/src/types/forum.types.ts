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
  forumId: string;
  name: string;
};

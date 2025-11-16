export interface AddPatientToForumRequest {
  userId: string;
  forumRole: ForumRole;
}

export interface AddPatientToForumResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    forumId: number;
    forumRole: ForumRole;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
  };
}

export interface Forum {
  forum_id: number;
  name: string;
  description: string;
  public_status: boolean;
  active: boolean;
  created_by: string;
  creation_date: string;
}

export interface Patient {
  patient_id: string;
  user_id: string;
  curp: string;
  name?: string;
  parent_last_name?: string;
  maternal_last_name?: string;
}

export enum ForumRole {
  OWNER = "OWNER",
  MODERATOR = "MODERATOR",
  MEMBER = "MEMBER",
  VIEWER = "VIEWER",
}

export const FORUM_ROLES = {
  OWNER: ForumRole.OWNER,
  MODERATOR: ForumRole.MODERATOR,
  MEMBER: ForumRole.MEMBER,
  VIEWER: ForumRole.VIEWER,
} as const;

export type ForumRoleType = typeof FORUM_ROLES[keyof typeof FORUM_ROLES];

export const FORUM_ROLE_LABELS: Record<ForumRole, string> = {
  [ForumRole.OWNER]: "Propietario",
  [ForumRole.MODERATOR]: "Moderador",
  [ForumRole.MEMBER]: "Miembro",
  [ForumRole.VIEWER]: "Observador",
};
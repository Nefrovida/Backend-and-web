export interface AddPatientToForumRequest {
  userId: string;
  forumRole: string;
}

export interface AddPatientToForumResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    forumId: number;
    forumRole: string;
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
  name: string;
  parent_last_name: string;
  maternal_last_name?: string;
}

export const FORUM_ROLES = {
  MEMBER: "miembro",
  PARTICIPANT: "participante",
  MODERATOR: "moderador",
} as const;

export type ForumRole = typeof FORUM_ROLES[keyof typeof FORUM_ROLES];
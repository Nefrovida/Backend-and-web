import { ForumRole } from '@prisma/client';

export interface PatientSelfJoinResponse {
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

export interface ForumData {
  forum_id: number;
  name: string;
  description: string;
  public_status: boolean;
  active: boolean;
  created_by: string;
  creation_date: Date;
}

export interface Patient {
  patient_id: string;
  user_id: string;
  curp: string;
}

export interface UserForumData {
  user_id: string;
  forum_id: number;
  forum_role: ForumRole;
}

export { ForumRole };
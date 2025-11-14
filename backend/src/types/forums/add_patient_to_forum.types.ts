export interface AddPatientToForumRequest {
  userId: string;
  forumRole: string;
}

export interface AddPatientToForumParams {
  forumId: string;
}

export interface AddPatientToForumResponse {
  userId: string;
  forumId: number;
  forumRole: string;
}

export interface ForumData {
  forum_id: number;
  name: string;
  description: string;
  public_status: boolean;
  created_by: string;
  active: boolean;
}

export interface PatientData {
  patient_id: string;
  user_id: string;
  curp: string;
}

export interface UserForumData {
  user_id: string;
  forum_id: number;
  forum_role: string;
}
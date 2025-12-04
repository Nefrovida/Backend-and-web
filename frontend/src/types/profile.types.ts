export interface UserProfileDTO {
  user_id: string;
  name: string;
  parent_last_name: string;
  maternal_last_name: string;
  username: string;
  phone_number: string;
  role_name: string;
  gender?: string | null;
  birthday?: string | null;
}

export interface UpdateProfileDTO {
  name?: string;
  parent_last_name?: string;
  maternal_last_name?: string;
  phone_number?: string;
  gender?: string;
  birthday?: string; // YYYY-MM-DD
}

export interface ChangePasswordDTO {
  newPassword: string;
  confirmNewPassword: string;
}

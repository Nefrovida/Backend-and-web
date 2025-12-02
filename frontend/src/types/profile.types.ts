export interface UserProfileDTO {
  user_id: string;
  name: string;
  parent_last_name: string;
  maternal_last_name: string;
  username: string;
  phone_number: string;
  role_name: string;
}

export interface UpdateProfileDTO {
  name?: string;
  parent_last_name?: string;
  maternal_last_name?: string;
  phone_number?: string;
}

export interface ChangePasswordDTO {
  newPassword: string;
  confirmNewPassword: string;
}

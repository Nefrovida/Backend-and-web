export interface UserProfileDTO {
    user_id: string;
    name: string;
    parent_last_name: string;
    maternal_last_name: string | null;
    username: string;
    phone_number: string;
    role_name: string;
    gender?: string | null;
    birthday?: string | null;
}

export interface UpdateProfileDTO {
    name?: string;
    parent_last_name?: string;
    maternal_last_name?: string | null;
    phone_number?: string;
    gender?: string;
    birthday?: string; // ISO date string YYYY-MM-DD
}

export interface ChangePasswordDTO {
    newPassword: string;
    confirmNewPassword: string;
}
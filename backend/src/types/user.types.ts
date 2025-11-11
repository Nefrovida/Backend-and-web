import { Gender } from '../../prisma/database/prisma/enums';

/**
 * User with role and privileges
 */
export interface UserWithRoleAndPrivileges {
  user_id: string;
  name: string;
  parent_last_name: string;
  maternal_last_name: string | null;
  phone_number: string;
  username: string;
  password: string;
  birthday: Date;
  gender: Gender;
  active: boolean;
  registration_date: Date;
  first_login: boolean;
  role_id: number;
  role: {
    role_id: number;
    role_name: string;
    role_privileges: {
      privilege: {
        privilege_id: number;
        description: string;
      };
    }[];
  };
}

/**
 * Update user request DTO
 */
export interface UpdateUserRequest {
  name?: string;
  parent_last_name?: string;
  maternal_last_name?: string;
  phone_number?: string;
  active?: boolean;
  role_id?: number;
}

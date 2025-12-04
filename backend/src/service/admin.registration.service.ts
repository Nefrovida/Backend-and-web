import { createUser, IUser } from "../model/doctor.model";

type RegisterAdminInput = {
  name: string;
  parent_last_name: string;
  maternal_last_name?: string;
  username: string;
  password: string;
  phone_number?: string;
  birthday?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
};

export const AdminRegistrationService = {
  registerAdmin: async (
    adminAccount: { role_id: number },
    data: RegisterAdminInput
  ) => {
    // Only allow admins
    if (!adminAccount || adminAccount.role_id !== 1) {
      const err = new Error("Only admins can register admins");
      (err as any).statusCode = 403;
      throw err;
    }

    const birthdayDate = data.birthday ? new Date(data.birthday) : new Date();

    const user: IUser = await createUser({
      name: data.name,
      parent_last_name: data.parent_last_name,
      maternal_last_name: data.maternal_last_name ?? "",
      phone_number: data.phone_number ?? "",
      username: data.username,
      password: data.password,
      birthday: birthdayDate,
      gender: data.gender ?? "OTHER",
      role_id: 1, // Admin role id
    });

    const { password, ...safeUser } = user;
    return { account: safeUser };
  },
};

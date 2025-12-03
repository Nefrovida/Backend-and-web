import { createUser, createDoctor, IUser, IDoctor } from "../model/doctor.model";

type RegisterDoctorInput = {
  name: string;
  parent_last_name: string;
  maternal_last_name?: string;
  username: string;
  password: string;
  phone_number?: string;
  birthday?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  specialty: string;
  license: string;
};

export const DoctorRegistrationService = {
  registerDoctor: async (
    adminAccount: { role_id: number },
    data: RegisterDoctorInput
  ) => {
    // Only allow admins
    if (!adminAccount || adminAccount.role_id !== 1) {
      const err = new Error("Only admins can register doctors");
      (err as any).statusCode = 403;
      throw err;
    }

    // Parse birthday or default to now
    const birthdayDate = data.birthday ? new Date(data.birthday) : new Date();

    // 1. Create user with doctor role
    const user: IUser = await createUser({
      name: data.name,
      parent_last_name: data.parent_last_name,
      maternal_last_name: data.maternal_last_name ?? "",
      phone_number: data.phone_number ?? "",
      username: data.username,
      password: data.password, // will be hashed in model
      birthday: birthdayDate,
      gender: data.gender ?? "OTHER",
      role_id: 2, // doctor role id
    });

    // 2. Create doctor linked to the user
    const doctor: IDoctor = await createDoctor({
      user_id: user.user_id!,
      specialty: data.specialty,
      license: data.license,
    });

    // 3. Return both user and doctor (without password)
    const { password, ...safeUser } = user;
    return { account: safeUser, doctor };
  },
};
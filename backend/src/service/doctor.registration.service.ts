import { prisma } from "../util/prisma";
import bcrypt from "bcrypt";

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

export const registerDoctor = async (
  adminAccount: { role_id: number },
  data: RegisterDoctorInput
) => {
  if (!adminAccount || adminAccount.role_id !== 1) {
    const err = new Error("Solo administradores pueden crear doctores");
    (err as any).statusCode = 403;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const birthdayDate = data.birthday ? new Date(data.birthday) : new Date();

  const newAccount = await prisma.users.create({
    data: {
      name: data.name,
      parent_last_name: data.parent_last_name,
      maternal_last_name: data.maternal_last_name ?? "",
      username: data.username,
      password: hashedPassword,
      phone_number: data.phone_number ?? "", 
      birthday: birthdayDate,
      gender: data.gender ?? "OTHER",
      first_login: true,
      role_id: 2, // Doctor
    },
  });


  const doctor = await prisma.doctors.create({
    data: {
      user_id: newAccount.user_id,
      specialty: data.specialty,
      license: data.license,
    },
  });

  const { password, ...safeAccount } = newAccount;
  return { account: safeAccount, doctor };
};
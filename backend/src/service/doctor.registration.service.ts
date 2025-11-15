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
  speciality: string;
  license: string;
};

export const registerDoctor = async (adminAccount: { role_id: number }, data: RegisterDoctorInput) => {
  if (!adminAccount || adminAccount.role_id !== 1) {
    const err = new Error("Solo administradores pueden crear doctores");
    (err as any).statusCode = 403;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const birthdayDate = data.birthday ? new Date(data.birthday) : null;

  const [newAccount, newDoctor] = await prisma.$transaction([
    prisma.users.create({
      data: {
        name: data.name,
        parent_last_name: data.parent_last_name,
        maternal_last_name: data.maternal_last_name ?? null,
        username: data.username,
        password: hashedPassword,
        phone_number: data.phone_number ?? null,
        birthday: birthdayDate,
        gender: data.gender ?? null,
        role_id: 2, // Doctor
      },
    }),
    prisma.doctors.create({
      data: {
        // el user_id se obtiene del primer create
        user_id: undefined as any, // se reemplaza abajo
        speciality: data.speciality,
        license: data.license,
      },
    }),
  ]);

  // Ajustar el doctor con el user_id recién creado
  const doctor = await prisma.doctors.update({
    where: { doctor_id: newDoctor.doctor_id },
    data: { user_id: newAccount.user_id },
  });

  const { password, ...safeAccount } = newAccount;
  return { account: safeAccount, doctor };
};
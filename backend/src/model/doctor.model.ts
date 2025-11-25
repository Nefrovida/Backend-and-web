import { prisma } from "../util/prisma";
import { hashPassword } from "../util/password.util";
import type { Gender } from "@prisma/client";

// Interface for User entity
export interface IUser {
  user_id?: string;
  name: string;
  parent_last_name: string;
  maternal_last_name: string;
  phone_number: string;
  username: string;
  password: string; // will be hashed before saving
  birthday: Date;
  gender: Gender;
  role_id: number; // doctor role id
}

// Check if username already exists
export const checkUsernameExists = async (username: string): Promise<boolean> => {
  try {
    const existingUser = await prisma.users.findFirst({
      where: { username },
    });
    return !!existingUser;
  } catch (error) {
    return true;
  }
};

// Check if license already exists
export const checkLicenseExists = async (license: string): Promise<boolean> => {
  try {
    const existingDoctor = await prisma.doctors.findFirst({
      where: { license },
    });
    return !!existingDoctor;
  } catch (error) {
    return true;
  }
};

// Interface for Doctor entity
export interface IDoctor {
  doctor_id?: string;
  user_id: string;
  specialty: string;
  license: string;
}

// Create a new user with doctor role
export const createUser = async (user: IUser): Promise<IUser> => {
  // Hash the password before saving to database
  const hashedPassword = await hashPassword(user.password);

  const newUser = await prisma.users.create({
    data: {
      name: user.name,
      parent_last_name: user.parent_last_name,
      maternal_last_name: user.maternal_last_name,
      phone_number: user.phone_number,
      username: user.username,
      password: hashedPassword, // store hashed password
      birthday: user.birthday,
      gender: user.gender,
      role_id: user.role_id,
      first_login: true,
    },
  });

  return newUser;
};

// Create a doctor linked to the user
export const createDoctor = async (doctor: IDoctor): Promise<IDoctor> => {
  const newDoctor = await prisma.doctors.create({
    data: {
      user_id: doctor.user_id,
      specialty: doctor.specialty,
      license: doctor.license,
    },
  });
  return newDoctor;
};
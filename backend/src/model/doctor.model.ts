import { prisma } from "../util/prisma";

export interface IDoctor {
  doctor_id?: string;
  user_id: string;
  speciality: string;
  license: string;
}

export const createDoctor = async (doctor: IDoctor): Promise<IDoctor> => {
  const newDoctor = await prisma.doctors.create({
    data: {
      user_id: doctor.user_id,
      speciality: doctor.speciality,
      license: doctor.license,
    },
  });
  return newDoctor;
};
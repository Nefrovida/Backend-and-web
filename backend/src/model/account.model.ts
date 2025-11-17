import { prisma } from "../util/prisma";

export interface IAccount {
  user_id?: string;
  name: string;
  parent_last_name: string;
  maternal_last_name?: string | null;
  active?: boolean;
  phone_number?: string | null;
  username: string;
  password: string;
  birthday?: Date | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  role_id: number;
}

export const createAccount = async (account: IAccount): Promise<IAccount> => {
  const newAccount = await prisma.users.create({
    data: {
      name: account.name,
      parent_last_name: account.parent_last_name,
      maternal_last_name: account.maternal_last_name ?? null,
      active: account.active ?? true,
      phone_number: account.phone_number ?? null,
      username: account.username,
      password: account.password,
      birthday: account.birthday ?? null,
      gender: account.gender ?? null,
      role_id: account.role_id,
    },
  });
  return newAccount;
};
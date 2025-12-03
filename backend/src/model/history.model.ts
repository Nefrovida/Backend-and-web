import { prisma } from '../util/prisma';

export const findAll = async (skip: number, take: number, search?: string) => {
  const where = search
    ? {
        description: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }
    : {};

  return prisma.questions_history.findMany({ where, skip, take, orderBy: { question_id: 'asc' } });
};

export const count = async (search?: string) => {
  const where = search
    ? {
        description: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }
    : {};

  return prisma.questions_history.count({ where });
};

export const findById = async (questionId: number) => {
  return prisma.questions_history.findUnique({ where: { question_id: questionId } });
};

export const findByDescription = async (description: string) => {
  return prisma.questions_history.findFirst({ where: { description } });
};

export const findDuplicateDescription = async (description: string, excludeId: number) => {
  return prisma.questions_history.findFirst({ where: { description, NOT: { question_id: excludeId } } });
};

export const create = async (data: { description: string; type: string }) => {
  return prisma.questions_history.create({ data });
};

export const update = async (questionId: number, data: { description?: string; type?: string }) => {
  return prisma.questions_history.update({ where: { question_id: questionId }, data });
};

export const deleteById = async (questionId: number) => {
  return prisma.questions_history.delete({ where: { question_id: questionId } });
};

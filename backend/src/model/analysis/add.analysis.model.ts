import { prisma } from '../../util/prisma';

/**
 * Find analysis by name (case-insensitive)
 */
export const findByName = async (name: string) => {
  return await prisma.analysis.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive',
      },
    },
  });
};

/**
 * Find analysis by ID
 */
export const findById = async (analysisId: number) => {
  return await prisma.analysis.findUnique({
    where: { analysis_id: analysisId },
  });
};

/**
 * Create new analysis
 */
export const create = async (data: {
  name: string;
  description: string;
  previous_requirements: string;
  general_cost: number;
  community_cost: number;
}) => {
  return await prisma.analysis.create({
    data,
  });
};

/**
 * Find all analyses with pagination and search
 */
export const findAll = async (
  skip: number,
  take: number,
  search?: string
) => {
  const whereClause = search
    ? {
        name: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }
    : {};

  return await prisma.analysis.findMany({
    where: whereClause,
    orderBy: {
      name: 'asc',
    },
    skip,
    take,
  });
};

/**
 * Count total analyses (for pagination)
 */
export const count = async (search?: string) => {
  const whereClause = search
    ? {
        name: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }
    : {};

  return await prisma.analysis.count({
    where: whereClause,
  });
};

/**
 * Update analysis by ID
 */
export const update = async (
  analysisId: number,
  data: {
    name?: string;
    description?: string;
    previous_requirements?: string;
    general_cost?: number;
    community_cost?: number;
  }
) => {
  return await prisma.analysis.update({
    where: { analysis_id: analysisId },
    data,
  });
};

/**
 * Delete analysis by ID
 */
export const deleteById = async (analysisId: number) => {
  return await prisma.analysis.delete({
    where: { analysis_id: analysisId },
  });
};

/**
 * Count patient_analysis entries referencing this analysis
 */
export const countPatientAnalysisReferences = async (analysisId: number) => {
  return await prisma.patient_analysis.count({
    where: { analysis_id: analysisId },
  });
};

/**
 * Find duplicate analysis by name (excluding current ID)
 */
export const findDuplicateName = async (name: string, excludeId: number) => {
  return await prisma.analysis.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive',
      },
      NOT: {
        analysis_id: excludeId,
      },
    },
  });
};
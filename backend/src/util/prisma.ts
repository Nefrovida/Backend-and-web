/*This file creates a single PrismaClient instance
to avoid duplicate connections
and ensure efficient database access across the application.
Singleton pattern*/

import { PrismaClient } from "@prisma/client";

// Extend globalThis to store the PrismaClient instance in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create or reuse the PrismaClient instance (singleton pattern)
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In development, store the instance globally to prevent hot-reload issues
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
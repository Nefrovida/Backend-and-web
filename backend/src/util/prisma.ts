/*This file creates a single PrismaClient instance
to avoid duplicate connections
and ensure efficient database access across the application.
Singleton pattern*/

import { PrismaClient } from "@prisma/client";

// Extend globalThis to store the PrismaClient instance in development
const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

// Import and apply encryption middleware
import { prismaEncryptionExtension } from "../middleware/prismaEncryption.middleware";

// Define encryption configuration
// Example: { users: ['phone_number', 'password'] } 
// Note: Passwords should be hashed, not just encrypted. This is just an example.
const encryptionConfig = {
  // Add models and fields here, e.g.:
  users: ['username', 'phone_number'],
};

// Create or reuse the PrismaClient instance (singleton pattern)
export const prisma = globalForPrisma.prisma ?? new PrismaClient().$extends(prismaEncryptionExtension(encryptionConfig));

// In development, store the instance globally to prevent hot-reload issues
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
/**
 * Prisma Client Singleton
 * 
 * Crea una única instancia de PrismaClient para reutilizar
 * la conexión a la base de datos en toda la aplicación
 */

import { PrismaClient } from '../../prisma/database/prisma/client';

// Declaración global para persistir cliente en hot-reload (desarrollo)
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Singleton: reutilizar instancia en desarrollo, crear nueva en producción
export const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// En desarrollo, guardar instancia en global para hot-reload
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Manejar cierre graceful de la conexión
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

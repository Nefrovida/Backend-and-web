// prisma/run-seed-sql.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeedSQL() {
  // Resolve path relative to this file's location
  const sqlFilePath = path.resolve(__dirname, 'seed.sql');
  const sql = fs.readFileSync(sqlFilePath, 'utf-8');

  console.log('Running seed.sql...');

  // Split SQL into statements (handles ; and multi-line)
  // Filter out empty statements and comments
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    if (statement.trim()) {
      try {
        await prisma.$executeRawUnsafe(statement + ';');
      } catch (error) {
        console.error('Error executing statement:', statement.substring(0, 50) + '...');
        throw error;
      }
    }
  }

  console.log('seed.sql executed successfully!');
}

runSeedSQL()
  .catch(e => {
    console.error('Error running seed.sql:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
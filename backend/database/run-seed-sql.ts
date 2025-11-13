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
  let sql = fs.readFileSync(sqlFilePath, 'utf-8');

  console.log('Running seed.sql...');

  // Remove comment lines (lines starting with --)
  sql = sql.split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n');

  // Split by semicolon and clean up statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`Found ${statements.length} SQL statements to execute`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (statement.trim()) {
      try {
        // Execute the statement with semicolon
        await prisma.$executeRawUnsafe(statement + ';');
        console.log(`✅ Executed statement ${i + 1}/${statements.length}`);
      } catch (error) {
        console.error(`❌ Error executing statement ${i + 1}:`);
        console.error('Statement:', statement.substring(0, 100) + '...');
        console.error('Full error:', error);
        throw error;
      }
    }
  }

  console.log('✅ seed.sql executed successfully!');
}

runSeedSQL()
  .catch(e => {
    console.error('Error running seed.sql:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
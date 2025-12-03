// prisma/run-seed-sql.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { encryptDeterministic } from '../src/util/encryption.util';

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
    let statement = statements[i];
    if (statement.trim()) {
      try {
        // Generic function to process INSERT statements
        const processInsertStatement = (tableName: string, fieldsToEncrypt: string[]) => {
          // Regex to match: INSERT INTO tableName ... VALUES ...
          // Use [\s\S] to match newlines in the VALUES part
          // Also handle potential schema prefix "public."
          const regex = new RegExp(`INSERT INTO\\s+(?:"?public"?\\.?)?"?${tableName}"?\\s*\\(([^)]+)\\)\\s*VALUES\\s*([\\s\\S]+)`, 'i');
          const match = statement.match(regex);

          if (match) {
            const columnsStr = match[1];
            let valuesPart = match[2];

            const columns = columnsStr.split(',').map(c => c.trim().replace(/"/g, ''));
            const indices = fieldsToEncrypt.map(field => ({ field, index: columns.indexOf(field) })).filter(x => x.index !== -1);

            if (indices.length > 0) {
              valuesPart = valuesPart.trim();

              const processRow = (rowStr: string): string => {
                const values = rowStr.split(/,(?=(?:[^']*'[^']*')*[^']*$)/).map(v => v.trim());

                indices.forEach(({ index }) => {
                  if (values[index]) {
                    let val = values[index];
                    const isQuoted = val.startsWith("'") && val.endsWith("'");
                    if (isQuoted) val = val.slice(1, -1);

                    // Encrypt
                    const encrypted = encryptDeterministic(val);
                    values[index] = `'${encrypted}'`;
                  }
                });
                return values.join(', ');
              };

              const modifiedValuesPart = valuesPart.replace(/\(([\s\S]*?)\)/g, (fullMatch, rowContent) => {
                if (rowContent.includes(',')) {
                  const newRowContent = processRow(rowContent);
                  return `(${newRowContent})`;
                }
                return fullMatch;
              });

              statement = `INSERT INTO ${tableName} (${columnsStr}) VALUES ${modifiedValuesPart}`;
              console.log(`Encrypted ${tableName} for insert block ${i + 1}`);
            }
          }
        };

        // Apply encryption for each table
        processInsertStatement('notes', ['content', 'general_notes', 'ailments', 'prescription']);
        processInsertStatement('results', ['interpretation', 'path', 'recommendation']);
        processInsertStatement('options', ['description']);
        processInsertStatement('patient_history', ['answer']);
        processInsertStatement('questions_history', ['description']);

        // Execute the statement with semicolon
        await prisma.$executeRawUnsafe(statement + ';');
        console.log(`Executed statement ${i + 1}/${statements.length}`);
      } catch (error) {
        console.error(`Error executing statement ${i + 1}:`);
        console.error('Statement:', statement.substring(0, 100) + '...');
        console.error('Full error:', error);
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
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const prisma = new PrismaClient();

async function verifyDatabase() {
  try {
    console.log('🔍 Verifying database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')); // Hide password
    
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');

    // List all tables
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;

    console.log(`📊 Found ${tables.length} tables in database:`);
    tables.forEach(table => {
      console.log(`  - ${table.tablename}`);
    });

    // Count records in key tables
    const patientAnalysisCount = await prisma.patient_analysis.count();
    const analysisCount = await prisma.analysis.count();
    const usersCount = await prisma.users.count();

    console.log('\n📈 Record counts:');
    console.log(`  - patient_analysis: ${patientAnalysisCount}`);
    console.log(`  - analysis: ${analysisCount}`);
    console.log(`  - users: ${usersCount}`);

  } catch (error) {
    console.error('❌ Database verification failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();


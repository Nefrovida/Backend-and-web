import { prisma } from '../util/prisma';
import { encrypt, decrypt } from '../util/encryption.util';

// Mock process.env.ENCRYPTION_KEY if not set (though it should be passed in CLI)
if (!process.env.ENCRYPTION_KEY) {
    console.warn('WARNING: ENCRYPTION_KEY not set. Using default for demo.');
    process.env.ENCRYPTION_KEY = '12345678901234567890123456789012';
}

async function runDemo() {
    console.log('--- Real-Life Encryption Demo ---');

    // 1. Create a User with a sensitive phone number
    const sensitivePhone = '555-1234-5678';
    console.log(`\n1. Creating user with phone number: ${sensitivePhone}`);

    // Use a random username to avoid unique constraint errors
    const randomSuffix = Math.floor(Math.random() * 10000);
    const newUser = await prisma.users.create({
        data: {
            name: 'Demo User',
            parent_last_name: 'Encryption',
            username: `demo_user_${randomSuffix}`,
            password: 'password123', // In real app, this should be hashed!
            phone_number: sensitivePhone, // This should be encrypted automatically
            birthday: new Date('1990-01-01'),
            gender: 'MALE',
            first_login: true,
            active: true
        }
    });

    console.log(`User created with ID: ${newUser.user_id}`);

    // 2. Verify Encryption in Database (Raw Query)
    console.log('\n2. Verifying raw data in database...');
    // We use $queryRaw to bypass the middleware's decryption (middleware only intercepts model methods usually, 
    // but let's be sure. Actually middleware intercepts 'findUnique' etc. $queryRaw might be intercepted if configured? 
    // No, middleware usually intercepts params-based calls. $queryRaw is different.
    // However, to be 100% sure we see the raw data, we can just check if the returned value looks encrypted.

    // Note: $queryRaw returns an array of objects.
    const rawResult: any[] = await prisma.$queryRaw`SELECT phone_number FROM users WHERE user_id = ${newUser.user_id}::uuid`;

    if (rawResult.length > 0) {
        const rawPhone = rawResult[0].phone_number;
        console.log(`Raw Phone in DB: ${rawPhone}`);

        if (rawPhone !== sensitivePhone && rawPhone.includes(':')) {
            console.log('✅ SUCCESS: Data is stored ENCRYPTED in the database.');
        } else {
            console.error('❌ FAILURE: Data is NOT encrypted in the database.');
        }
    }

    // 3. Verify Decryption via Prisma
    console.log('\n3. Verifying decryption via Prisma Client...');
    const fetchedUser = await prisma.users.findUnique({
        where: { user_id: newUser.user_id }
    });

    if (fetchedUser) {
        console.log(`Fetched Phone via Prisma: ${fetchedUser.phone_number}`);
        if (fetchedUser.phone_number === sensitivePhone) {
            console.log('✅ SUCCESS: Data is DECRYPTED automatically when reading.');
        } else {
            console.error('❌ FAILURE: Data was NOT decrypted correctly.');
        }
    }

    // Cleanup (Optional)
    console.log('\nCleaning up demo user...');
    await prisma.users.delete({ where: { user_id: newUser.user_id } });
    console.log('Demo user deleted.');

    // 4. Verify Seeded User (Carlos Ramírez)
    console.log('\n4. Verifying Seeded User (Carlos Ramírez - 7711234567)...');
    // Now we can search by phone number because encryption is deterministic!
    const seededUser = await prisma.users.findFirst({
        where: { phone_number: '7711234567' }
    });

    if (seededUser) {
        console.log(`Seeded User Found via Phone Search! ID: ${seededUser.user_id}`);
        console.log(`Seeded User Phone via Prisma: ${seededUser.phone_number}`);

        if (seededUser.phone_number === '7711234567') {
            console.log('✅ SUCCESS: Deterministic encryption allows searching!');
        } else {
            console.log('❌ FAILURE: Decryption failed or data mismatch.');
        }

        // Check raw data
        const rawSeeded: any[] = await prisma.$queryRaw`SELECT phone_number FROM users WHERE user_id = ${seededUser.user_id}::uuid`;
        if (rawSeeded.length > 0) {
            const rawPhone = rawSeeded[0].phone_number;
            console.log(`Raw Seeded Phone in DB: ${rawPhone}`);
        }

    } else {
        console.log('❌ FAILURE: Could not find user by phone number (Search failed).');
    }

    // 5. Verify Seeded User (Carlos Ramírez) - Username Search
    console.log('\n5. Verifying Seeded User (Carlos Ramírez) - Username Search...');
    const seededUserByUsername = await prisma.users.findFirst({
        where: { username: 'testAdmin1' }
    });

    if (seededUserByUsername) {
        console.log(`Seeded User Found via Username Search! ID: ${seededUserByUsername.user_id}`);
        console.log(`Seeded User Username via Prisma: ${seededUserByUsername.username}`);

        if (seededUserByUsername.username === 'testAdmin1') {
            console.log('✅ SUCCESS: Deterministic encryption allows searching by USERNAME!');
        } else {
            console.log('❌ FAILURE: Username decryption failed or data mismatch.');
        }
    } else {
        console.log('❌ FAILURE: Could not find user by username (Search failed).');
    }
}

runDemo()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

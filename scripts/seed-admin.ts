import { db } from '../server/db';
import { admins } from '../server/db/schema';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();

async function seed() {
  const username = process.argv[2] || 'vicolraj';
  const password = process.argv[3] || 'DeEmeralds2026!'; // Strong default

  console.log(`Seeding admin user: ${username}...`);

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await db.insert(admins).values({
      username,
      passwordHash,
      role: 'admin'
    }).onConflictDoUpdate({
      target: admins.username,
      set: { passwordHash }
    });
    
    console.log('✅ Admin user created/updated successfully!');
    console.log(`Credentials: \nUsername: ${username}\nPassword: ${password}`);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  }
}

seed();

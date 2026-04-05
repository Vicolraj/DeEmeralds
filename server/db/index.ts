import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('WARNING: DATABASE_URL is not set');
}

// Standard robustness for Vercel: ensure neon() is called with a string even if env var is temporarily missing
const sql = neon(process.env.DATABASE_URL || '');
export const db = drizzle(sql, { schema });

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('CRITICAL: DATABASE_URL is missing! Queries will fail.');
}

// Standard robustness for Vercel: ensure neon() is called with a string even if env var is temporarily missing
const sql_conn = neon(dbUrl || '');
export const db = drizzle(sql_conn, { schema });

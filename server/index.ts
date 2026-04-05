import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import memberRoutes from './routes/members';
import videoRoutes from './routes/videos';
import rehearsalRoutes from './routes/rehearsals';
import statsRoutes from './routes/stats';
import socialRoutes from './routes/socials';
import { db } from './db';
import { sql } from 'drizzle-orm';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ── Health Check (Static) ───────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── DB Diagnostic Endpoint ──────────────────
app.get('/api/db-health', async (req, res) => {
  try {
    // Attempt a simple query with a timeout race
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database Query Timeout (5s)')), 5000)
    );
    
    await Promise.race([
      db.execute(sql`SELECT 1`),
      timeout
    ]);

    res.json({ status: 'connected', database: 'online' });
  } catch (err: any) {
    console.error('DB Health Check Failed:', err.message);
    res.status(503).json({ 
      status: 'error', 
      message: 'Database is unreachable or slow', 
      error: err.message 
    });
  }
});

// ── API Routes ──────────────────────────────
app.use('/api/admin', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/rehearsals', rehearsalRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/socials', socialRoutes);

// ── Global Error Handler ─────────────────────
app.use((err: any, req: any, res: any, next: any) => {
  console.error('GLOBAL_ERROR:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message,
    code: err.code || 'UNKNOWN_ERROR'
  });
});

// Vercel serverless export — must be at module level
export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

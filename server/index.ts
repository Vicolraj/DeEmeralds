import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import memberRoutes from './routes/members';
import videoRoutes from './routes/videos';
import rehearsalRoutes from './routes/rehearsals';
import statsRoutes from './routes/stats';
import socialRoutes from './routes/socials';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ── Health Check ────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ──────────────────────────────
app.use('/api/admin', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/rehearsals', rehearsalRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/socials', socialRoutes);


export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

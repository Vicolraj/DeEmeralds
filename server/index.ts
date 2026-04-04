import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import memberRoutes from './routes/members';
import videoRoutes from './routes/videos';
import rehearsalRoutes from './routes/rehearsals';

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

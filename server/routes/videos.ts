import { Router } from 'express';
import { db } from '../db';
import { youtubeVideos } from '../db/schema';
import { eq, asc } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// ── GET: List All Videos (Public) ───────────
router.get('/', async (req, res) => {
  try {
    const allVideos = await db.query.youtubeVideos.findMany({
      orderBy: [asc(youtubeVideos.displayOrder), asc(youtubeVideos.id)],
    });
    res.json(allVideos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// ── POST: Create Video (Protected) ──────────
router.post('/', authenticateToken, async (req, res) => {
  try {
    const [newVideo] = await db.insert(youtubeVideos).values(req.body).returning();
    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create video' });
  }
});

// ── DELETE: Delete Video (Protected) ────────
router.delete('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string);
  try {
    await db.delete(youtubeVideos).where(eq(youtubeVideos.id, id));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

export default router;

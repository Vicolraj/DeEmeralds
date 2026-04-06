import { Router } from 'express';
import { db } from '../db/index.js';
import { siteStats } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// ── GET: Fetch Stats (Public) ────────────────
router.get('/', async (req, res) => {
  try {
    const stats = await db.query.siteStats.findFirst();
    res.json(stats || { songsCount: 25, eventsCount: 100 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ── PUT: Update Stats (Protected) ────────────
router.put('/', authenticateToken, async (req, res) => {
  try {
    const existing = await db.query.siteStats.findFirst();
    if (existing) {
      const [updated] = await db.update(siteStats).set({ ...req.body, updatedAt: new Date() }).where(eq(siteStats.id, existing.id)).returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(siteStats).values(req.body).returning();
      res.json(created);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update stats' });
  }
});

export default router;

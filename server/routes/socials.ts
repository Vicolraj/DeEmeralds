import { Router } from 'express';
import { db } from '../db/index.js';
import { socialLinks } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// ── GET: Fetch Social Links (Public) ─────────
router.get('/', async (req, res) => {
  try {
    const links = await db.query.socialLinks.findMany({
      orderBy: [asc(socialLinks.displayOrder)],
    });
    // Frontend only shows links that have a URL
    res.json(links.filter(l => l.url && l.url.trim().length > 0));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch social links' });
  }
});

// ── GET: All Links including empty (Protected) ──
router.get('/all', authenticateToken, async (req, res) => {
    try {
      const links = await db.query.socialLinks.findMany({
        orderBy: [asc(socialLinks.displayOrder)],
      });
      res.json(links);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch all social links' });
    }
});

// ── PUT: Update Social Link (Protected) ───────
router.put('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string);
  try {
    const [updated] = await db.update(socialLinks).set(req.body).where(eq(socialLinks.id, id)).returning();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update social link' });
  }
});

// ── POST: Create Social Link (Protected) ──────
router.post('/', authenticateToken, async (req, res) => {
    try {
      const [newLink] = await db.insert(socialLinks).values(req.body).returning();
      res.status(201).json(newLink);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create social link' });
    }
});

// ── DELETE: Delete Social Link (Protected) ────
router.delete('/:id', authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id as string);
    try {
      await db.delete(socialLinks).where(eq(socialLinks.id, id));
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete social link' });
    }
});

export default router;

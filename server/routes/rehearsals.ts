import { Router } from 'express';
import { db } from '../db/index.js';
import { rehearsals } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// ── GET: List All Rehearsals (Public) ────────
router.get('/', async (req, res) => {
  try {
    const allRehearsals = await db.query.rehearsals.findMany({
      orderBy: [asc(rehearsals.displayOrder), asc(rehearsals.id)],
    });
    res.json(allRehearsals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rehearsals' });
  }
});

// ── POST: Create Rehearsal (Protected) ───────
router.post('/', authenticateToken, async (req, res) => {
  try {
    const [newRehearsal] = await db.insert(rehearsals).values(req.body).returning();
    res.status(201).json(newRehearsal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create rehearsal' });
  }
});

// ── PUT: Update Rehearsal (Protected) ────────
router.put('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string);
  try {
    const [updated] = await db.update(rehearsals).set(req.body).where(eq(rehearsals.id, id)).returning();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update rehearsal' });
  }
});

// ── DELETE: Delete Rehearsal (Protected) ─────
router.delete('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string);
  try {
    await db.delete(rehearsals).where(eq(rehearsals.id, id));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete rehearsal' });
  }
});

export default router;

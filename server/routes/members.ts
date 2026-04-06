import { Router } from 'express';
import { db } from '../db/index.js';
import { members } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// ── GET: List All Members (Public) ───────────
router.get('/', async (req, res) => {
  try {
    const allMembers = await db.query.members.findMany({
      orderBy: [asc(members.displayOrder), asc(members.id)],
    });
    res.json(allMembers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// ── POST: Create Member (Protected) ──────────
router.post('/', authenticateToken, async (req, res) => {
  try {
    const [newMember] = await db.insert(members).values(req.body).returning();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create member' });
  }
});

// ── PUT: Update Member (Protected) ───────────
router.put('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string);
  try {
    const [updated] = await db.update(members).set({ ...req.body, updatedAt: new Date() }).where(eq(members.id, id)).returning();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update member' });
  }
});

// ── DELETE: Delete Member (Protected) ────────
router.delete('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string);
  try {
    await db.delete(members).where(eq(members.id, id));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

export default router;

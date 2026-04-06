import { Router } from 'express';
import { db } from '../db/index.js';
import { members } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth.js';
import { deleteFromCloudinary } from '../lib/cloudinary.js';

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
  const { firstName, middleName, lastName, role, photoUrl, photoPublicId, displayOrder } = req.body;
  try {
    const [newMember] = await db.insert(members).values({
      firstName,
      middleName,
      lastName,
      role,
      photoUrl,
      photoPublicId,
      displayOrder: displayOrder || 0
    }).returning();
    res.status(201).json(newMember);
  } catch (err) {
    console.error('Create member error:', err);
    res.status(500).json({ error: 'Failed to create member' });
  }
});

// ── PUT: Update Member (Protected) ───────────
router.put('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string);
  const { firstName, middleName, lastName, role, photoUrl, photoPublicId, displayOrder } = req.body;
  try {
    // 1. Get existing member to check for old photo
    const [existing] = await db.select().from(members).where(eq(members.id, id)).limit(1);
    
    // 2. If photo is being replaced, delete the old one from Cloudinary
    if (existing && existing.photoPublicId && existing.photoPublicId !== photoPublicId) {
      await deleteFromCloudinary(existing.photoPublicId);
    }

    // 3. Update in DB
    const [updated] = await db.update(members)
      .set({ 
        firstName, 
        middleName, 
        lastName, 
        role, 
        photoUrl, 
        photoPublicId, 
        displayOrder,
        updatedAt: new Date() 
      })
      .where(eq(members.id, id))
      .returning();
    res.json(updated);
  } catch (err) {
    console.error('Update member error:', err);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

// ── DELETE: Delete Member (Protected) ────────
router.delete('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string);
  try {
    // 1. Get member to check for photo
    const [member] = await db.select().from(members).where(eq(members.id, id)).limit(1);
    
    if (member && member.photoPublicId) {
      // 2. Kill image in Cloudinary
      await deleteFromCloudinary(member.photoPublicId);
    }

    // 3. Delete from DB
    await db.delete(members).where(eq(members.id, id));
    res.status(204).send();
  } catch (err) {
    console.error('Delete member error:', err);
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

export default router;

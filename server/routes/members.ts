import { Router } from 'express';
import { db } from '../db/index.js';
import { members, memberAccounts } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth.js';
import { deleteFromCloudinary } from '../lib/cloudinary.js';

const router = Router();

// ── GET: List Registered Members (Public) ─────
// Only shows members who have created an account
router.get('/', async (req, res) => {
  try {
    const registeredMembers = await db.select({
      id: members.id,
      firstName: members.firstName,
      middleName: members.middleName,
      lastName: members.lastName,
      role: members.role,
      photoUrl: members.photoUrl,
    })
    .from(members)
    .innerJoin(memberAccounts, eq(members.id, memberAccounts.memberId))
    .orderBy(asc(members.lastName), asc(members.firstName));

    res.json(registeredMembers);
  } catch (err) {
    console.error('Fetch members error:', err);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// ── GET: All Members for Admin (Protected) ─────
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const allMembers = await db.query.members.findMany({
      orderBy: [asc(members.displayOrder), asc(members.id)],
    });
    res.json(allMembers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all members' });
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

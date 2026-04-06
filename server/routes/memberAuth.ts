import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { memberAccounts, members } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback';

// ── Member Self-Registration ─────────────────
router.post('/register', async (req, res) => {
  const { firstName, lastName, username, password, role } = req.body;

  if (!username || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'firstName, lastName, username, and password are required' });
  }

  try {
    // Check if username taken
    const [existing] = await db.select().from(memberAccounts).where(eq(memberAccounts.username, username)).limit(1);
    if (existing) {
      return res.status(409).json({ error: 'That username is already taken. Please choose another.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create a member display record (will show on public site)
    const [newMember] = await db.insert(members).values({
      firstName,
      middleName: req.body.middleName || null,
      lastName,
      role: role || 'Member',
      photoUrl: null,
      displayOrder: 999,
    }).returning();

    // Create the account linked to that member
    await db.insert(memberAccounts).values({
      memberId: newMember.id,
      username,
      passwordHash,
      mustChangePassword: false,
    });

    res.status(201).json({ message: 'Account created successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ── Member Login ─────────────────────────────
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [account] = await db.select().from(memberAccounts)
      .where(eq(memberAccounts.username, username)).limit(1);

    if (!account) return res.status(401).json({ error: 'Account not found' });
    if (!account.isActive) return res.status(403).json({ error: 'Account is deactivated. Contact admin.' });

    const isMatch = await bcrypt.compare(password, account.passwordHash);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect password' });

    // Update last login
    await db.update(memberAccounts)
      .set({ lastLogin: new Date(), updatedAt: new Date() })
      .where(eq(memberAccounts.id, account.id));

    const token = jwt.sign(
      { id: account.id, memberId: account.memberId, username: account.username, role: 'member' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      mustChangePassword: account.mustChangePassword,
      memberId: account.memberId,
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ── Member: Get their own profile ────────────
router.get('/me', authenticateToken, async (req: any, res) => {
  try {
    const [account] = await db.select().from(memberAccounts)
      .where(eq(memberAccounts.id, req.user.id)).limit(1);

    if (!account || !account.memberId) return res.status(404).json({ error: 'Profile not found' });

    const [member] = await db.select().from(members)
      .where(eq(members.id, account.memberId)).limit(1);

    res.json({ account: { id: account.id, username: account.username, mustChangePassword: account.mustChangePassword }, member });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// ── Member: Update own profile ───────────────
router.put('/me', authenticateToken, async (req: any, res) => {
  try {
    const [account] = await db.select().from(memberAccounts)
      .where(eq(memberAccounts.id, req.user.id)).limit(1);

    if (!account || !account.memberId) return res.status(404).json({ error: 'Profile not found' });

    const { firstName, middleName, lastName, role, photoUrl, photoPublicId } = req.body;

    const [updated] = await db.update(members)
      .set({ 
        firstName, 
        middleName: middleName || null, 
        lastName, 
        role, 
        photoUrl: photoUrl || null, 
        photoPublicId: photoPublicId || null, 
        updatedAt: new Date() 
      })
      .where(eq(members.id, account.memberId))
      .returning();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ── Member: Change own password ───────────────
router.put('/me/password', authenticateToken, async (req: any, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const [account] = await db.select().from(memberAccounts)
      .where(eq(memberAccounts.id, req.user.id)).limit(1);

    if (!account) return res.status(404).json({ error: 'Account not found' });

    const isMatch = await bcrypt.compare(currentPassword, account.passwordHash);
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.update(memberAccounts)
      .set({ passwordHash, mustChangePassword: false, updatedAt: new Date() })
      .where(eq(memberAccounts.id, account.id));

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// ── ADMIN: List all member accounts ──────────
router.get('/accounts', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  try {
    const accounts = await db.select({
      id: memberAccounts.id,
      memberId: memberAccounts.memberId,
      username: memberAccounts.username,
      isActive: memberAccounts.isActive,
      mustChangePassword: memberAccounts.mustChangePassword,
      lastLogin: memberAccounts.lastLogin,
      createdAt: memberAccounts.createdAt,
    }).from(memberAccounts);

    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch member accounts' });
  }
});

// ── ADMIN: Reset a member's password ─────────
router.put('/accounts/:id/password', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  const id = parseInt(req.params.id);
  const { newPassword } = req.body;

  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.update(memberAccounts)
      .set({ passwordHash, mustChangePassword: true, updatedAt: new Date() })
      .where(eq(memberAccounts.id, id));

    res.json({ message: 'Password reset. Member will be prompted to change on next login.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// ── ADMIN: Deactivate/reactivate member account ──
router.put('/accounts/:id/status', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  const id = parseInt(req.params.id);
  const { isActive } = req.body;

  try {
    await db.update(memberAccounts).set({ isActive }).where(eq(memberAccounts.id, id));
    res.json({ message: `Account ${isActive ? 'activated' : 'deactivated'}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update account status' });
  }
});

// ── ADMIN: Delete member account (not the member record) ──
router.delete('/accounts/:id', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  const id = parseInt(req.params.id);
  try {
    await db.delete(memberAccounts).where(eq(memberAccounts.id, id));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;

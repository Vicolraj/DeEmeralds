import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { admins } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_me';

// ── Admin Login (Database backed) ───────────
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const timeout = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('DATABASE_TIMEOUT')), 5000)
    );

    const [adminUser] = await Promise.race([
        db.select().from(admins).where(eq(admins.username, username)).limit(1),
        timeout
    ]);

    if (!adminUser) {
      return res.status(401).json({ error: 'Account not found' });
    }

    const isMatch = await bcrypt.compare(password, adminUser.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: adminUser.id, username: adminUser.username, role: adminUser.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: adminUser.id, username: adminUser.username, role: adminUser.role } });

  } catch (err: any) {
    console.error('Login error:', err);
    if (err.message === 'DATABASE_TIMEOUT') {
      return res.status(504).json({ error: 'Database Timeout', details: 'Neon database is taking too long to respond. It might be down or scaling.' });
    }
    res.status(500).json({ error: 'Login service failure', details: err.message });
  }
});

// ── Admin Registration (Protected) ───────────
router.post('/register', authenticateToken, async (req, res) => {
  const { username, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const [newAdmin] = await db.insert(admins).values({ username, passwordHash }).returning();
    res.status(201).json({ id: newAdmin.id, username: newAdmin.username });
  } catch (err: any) {
    if (err.code === '23505') { // Postgres Unique Violation
        return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

// ── List All Admins (Protected) ──────────────
router.get('/users', authenticateToken, async (req, res) => {
    try {
        const allAdmins = await db.select({
            id: admins.id,
            username: admins.username,
            role: admins.role,
            createdAt: admins.createdAt
        }).from(admins);
        res.json(allAdmins);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch admin users' });
    }
});

// ── Delete Admin (Protected) ─────────────────
router.delete('/users/:id', authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id as string);
    try {
        await db.delete(admins).where(eq(admins.id, id));
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete admin user' });
    }
});

export default router;

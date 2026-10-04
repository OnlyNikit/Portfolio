import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { dbService } from '../services/db.ts';
import { generateToken, requireAdmin, type AuthRequest } from '../middleware/auth.ts';

export const authRouter = Router();

// Login
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const admin = dbService.getAdminUser();

  const isEmailMatch = email.trim().toLowerCase() === admin.email.toLowerCase();
  const isPassMatch = bcrypt.compareSync(password, admin.passwordHash);

  if (!isEmailMatch || !isPassMatch) {
    res.status(401).json({ error: 'Invalid credentials. Please verify email and password.' });
    return;
  }

  const token = generateToken({ email: admin.email, role: 'admin' });

  // Set HTTP-only cookie
  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({
    success: true,
    token,
    user: {
      email: admin.email,
      role: 'admin'
    }
  });
});

// Logout
authRouter.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get current session
authRouter.get('/me', requireAdmin, (req: AuthRequest, res: Response) => {
  res.json({
    authenticated: true,
    user: req.user
  });
});

// Change password
authRouter.post('/change-password', requireAdmin, (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Current password and new password are required' });
    return;
  }

  const admin = dbService.getAdminUser();
  if (!bcrypt.compareSync(currentPassword, admin.passwordHash)) {
    res.status(400).json({ error: 'Current password incorrect' });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters long' });
    return;
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  dbService.updateAdminPassword(newHash);

  res.json({ success: true, message: 'Password updated successfully' });
});

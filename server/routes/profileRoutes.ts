import { Router } from 'express';
import type { Request, Response } from 'express';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const profileRouter = Router();

// GET public profile
profileRouter.get('/', (_req: Request, res: Response) => {
  try {
    const profile = dbService.getProfile();
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve profile', details: err.message });
  }
});

// PUT update profile (Admin only)
profileRouter.put('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = dbService.updateProfile(req.body);
    res.json({ success: true, profile: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
});

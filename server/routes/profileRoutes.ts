import { Router } from 'express';
import type { Request, Response } from 'express';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const profileRouter = Router();

/**
 * PUBLIC - Get profile
 */
profileRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const profile = await dbService.getProfile();

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
});

/**
 * ADMIN - Update profile
 */
profileRouter.put(
  '/',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const profileData = req.body;

      if (!profileData || typeof profileData !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'Invalid profile data',
        });
      }

      if (profileData.name !== undefined) {
        profileData.name = String(profileData.name).trim();
      }

      if (profileData.displayName !== undefined) {
        profileData.displayName = String(profileData.displayName).trim();
      }

      if (profileData.tagline !== undefined) {
        profileData.tagline = String(profileData.tagline).trim();
      }

      if (profileData.bio !== undefined) {
        profileData.bio = String(profileData.bio).trim();
      }

      if (profileData.email !== undefined) {
        profileData.email = String(profileData.email).trim().toLowerCase();
      }

      const profile = await dbService.updateProfile(profileData);

      res.json({
        success: true,
        profile,
      });
    } catch (error) {
      console.error('Update profile error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
      });
    }
  }
);
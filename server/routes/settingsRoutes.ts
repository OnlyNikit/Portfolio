import { Router } from 'express';
import type { Request, Response } from 'express';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const settingsRouter = Router();

/** PUBLIC - site settings */
settingsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const settings = await dbService.getSiteSettings();
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
});

/** ADMIN - update site settings */
settingsRouter.put('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid settings data' });
    }

    const settings = await dbService.updateSiteSettings(data);
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
});

/** PUBLIC - 3D settings */
settingsRouter.get('/three', async (_req: Request, res: Response) => {
  try {
    const settings = await dbService.getThreeSettings();
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Get 3D settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch 3D settings' });
  }
});

/** ADMIN - update 3D settings */
settingsRouter.put('/three', requireAdmin, async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid 3D settings' });
    }

    const numericFields = [
      'particleDensity',
      'animationIntensity',
      'glowIntensity',
      'cardTiltIntensity',
      'mouseParallaxIntensity'
    ];

    for (const field of numericFields) {
      if (data[field] !== undefined) {
        const value = Number(data[field]);

        if (!Number.isFinite(value) || value < 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid value for ${field}`
          });
        }

        data[field] = value;
      }
    }

    const settings = await dbService.updateThreeSettings(data);
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Update 3D settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to update 3D settings' });
  }
});
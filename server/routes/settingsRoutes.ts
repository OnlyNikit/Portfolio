import { Router } from 'express';
import type { Request, Response } from 'express';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const settingsRouter = Router();

// GET all public settings
settingsRouter.get('/', (_req: Request, res: Response) => {
  try {
    const siteSettings = dbService.getSiteSettings();
    const threeSettings = dbService.getThreeSettings();
    res.json({ site: siteSettings, three: threeSettings });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve settings', details: err.message });
  }
});

// PUT update site settings (Admin only)
settingsRouter.put('/site', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = dbService.updateSiteSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update site settings', details: err.message });
  }
});

// PUT update 3D settings (Admin only)
settingsRouter.put('/3d', requireAdmin, (req: Request, res: Response) => {
  try {
    // Sanitize values to prevent performance destruction
    const updates = { ...req.body };
    if (updates.particleDensity !== undefined) {
      updates.particleDensity = Math.min(150, Math.max(10, Number(updates.particleDensity)));
    }
    if (updates.animationIntensity !== undefined) {
      updates.animationIntensity = Math.min(2.0, Math.max(0.2, Number(updates.animationIntensity)));
    }
    if (updates.cardTiltIntensity !== undefined) {
      updates.cardTiltIntensity = Math.min(2.5, Math.max(0.1, Number(updates.cardTiltIntensity)));
    }

    const updated = dbService.updateThreeSettings(updates);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update 3D settings', details: err.message });
  }
});

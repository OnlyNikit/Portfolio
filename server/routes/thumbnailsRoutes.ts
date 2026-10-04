import { Router } from 'express';
import type { Request, Response } from 'express';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const thumbnailsRouter = Router();

/** PUBLIC - sirf published thumbnails */
thumbnailsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const thumbnails = await dbService.getThumbnails(true);
    res.json({ success: true, thumbnails });
  } catch (error) {
    console.error('Get thumbnails error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch thumbnails' });
  }
});

/** ADMIN - saare thumbnails. /:id se pehle rehna chahiye */
thumbnailsRouter.get('/all', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const thumbnails = await dbService.getThumbnails(false);
    res.json({ success: true, thumbnails });
  } catch (error) {
    console.error('Get all thumbnails error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch thumbnails' });
  }
});

/** ADMIN - add */
thumbnailsRouter.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const data = req.body || {};

    if (!data.title || !data.image) {
      return res.status(400).json({
        success: false,
        message: 'Title and image are required'
      });
    }

    const { _id, ...rest } = data;

    const thumbnail = await dbService.addThumbnail({
      ...rest,
      title: String(data.title).trim(),
      image: String(data.image).trim(),
      client: data.client ? String(data.client).trim() : '',
      category: data.category ? String(data.category).trim() : 'YouTube',
      description: data.description ? String(data.description).trim() : '',
      clientUrl: data.clientUrl ? String(data.clientUrl).trim() : '',
      order: Number.isFinite(Number(data.order)) ? Number(data.order) : 0
    });

    res.status(201).json({ success: true, thumbnail });
  } catch (error) {
    console.error('Add thumbnail error:', error);
    res.status(500).json({ success: false, message: 'Failed to add thumbnail' });
  }
});

/** ADMIN - update */
thumbnailsRouter.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const thumbnail = await dbService.updateThumbnail(req.params.id, req.body);

    if (!thumbnail) {
      return res.status(404).json({ success: false, message: 'Thumbnail not found' });
    }

    res.json({ success: true, thumbnail });
  } catch (error) {
    console.error('Update thumbnail error:', error);
    res.status(500).json({ success: false, message: 'Failed to update thumbnail' });
  }
});

/** ADMIN - delete */
thumbnailsRouter.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const deleted = await dbService.deleteThumbnail(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Thumbnail not found' });
    }

    res.json({ success: true, message: 'Thumbnail deleted successfully' });
  } catch (error) {
    console.error('Delete thumbnail error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete thumbnail' });
  }
});
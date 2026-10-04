import { Router } from 'express';
import type { Request, Response } from 'express';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const thumbnailsRouter = Router();

// GET published thumbnails (public)
thumbnailsRouter.get('/', (_req: Request, res: Response) => {
  try {
    const thumbnails = dbService.getThumbnails(true);
    res.json(thumbnails);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve thumbnails', details: err.message });
  }
});

// GET all thumbnails (Admin only)
thumbnailsRouter.get('/all', requireAdmin, (_req: Request, res: Response) => {
  try {
    const thumbnails = dbService.getThumbnails(false);
    res.json(thumbnails);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve thumbnails', details: err.message });
  }
});

// POST add thumbnail (Admin only)
thumbnailsRouter.post('/', requireAdmin, (req: Request, res: Response) => {
  const { title, client, category, description, image, clientUrl, date, featured, published, order } = req.body;
  if (!title || !image) {
    res.status(400).json({ error: 'title and image are required' });
    return;
  }

  try {
    const newThumb = dbService.addThumbnail({
      title,
      client: client || '',
      category: category || 'YouTube',
      description: description || '',
      image,
      clientUrl: clientUrl || '',
      date: date || new Date().getFullYear().toString(),
      featured: Boolean(featured),
      published: published !== undefined ? Boolean(published) : true,
      order: Number(order) || 1
    });
    res.status(201).json({ success: true, item: newThumb });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add thumbnail', details: err.message });
  }
});

// PUT update thumbnail (Admin only)
thumbnailsRouter.put('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = dbService.updateThumbnail(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Thumbnail not found' });
      return;
    }
    res.json({ success: true, item: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update thumbnail', details: err.message });
  }
});

// DELETE thumbnail (Admin only)
thumbnailsRouter.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = dbService.deleteThumbnail(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Thumbnail not found' });
      return;
    }
    res.json({ success: true, message: 'Thumbnail deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete thumbnail', details: err.message });
  }
});

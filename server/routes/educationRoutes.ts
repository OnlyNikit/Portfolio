import { Router } from 'express';
import type { Request, Response } from 'express';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const educationRouter = Router();

// GET all education entries (public)
educationRouter.get('/', (_req: Request, res: Response) => {
  try {
    const list = dbService.getEducation();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve education history', details: err.message });
  }
});

// POST add education entry (Admin only)
educationRouter.post('/', requireAdmin, (req: Request, res: Response) => {
  const { institution, level, field, startYear, endYear, description, location, achievements, order } = req.body;
  if (!institution || !level || !startYear || !endYear) {
    res.status(400).json({ error: 'institution, level, startYear, and endYear are required' });
    return;
  }

  try {
    const created = dbService.addEducation({
      institution,
      level,
      field: field || '',
      startYear,
      endYear,
      description: description || '',
      location: location || '',
      achievements: Array.isArray(achievements) ? achievements : [],
      order: Number(order) || 1
    });
    res.status(201).json({ success: true, item: created });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add education', details: err.message });
  }
});

// PUT update education entry (Admin only)
educationRouter.put('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = dbService.updateEducation(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Education entry not found' });
      return;
    }
    res.json({ success: true, item: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update education', details: err.message });
  }
});

// DELETE education entry (Admin only)
educationRouter.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = dbService.deleteEducation(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Education entry not found' });
      return;
    }
    res.json({ success: true, message: 'Education deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete education', details: err.message });
  }
});

// POST reorder education (Admin only)
educationRouter.post('/reorder', requireAdmin, (req: Request, res: Response) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    res.status(400).json({ error: 'ids array required' });
    return;
  }
  dbService.reorderEducation(ids);
  res.json({ success: true, list: dbService.getEducation() });
});

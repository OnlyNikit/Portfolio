import { Router } from 'express';
import type { Request, Response } from 'express';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const skillsRouter = Router();

// GET all skills (public)
skillsRouter.get('/', (_req: Request, res: Response) => {
  try {
    const skills = dbService.getSkills();
    res.json(skills);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve skills', details: err.message });
  }
});

// POST add skill (Admin only)
skillsRouter.post('/', requireAdmin, (req: Request, res: Response) => {
  const { name, category, icon, proficiencyLevel, order } = req.body;
  if (!name || !category) {
    res.status(400).json({ error: 'name and category are required' });
    return;
  }

  try {
    const newSkill = dbService.addSkill({
      name,
      category,
      icon: icon || 'Code',
      proficiencyLevel: proficiencyLevel || 'Intermediate',
      order: Number(order) || 1
    });
    res.status(201).json({ success: true, item: newSkill });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add skill', details: err.message });
  }
});

// PUT update skill (Admin only)
skillsRouter.put('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = dbService.updateSkill(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Skill not found' });
      return;
    }
    res.json({ success: true, item: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update skill', details: err.message });
  }
});

// DELETE skill (Admin only)
skillsRouter.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = dbService.deleteSkill(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Skill not found' });
      return;
    }
    res.json({ success: true, message: 'Skill deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete skill', details: err.message });
  }
});

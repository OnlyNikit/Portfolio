import { Router } from 'express';
import type { Request, Response } from 'express';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const skillsRouter = Router();

const ALLOWED_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
] as const;


// GET skills - Public
skillsRouter.get(
  '/',
  async (_req: Request, res: Response) => {
    try {
      const skills = await dbService.getSkills();

      res.json(skills);
    } catch (err: unknown) {
      console.error('Get skills error:', err);

      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';

      res.status(500).json({
        error: 'Failed to retrieve skills',
        details: errorMessage,
      });
    }
  }
);


// CREATE skill - Admin
skillsRouter.post(
  '/',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const {
        name,
        category,
        icon,
        proficiencyLevel,
        order,
      } = req.body;

      if (
        typeof name !== 'string' ||
        typeof category !== 'string'
      ) {
        res.status(400).json({
          error: 'name and category are required',
        });
        return;
      }

      const cleanName = name.trim();
      const cleanCategory = category.trim();

      if (!cleanName || !cleanCategory) {
        res.status(400).json({
          error: 'name and category are required',
        });
        return;
      }

      const level =
        typeof proficiencyLevel === 'string' &&
        proficiencyLevel.trim()
          ? proficiencyLevel.trim()
          : 'Intermediate';

      if (
        !ALLOWED_LEVELS.includes(
          level as typeof ALLOWED_LEVELS[number]
        )
      ) {
        res.status(400).json({
          error: 'Invalid proficiency level',
        });
        return;
      }

      const newSkill = await dbService.addSkill({
        name: cleanName,
        category: cleanCategory,

        icon:
          typeof icon === 'string' && icon.trim()
            ? icon.trim()
            : 'Code',

        proficiencyLevel: level,

        order: Number.isFinite(Number(order))
          ? Number(order)
          : 0,
      });

      res.status(201).json({
        success: true,
        item: newSkill,
      });
    } catch (err: unknown) {
      console.error('Add skill error:', err);

      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';

      res.status(500).json({
        error: 'Failed to add skill',
        details: errorMessage,
      });
    }
  }
);


// UPDATE skill - Admin
skillsRouter.put(
  '/:id',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { proficiencyLevel } = req.body;

      if (
        proficiencyLevel !== undefined &&
        !ALLOWED_LEVELS.includes(
          proficiencyLevel as typeof ALLOWED_LEVELS[number]
        )
      ) {
        res.status(400).json({
          error: 'Invalid proficiency level',
        });
        return;
      }

      const updated = await dbService.updateSkill(
        req.params.id,
        req.body
      );

      if (!updated) {
        res.status(404).json({
          error: 'Skill not found',
        });
        return;
      }

      res.json({
        success: true,
        item: updated,
      });
    } catch (err: unknown) {
      console.error('Update skill error:', err);

      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';

      res.status(500).json({
        error: 'Failed to update skill',
        details: errorMessage,
      });
    }
  }
);


// DELETE skill - Admin
skillsRouter.delete(
  '/:id',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const success = await dbService.deleteSkill(
        req.params.id
      );

      if (!success) {
        res.status(404).json({
          error: 'Skill not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Skill deleted',
      });
    } catch (err: unknown) {
      console.error('Delete skill error:', err);

      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';

      res.status(500).json({
        error: 'Failed to delete skill',
        details: errorMessage,
      });
    }
  }
);
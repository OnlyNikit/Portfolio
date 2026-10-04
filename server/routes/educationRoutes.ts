import { Router } from 'express';
import type { Request, Response } from 'express';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const educationRouter = Router();


// GET all education entries - Public
educationRouter.get(
  '/',
  async (_req: Request, res: Response) => {
    try {
      const list = await dbService.getEducation();

      res.json(list);
    } catch (err: unknown) {
      console.error('Get education error:', err);

      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';

      res.status(500).json({
        error: 'Failed to retrieve education history',
        details: errorMessage,
      });
    }
  }
);


// POST add education entry - Admin only
educationRouter.post(
  '/',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const {
        institution,
        level,
        field,
        startYear,
        endYear,
        description,
        location,
        image,
        achievements,
        order,
      } = req.body;

      if (
        typeof institution !== 'string' ||
        typeof level !== 'string' ||
        typeof startYear !== 'string' ||
        typeof endYear !== 'string'
      ) {
        res.status(400).json({
          error:
            'institution, level, startYear, and endYear are required',
        });
        return;
      }

      const cleanInstitution = institution.trim();
      const cleanLevel = level.trim();
      const cleanStartYear = startYear.trim();
      const cleanEndYear = endYear.trim();

      if (
        !cleanInstitution ||
        !cleanLevel ||
        !cleanStartYear ||
        !cleanEndYear
      ) {
        res.status(400).json({
          error:
            'institution, level, startYear, and endYear are required',
        });
        return;
      }

      const created = await dbService.addEducation({
        institution: cleanInstitution,
        level: cleanLevel,
        field:
          typeof field === 'string'
            ? field.trim()
            : '',
        startYear: cleanStartYear,
        endYear: cleanEndYear,
        description:
          typeof description === 'string'
            ? description.trim()
            : '',
        location:
          typeof location === 'string'
            ? location.trim()
            : '',
        image:
          typeof image === 'string'
            ? image.trim()
            : '',
        achievements:
          Array.isArray(achievements)
            ? achievements
            : [],
        order: Number.isFinite(Number(order))
          ? Number(order)
          : 0,
      });

      res.status(201).json({
        success: true,
        item: created,
      });
    } catch (err: unknown) {
      console.error('Add education error:', err);

      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';

      res.status(500).json({
        error: 'Failed to add education',
        details: errorMessage,
      });
    }
  }
);


// PUT update education entry - Admin only
educationRouter.put(
  '/:id',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const updated = await dbService.updateEducation(
        req.params.id,
        req.body
      );

      if (!updated) {
        res.status(404).json({
          error: 'Education entry not found',
        });
        return;
      }

      res.json({
        success: true,
        item: updated,
      });
    } catch (err: unknown) {
      console.error('Update education error:', err);

      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';

      res.status(500).json({
        error: 'Failed to update education',
        details: errorMessage,
      });
    }
  }
);


// DELETE education entry - Admin only
educationRouter.delete(
  '/:id',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const success = await dbService.deleteEducation(
        req.params.id
      );

      if (!success) {
        res.status(404).json({
          error: 'Education entry not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Education deleted',
      });
    } catch (err: unknown) {
      console.error('Delete education error:', err);

      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';

      res.status(500).json({
        error: 'Failed to delete education',
        details: errorMessage,
      });
    }
  }
);


// POST reorder education - Admin only
educationRouter.post(
  '/reorder',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids)) {
        res.status(400).json({
          error: 'ids array required',
        });
        return;
      }

      await dbService.reorderEducation(ids);

      const list = await dbService.getEducation();

      res.json({
        success: true,
        list,
      });
    } catch (err: unknown) {
      console.error('Reorder education error:', err);

      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';

      res.status(500).json({
        error: 'Failed to reorder education',
        details: errorMessage,
      });
    }
  }
);
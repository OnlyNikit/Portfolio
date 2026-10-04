import { Router } from 'express';
import type { Request, Response } from 'express';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const projectsRouter = Router();

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * PUBLIC - Published projects
 */
projectsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const projects = await dbService.getProjects(false);

    res.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error('Get projects error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
    });
  }
});

/**
 * ADMIN - All projects
 *
 * IMPORTANT:
 * This must stay before /:slug
 */
projectsRouter.get(
  '/all',
  requireAdmin,
  async (_req: Request, res: Response) => {
    try {
      const projects = await dbService.getProjects(true);

      res.json({
        success: true,
        projects,
      });
    } catch (error) {
      console.error('Get all projects error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to fetch projects',
      });
    }
  }
);

/**
 * PUBLIC - Get project by slug
 */
projectsRouter.get(
  '/:slug',
  async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const project = await dbService.getProjectBySlug(slug);

      if (!project || project.published === false) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }

      res.json({
        success: true,
        project,
      });
    } catch (error) {
      console.error('Get project error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to fetch project',
      });
    }
  }
);

/**
 * ADMIN - Create project
 */
projectsRouter.post(
  '/',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const data = req.body;

      if (!data.name) {
        return res.status(400).json({
          success: false,
          message: 'Project name is required',
        });
      }

      const project = await dbService.addProject({
        ...data,
        name: String(data.name).trim(),
        slug: data.slug
          ? createSlug(String(data.slug))
          : createSlug(String(data.name)),
      });

      res.status(201).json({
        success: true,
        project,
      });
    } catch (error) {
      console.error('Create project error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to create project',
      });
    }
  }
);

/**
 * ADMIN - Update project
 */
projectsRouter.put(
  '/:id',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = { ...req.body };

      if (data.name && !data.slug) {
        data.slug = createSlug(String(data.name));
      }

      if (data.slug) {
        data.slug = createSlug(String(data.slug));
      }

      const project = await dbService.updateProject(id, data);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }

      res.json({
        success: true,
        project,
      });
    } catch (error) {
      console.error('Update project error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to update project',
      });
    }
  }
);

/**
 * ADMIN - Delete project
 */
projectsRouter.delete(
  '/:id',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const deleted = await dbService.deleteProject(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }

      res.json({
        success: true,
        message: 'Project deleted successfully',
      });
    } catch (error) {
      console.error('Delete project error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to delete project',
      });
    }
  }
);
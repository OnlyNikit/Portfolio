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

/** PUBLIC - sirf published projects */
projectsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const projects = await dbService.getProjects(true);
    res.json({ success: true, projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

/** ADMIN - saare projects (drafts bhi). /:slug se pehle rehna chahiye */
projectsRouter.get('/all', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const projects = await dbService.getProjects(false);
    res.json({ success: true, projects });
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

/** PUBLIC - slug se project */
projectsRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const project = await dbService.getProjectBySlug(req.params.slug);

    if (!project || project.published === false) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
});

/** ADMIN - create */
projectsRouter.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const data = req.body || {};

    if (!data.name || !String(data.name).trim()) {
      return res.status(400).json({ success: false, message: 'Project name is required' });
    }
    if (!data.shortDescription || !String(data.shortDescription).trim()) {
      return res.status(400).json({ success: false, message: 'Short description is required' });
    }
    if (!data.coverImage || !String(data.coverImage).trim()) {
      return res.status(400).json({ success: false, message: 'Cover image is required' });
    }

    const { _id, createdAt, ...rest } = data;

    const project = await dbService.addProject({
      ...rest,
      name: String(data.name).trim(),
      slug: data.slug
        ? createSlug(String(data.slug))
        : createSlug(String(data.name))
    });

    res.status(201).json({ success: true, project });
  } catch (error: any) {
    console.error('Create project error:', error);

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Is naam/slug ka project pehle se hai. Naam change karo.'
      });
    }

    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
});

/** ADMIN - update */
projectsRouter.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };

    if (data.name && !data.slug) {
      data.slug = createSlug(String(data.name));
    }
    if (data.slug) {
      data.slug = createSlug(String(data.slug));
    }

    const project = await dbService.updateProject(req.params.id, data);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, project });
  } catch (error: any) {
    console.error('Update project error:', error);

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Is slug ka project pehle se hai.'
      });
    }

    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
});

/** ADMIN - delete */
projectsRouter.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const deleted = await dbService.deleteProject(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});
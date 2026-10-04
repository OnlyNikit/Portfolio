import { Router } from 'express';
import type { Request, Response } from 'express';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const projectsRouter = Router();

// GET published projects (public)
projectsRouter.get('/', (_req: Request, res: Response) => {
  try {
    const projects = dbService.getProjects(true);
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve projects', details: err.message });
  }
});

// GET all projects including drafts (Admin only)
projectsRouter.get('/all', requireAdmin, (_req: Request, res: Response) => {
  try {
    const projects = dbService.getProjects(false);
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve projects', details: err.message });
  }
});

// GET project by slug (public)
projectsRouter.get('/:slug', (req: Request, res: Response) => {
  try {
    const project = dbService.getProjectBySlug(req.params.slug);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve project', details: err.message });
  }
});

// POST create project (Admin only)
projectsRouter.post('/', requireAdmin, (req: Request, res: Response) => {
  const { name, slug, shortDescription, longDescription, coverImage, galleryImages, videoUrl, techStack, githubUrl, liveUrl, category, featured, published, order } = req.body;
  if (!name || !shortDescription || !coverImage) {
    res.status(400).json({ error: 'name, shortDescription, and coverImage are required' });
    return;
  }

  const generatedSlug = slug ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-') : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  try {
    const newProj = dbService.addProject({
      name,
      slug: generatedSlug,
      shortDescription,
      longDescription: longDescription || '',
      coverImage,
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [coverImage],
      videoUrl: videoUrl || '',
      techStack: Array.isArray(techStack) ? techStack : [],
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      category: category || 'Full Stack',
      featured: Boolean(featured),
      published: published !== undefined ? Boolean(published) : true,
      order: Number(order) || 1
    });
    res.status(201).json({ success: true, item: newProj });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create project', details: err.message });
  }
});

// PUT update project (Admin only)
projectsRouter.put('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = dbService.updateProject(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ success: true, item: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update project', details: err.message });
  }
});

// DELETE project (Admin only)
projectsRouter.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = dbService.deleteProject(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ success: true, message: 'Project deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete project', details: err.message });
  }
});

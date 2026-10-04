import express from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { dbService } from './server/services/db.ts';
import { authRouter } from './server/routes/authRoutes.ts';
import { profileRouter } from './server/routes/profileRoutes.ts';
import { educationRouter } from './server/routes/educationRoutes.ts';
import { skillsRouter } from './server/routes/skillsRoutes.ts';
import { projectsRouter } from './server/routes/projectsRoutes.ts';
import { thumbnailsRouter } from './server/routes/thumbnailsRoutes.ts';
import { messagesRouter } from './server/routes/messagesRoutes.ts';
import { settingsRouter } from './server/routes/settingsRoutes.ts';
import { mediaRouter } from './server/routes/mediaRoutes.ts';

dotenv.config();

const app = express();
// AI Studio dev server strictly requires port 3000
const isProduction = process.env.NODE_ENV === 'production';
const PORT = isProduction && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parsing with 25mb limit for media uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(cookieParser());

// Static uploads directory
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/education', educationRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/thumbnails', thumbnailsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/media', mediaRouter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    database: dbService.getDbStatus(),
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  // Initialize Database (MongoDB / Local Fallback + Seeds)
  await dbService.init();

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false, // HMR disabled in AI Studio dev environment
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);

    // Fallback for SPA routing in development
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api') || url.startsWith('/uploads')) {
        return next();
      }
      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: unknown) => {
    console.error('Server error:', err);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

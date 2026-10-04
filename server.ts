import 'dotenv/config'; // sabse pehle: baaki imports se pehle .env load ho

import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';

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

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

const PORT =
  isProduction && process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 3000;

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(cookieParser());

// --------------------------------------------------
// API Routes
// --------------------------------------------------

app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/education', educationRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/thumbnails', thumbnailsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/media', mediaRouter);

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    database: dbService.getDbStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Unknown API route -> JSON 404 (HTML nahi)
app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------

async function startServer() {
  try {
    // MongoDB connect hone ke baad hi server start hoga
    await dbService.init();
    console.log('Database initialized successfully');

    // ------------------------------------------------
    // Development (Vite middleware)
    // ------------------------------------------------
    if (!isProduction) {
      const { createServer: createViteServer } = await import('vite');

      const vite = await createViteServer({
        server: { middlewareMode: true, hmr: false },
        appType: 'spa',
      });

      app.use(vite.middlewares);

      // SPA fallback
      app.use('*', async (req, res, next) => {
        const url = req.originalUrl;

        if (url.startsWith('/api')) {
          return next();
        }

        try {
          const indexPath = path.resolve(process.cwd(), 'index.html');
          let template = fs.readFileSync(indexPath, 'utf-8');

          template = await vite.transformIndexHtml(url, template);

          res
            .status(200)
            .set({ 'Content-Type': 'text/html' })
            .end(template);
        } catch (error) {
          vite.ssrFixStacktrace(error as Error);
          next(error);
        }
      });
    }

    // ------------------------------------------------
    // Production (built files)
    // ------------------------------------------------
    else {
      const distPath = path.resolve(process.cwd(), 'dist');

      app.use(express.static(distPath));

      // React SPA fallback
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    // ------------------------------------------------
    // Global error handler (sabse last mein)
    // ------------------------------------------------
    app.use(
      (err: any, _req: Request, res: Response, _next: NextFunction) => {
        console.error('Unhandled error:', err);

        if (err?.type === 'entity.too.large') {
          return res.status(413).json({
            success: false,
            message: 'File bahut badi hai. Chhoti image (max ~15MB) upload karo.',
          });
        }

        if (err?.type === 'entity.parse.failed') {
          return res.status(400).json({
            success: false,
            message: 'Invalid JSON request',
          });
        }

        res.status(err?.status || 500).json({
          success: false,
          message: err?.message || 'Internal server error',
        });
      }
    );

    // ------------------------------------------------
    // Start HTTP Server
    // ------------------------------------------------
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (error: unknown) => {
      console.error('Server error:', error);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
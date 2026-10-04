import express from 'express';
import path from 'path';
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

const isProduction = process.env.NODE_ENV === 'production';

const PORT =
  isProduction && process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 3000;


// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(express.json({ limit: '25mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '25mb',
  })
);

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


// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    database: dbService.getDbStatus(),
    timestamp: new Date().toISOString(),
  });
});


// --------------------------------------------------
// Start Server
// --------------------------------------------------

async function startServer() {
  try {
    // MongoDB must be connected before server starts
    await dbService.init();

    console.log('Database initialized successfully');


    // ------------------------------------------------
    // Development
    // ------------------------------------------------

    if (!isProduction) {
      const { createServer: createViteServer } =
        await import('vite');

      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          hmr: false,
        },
        appType: 'spa',
      });

      app.use(vite.middlewares);

      // SPA fallback
      app.use('*', async (req, res, next) => {
        const url = req.originalUrl;

        // Never interfere with API routes
        if (
          url.startsWith('/api')
        ) {
          return next();
        }

        try {
          const indexPath = path.resolve(
            process.cwd(),
            'index.html'
          );

          const fs = await import('fs');

          let template = fs.readFileSync(
            indexPath,
            'utf-8'
          );

          template = await vite.transformIndexHtml(
            url,
            template
          );

          res
            .status(200)
            .set({
              'Content-Type': 'text/html',
            })
            .end(template);
        } catch (error) {
          vite.ssrFixStacktrace(error as Error);
          next(error);
        }
      });
    }


    // ------------------------------------------------
    // Production
    // ------------------------------------------------

    else {
      const distPath = path.resolve(
        process.cwd(),
        'dist'
      );

      app.use(
        express.static(distPath)
      );

      // React SPA fallback
      app.get('*', (_req, res) => {
        res.sendFile(
          path.join(
            distPath,
            'index.html'
          )
        );
      });
    }


    // ------------------------------------------------
    // Start HTTP Server
    // ------------------------------------------------

    const server = app.listen(
      PORT,
      '0.0.0.0',
      () => {
        console.log(
          `Server running on port ${PORT}`
        );
      }
    );


    // ------------------------------------------------
    // Server Error
    // ------------------------------------------------

    server.on('error', (error: unknown) => {
      console.error(
        'Server error:',
        error
      );
    });

  } catch (error) {
    console.error(
      'Failed to start server:',
      error
    );

    process.exit(1);
  }
}

startServer();
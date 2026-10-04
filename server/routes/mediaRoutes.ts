import { Router } from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const mediaRouter = Router();

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// GET all media items (Admin only)
mediaRouter.get('/', requireAdmin, (_req: Request, res: Response) => {
  try {
    const media = dbService.getMedia();
    res.json(media);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve media library', details: err.message });
  }
});

// POST upload media (Base64 or JSON upload) (Admin only)
mediaRouter.post('/upload', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, data, type } = req.body;

    if (!data) {
      res.status(400).json({ error: 'Image data is required' });
      return;
    }

    const fileName = (name || `upload_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
    const extension = type?.includes('png') ? 'png' : type?.includes('webp') ? 'webp' : 'jpg';
    const finalFilename = `${fileName}_${Date.now()}.${extension}`;
    const filePath = path.join(UPLOADS_DIR, finalFilename);

    // Check if Cloudinary is configured
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      try {
        // If Cloudinary credentials are provided, post to Cloudinary API
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const response = await fetch(cloudinaryUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: data,
            upload_preset: 'ml_default',
            api_key: apiKey
          })
        });
        const cData = await response.json();
        if (cData.secure_url) {
          const item = dbService.addMedia({
            name: fileName,
            url: cData.secure_url,
            size: cData.bytes || 0
          });
          res.json({ success: true, item });
          return;
        }
      } catch (cErr) {
        console.warn('Cloudinary upload fallback to local storage:', cErr);
      }
    }

    // Local file write from Base64
    const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${finalFilename}`;
    const item = dbService.addMedia({
      name: fileName,
      url: publicUrl,
      size: buffer.length
    });

    res.json({ success: true, item });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to upload image', details: err.message });
  }
});

// DELETE media item (Admin only)
mediaRouter.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  const success = dbService.deleteMedia(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Media item not found' });
    return;
  }
  res.json({ success: true, message: 'Media item deleted' });
});

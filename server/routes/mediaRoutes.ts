import { Router } from 'express';
import type { Request, Response } from 'express';
import crypto from 'crypto';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const mediaRouter = Router();

function createSignature(
  params: Record<string, string>,
  apiSecret: string
): string {
  const signatureBase = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return crypto
    .createHash('sha1')
    .update(signatureBase + apiSecret)
    .digest('hex');
}

function getCloudinaryConfig() {
  return {
    cloudName: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
    apiKey: (process.env.CLOUDINARY_API_KEY || '').trim(),
    apiSecret: (process.env.CLOUDINARY_API_SECRET || '').trim(),
  };
}

// Base64 ka max size (~14MB data = ~10MB image)
const MAX_DATA_LENGTH = 14 * 1024 * 1024;

/**
 * ADMIN - Cloudinary config check (debug)
 * Browser console mein ya Network tab mein /api/media/config-check dekho
 */
mediaRouter.get(
  '/config-check',
  requireAdmin,
  (_req: Request, res: Response) => {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

    res.json({
      success: true,
      CLOUDINARY_CLOUD_NAME: cloudName ? `set (${cloudName})` : 'MISSING',
      CLOUDINARY_API_KEY: apiKey ? `set (${apiKey.length} chars)` : 'MISSING',
      CLOUDINARY_API_SECRET: apiSecret ? `set (${apiSecret.length} chars)` : 'MISSING',
      nodeVersion: process.version,
    });
  }
);

/**
 * ADMIN - Get media
 */
mediaRouter.get(
  '/',
  requireAdmin,
  async (_req: Request, res: Response) => {
    try {
      const media = await dbService.getMedia();
      res.json({ success: true, media });
    } catch (error) {
      console.error('Get media error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch media',
      });
    }
  }
);

/**
 * ADMIN - Upload media
 */
mediaRouter.post(
  '/upload',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { name, data, type } = req.body || {};

      if (!data || typeof data !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Image data is required',
        });
      }

      if (!data.startsWith('data:image/')) {
        return res.status(400).json({
          success: false,
          error: 'Sirf image file allowed hai',
        });
      }

      if (type && !String(type).startsWith('image/')) {
        return res.status(400).json({
          success: false,
          error: 'Only image files are allowed',
        });
      }

      if (data.length > MAX_DATA_LENGTH) {
        return res.status(413).json({
          success: false,
          error: 'Image bahut badi hai (max ~10MB). Chhoti image upload karo.',
        });
      }

      const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

      if (!cloudName || !apiKey || !apiSecret) {
        console.error('Cloudinary env missing:', {
          cloudName: !!cloudName,
          apiKey: !!apiKey,
          apiSecret: !!apiSecret,
        });

        return res.status(500).json({
          success: false,
          error:
            'Server pe Cloudinary keys set nahi hain. Render > Environment mein CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET add karo.',
        });
      }

      const timestamp = String(Math.floor(Date.now() / 1000));
      const folder = 'portfolio';

      // Signature mein wahi params jo form mein bhej rahe hain (file, api_key chhodke)
      const signature = createSignature({ folder, timestamp }, apiSecret);

      const formData = new FormData();
      formData.append('file', data);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('folder', folder);
      formData.append('signature', signature);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      let response: globalThis.Response;
      try {
        response = await fetch(cloudinaryUrl, {
          method: 'POST',
          body: formData,
        });
      } catch (networkError: any) {
        console.error('Cloudinary network error:', networkError);
        return res.status(502).json({
          success: false,
          error: `Cloudinary se connect nahi ho paya: ${networkError?.message || 'network error'}`,
        });
      }

      const cloudinaryData: any = await response.json().catch(() => ({}));

      if (!response.ok || !cloudinaryData.secure_url) {
        console.error('Cloudinary upload failed:', response.status, cloudinaryData);

        return res.status(502).json({
          success: false,
          error: `Cloudinary error: ${
            cloudinaryData?.error?.message || `status ${response.status}`
          }`,
        });
      }

      const media = await dbService.addMedia({
        name: name ? String(name).trim() : `upload_${Date.now()}`,
        url: cloudinaryData.secure_url,
        size: Number(cloudinaryData.bytes) || 0,
      });

      res.status(201).json({
        success: true,
        item: media,
      });
    } catch (error: any) {
      console.error('Media upload error:', error);

      res.status(500).json({
        success: false,
        error: `Upload fail: ${error?.message || 'unknown error'}`,
      });
    }
  }
);

/**
 * ADMIN - Delete media metadata
 */
mediaRouter.delete(
  '/:id',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const deleted = await dbService.deleteMedia(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Media not found',
        });
      }

      res.json({
        success: true,
        message: 'Media deleted successfully',
      });
    } catch (error) {
      console.error('Delete media error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete media',
      });
    }
  }
);
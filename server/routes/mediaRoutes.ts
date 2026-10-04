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

/**
 * ADMIN - Get media
 */
mediaRouter.get(
  '/',
  requireAdmin,
  async (_req: Request, res: Response) => {
    try {
      const media = await dbService.getMedia();

      res.json({
        success: true,
        media,
      });
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
      const { name, data, type } = req.body;

      if (!data) {
        return res.status(400).json({
          success: false,
          message: 'Image data is required',
        });
      }

      if (!type || !String(type).startsWith('image/')) {
        return res.status(400).json({
          success: false,
          message: 'Only image files are allowed',
        });
      }

      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret) {
        return res.status(500).json({
          success: false,
          message: 'Cloudinary environment variables are not configured',
        });
      }

      const timestamp = Math.floor(Date.now() / 1000);

      /*
       * Do NOT add public_id unless it is also included
       * in the signature.
       */
      const signature = createSignature(
        { timestamp: String(timestamp) },
        apiSecret
      );

      const formData = new FormData();

      formData.append('file', String(data));
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);

      const cloudinaryUrl =
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      });

      const cloudinaryData = await response.json();

      if (!response.ok || !cloudinaryData.secure_url) {
        console.error(
          'Cloudinary upload failed:',
          cloudinaryData
        );

        return res.status(502).json({
          success: false,
          message: 'Cloudinary upload failed',
          error: cloudinaryData?.error?.message || 'Unknown error',
        });
      }

      const media = await dbService.addMedia({
        name: name
          ? String(name).trim()
          : `upload_${Date.now()}`,
        url: cloudinaryData.secure_url,
        size: Number(cloudinaryData.bytes) || 0,
      });

      res.status(201).json({
        success: true,
        item: media,
      });
    } catch (error) {
      console.error('Media upload error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to upload media',
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
      const { id } = req.params;

      const deleted = await dbService.deleteMedia(id);

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
import { Router } from 'express';
import type { Request, Response } from 'express';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const messagesRouter = Router();

// POST new contact message (Public)
messagesRouter.post(
  '/',
  async (req: Request, res: Response) => {
    const { name, email, message } = req.body;

    // Validate required fields
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string'
    ) {
      res.status(400).json({
        error: 'Name, email, and message are required',
      });
      return;
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim();

    // Validate empty values
    if (!cleanName || !cleanEmail || !cleanMessage) {
      res.status(400).json({
        error: 'Name, email, and message are required',
      });
      return;
    }

    // Validate name length
    if (cleanName.length > 100) {
      res.status(400).json({
        error: 'Name is too long',
      });
      return;
    }

    // Validate message length
    if (cleanMessage.length > 5000) {
      res.status(400).json({
        error: 'Message is too long',
      });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      res.status(400).json({
        error: 'Please provide a valid email address',
      });
      return;
    }

    try {
      const savedMsg = await dbService.addMessage(
        cleanName,
        cleanEmail,
        cleanMessage
      );

      res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully.',
        item: savedMsg,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';

      console.error('Create message error:', err);

      res.status(500).json({
        error: 'Failed to submit message',
        details: errorMessage,
      });
    }
  }
);


// GET all messages (Admin only)
messagesRouter.get(
  '/',
  requireAdmin,
  async (_req: Request, res: Response) => {
    try {
      const messages = await dbService.getMessages();

      res.json(messages);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';

      console.error('Get messages error:', err);

      res.status(500).json({
        error: 'Failed to retrieve messages',
        details: errorMessage,
      });
    }
  }
);


// PUT mark message as read/unread
messagesRouter.put(
  '/:id/read',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const read =
        req.body.read !== undefined
          ? Boolean(req.body.read)
          : true;

      const success = await dbService.markMessageRead(
        req.params.id,
        read
      );

      if (!success) {
        res.status(404).json({
          error: 'Message not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Message status updated',
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';

      console.error('Update message status error:', err);

      res.status(500).json({
        error: 'Failed to update message',
        details: errorMessage,
      });
    }
  }
);


// DELETE message
messagesRouter.delete(
  '/:id',
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const success = await dbService.deleteMessage(
        req.params.id
      );

      if (!success) {
        res.status(404).json({
          error: 'Message not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Message deleted',
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';

      console.error('Delete message error:', err);

      res.status(500).json({
        error: 'Failed to delete message',
        details: errorMessage,
      });
    }
  }
);
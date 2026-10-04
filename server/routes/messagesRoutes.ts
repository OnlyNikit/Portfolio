import { Router } from 'express';
import type { Request, Response } from 'express';
import { dbService } from '../services/db.ts';
import { requireAdmin } from '../middleware/auth.ts';

export const messagesRouter = Router();

// POST new contact message (public)
messagesRouter.post('/', (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required' });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Please provide a valid email address' });
    return;
  }

  try {
    const savedMsg = dbService.addMessage(name.trim(), email.trim(), message.trim());
    res.status(201).json({ success: true, message: 'Your message has been sent successfully.', item: savedMsg });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to submit message', details: err.message });
  }
});

// GET all messages (Admin only)
messagesRouter.get('/', requireAdmin, (_req: Request, res: Response) => {
  try {
    const messages = dbService.getMessages();
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve messages', details: err.message });
  }
});

// PUT mark message as read/unread (Admin only)
messagesRouter.put('/:id/read', requireAdmin, (req: Request, res: Response) => {
  const { read } = req.body;
  const success = dbService.markMessageRead(req.params.id, read !== undefined ? Boolean(read) : true);
  if (!success) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  res.json({ success: true, message: 'Message status updated' });
});

// DELETE message (Admin only)
messagesRouter.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  const success = dbService.deleteMessage(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  res.json({ success: true, message: 'Message deleted' });
});

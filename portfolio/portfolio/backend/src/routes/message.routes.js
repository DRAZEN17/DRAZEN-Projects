import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createMessage, listMessages, markRead, removeMessage } from '../controllers/message.controller.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', rateLimit({ windowMs: 60 * 60 * 1000, max: 10 }), createMessage);
router.get('/', protect, requireRole('admin'), listMessages);
router.patch('/:id/read', protect, requireRole('admin'), markRead);
router.delete('/:id', protect, requireRole('admin'), removeMessage);

export default router;

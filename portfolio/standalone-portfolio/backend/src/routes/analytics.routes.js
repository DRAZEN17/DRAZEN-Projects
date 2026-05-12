import { Router } from 'express';
import { track, summary } from '../controllers/analytics.controller.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();
router.post('/track', track);
router.get('/summary', protect, requireRole('admin'), summary);
export default router;

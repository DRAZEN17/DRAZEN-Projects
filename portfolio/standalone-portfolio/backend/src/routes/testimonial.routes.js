import { Router } from 'express';
import Testimonial from '../models/Testimonial.js';
import { crud } from '../controllers/crud.factory.js';
import { protect, requireRole } from '../middleware/auth.js';

const c = crud(Testimonial);
const router = Router();

router.get('/', c.list);
router.post('/', protect, requireRole('admin'), c.create);
router.put('/:id', protect, requireRole('admin'), c.update);
router.delete('/:id', protect, requireRole('admin'), c.remove);

export default router;

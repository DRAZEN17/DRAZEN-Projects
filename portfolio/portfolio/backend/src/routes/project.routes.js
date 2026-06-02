import { Router } from 'express';
import Project from '../models/Project.js';
import { crud } from '../controllers/crud.factory.js';
import { protect, requireRole } from '../middleware/auth.js';

const c = crud(Project);
const router = Router();

router.get('/', c.list);
router.get('/:id', c.get);
router.post('/', protect, requireRole('admin'), c.create);
router.put('/:id', protect, requireRole('admin'), c.update);
router.delete('/:id', protect, requireRole('admin'), c.remove);

export default router;

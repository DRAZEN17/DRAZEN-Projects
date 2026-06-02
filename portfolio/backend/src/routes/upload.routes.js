import { Router } from 'express';
import { upload } from '../utils/cloudinary.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/image', protect, requireRole('admin'), upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' });
  // multer + Cloudinary provide different file props; normalize to URL
  // Prefer Cloudinary `location`/`path`; for disk storage always return server uploads URL
  let url = '';
  if (req.file.location) {
    url = req.file.location;
  } else if (req.file.path && req.file.path.includes('public')) {
    // disk storage: construct public URL regardless of multer.path
    const host = req.get('host');
    const proto = req.protocol;
    url = `${proto}://${host}/uploads/${req.file.filename}`;
  }
  res.json({ url, publicId: req.file.filename });
});

export default router;

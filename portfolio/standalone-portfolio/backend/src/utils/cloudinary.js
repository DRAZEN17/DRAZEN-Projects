import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const useCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

let storage;
if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: { folder: 'portfolio', allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'] },
  });
} else {
  // Fallback: save uploads to backend/public/uploads and serve them statically
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  fs.mkdirSync(uploadsDir, { recursive: true });

  storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const name = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
      cb(null, name);
    },
  });
}

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

export { upload, cloudinary };

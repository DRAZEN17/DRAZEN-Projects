import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Project from '../models/Project.js';

function toPublicUrl(filePath) {
  if (!filePath) return filePath;
  // If already a URL, return as-is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;
  // Extract filename from Windows or UNIX path
  const parts = filePath.split(/[\\/]/);
  const filename = parts[parts.length - 1];
  return `http://localhost:${process.env.PORT || 5000}/uploads/${filename}`;
}

async function run() {
  try {
    await connectDB(process.env.MONGO_URI);
    const projects = await Project.find();
    let updated = 0;
    for (const p of projects) {
      let changed = false;
      if (p.coverImage && !p.coverImage.startsWith('http')) {
        p.coverImage = toPublicUrl(p.coverImage);
        changed = true;
      }
      if (Array.isArray(p.images) && p.images.length) {
        const newImages = p.images.map((img) => (img && !img.startsWith('http') ? toPublicUrl(img) : img));
        if (JSON.stringify(newImages) !== JSON.stringify(p.images)) {
          p.images = newImages; changed = true;
        }
      }
      if (changed) { await p.save(); updated += 1; }
    }
    console.log('Migration complete. Projects updated:', updated);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

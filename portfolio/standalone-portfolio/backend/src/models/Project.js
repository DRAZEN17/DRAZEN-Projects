import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    longDescription: String,
    coverImage: String,
    images: [String],
    videoUrl: String,
    techStack: [String],
    category: { type: String, default: 'web' },
    githubUrl: String,
    liveUrl: String,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);

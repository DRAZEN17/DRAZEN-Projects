import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: String,
    content: { type: String, required: true },
    coverImage: String,
    tags: [String],
    published: { type: Boolean, default: false },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Blog', blogSchema);

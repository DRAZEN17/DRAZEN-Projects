import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['page_view', 'project_click', 'contact_submit', 'blog_view'], required: true },
    path: String,
    refId: String,
    referrer: String,
    userAgent: String,
    ip: String,
  },
  { timestamps: true }
);

analyticsSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model('Analytics', analyticsSchema);

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: String,
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    ip: String,
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);

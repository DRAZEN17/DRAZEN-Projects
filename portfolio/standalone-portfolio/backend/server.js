import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import path from 'path';
import { connectDB } from './src/config/db.js';
import { errorHandler, notFound } from './src/middleware/error.js';

import authRoutes from './src/routes/auth.routes.js';
import projectRoutes from './src/routes/project.routes.js';
import blogRoutes from './src/routes/blog.routes.js';
import testimonialRoutes from './src/routes/testimonial.routes.js';
import messageRoutes from './src/routes/message.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';

const app = express();

// Allow cross-origin resource loading for assets (uploads) when frontend runs on a different origin/port
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get('/api/health', (_req, res) => res.json({ ok: true, time: Date.now() }));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// Serve uploaded files when Cloudinary is not configured
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});

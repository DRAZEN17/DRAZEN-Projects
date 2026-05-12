import 'dotenv/config';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Project from './models/Project.js';
import Blog from './models/Blog.js';
import Testimonial from './models/Testimonial.js';

async function run() {
  await connectDB(process.env.MONGO_URI);

  await Promise.all([User.deleteMany({}), Project.deleteMany({}), Blog.deleteMany({}), Testimonial.deleteMany({})]);

  const admin = await User.create({
    name: 'Admin', email: 'admin@example.com', password: 'admin1234', role: 'admin',
  });

  await Project.insertMany([
    {
      title: 'Neon Commerce', slug: 'neon-commerce',
      description: 'A futuristic e-commerce platform with realtime inventory.',
      longDescription: 'Built with Next.js, Stripe, and a custom GSAP animation engine.',
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
      techStack: ['React', 'Node', 'Stripe', 'Postgres'],
      githubUrl: 'https://github.com/example/neon', liveUrl: 'https://example.com',
      featured: true, order: 1,
    },
    {
      title: 'Quantum Dashboard', slug: 'quantum-dashboard',
      description: 'Realtime analytics dashboard for cyberpunk SaaS.',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
      techStack: ['Vue', 'D3', 'WebSockets'], featured: true, order: 2,
    },
    {
      title: 'Holo Portfolio', slug: 'holo-portfolio',
      description: 'Award-winning portfolio with 3D hover cards.',
      coverImage: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=1200',
      techStack: ['Three.js', 'GSAP'], order: 3,
    },
  ]);

  await Blog.insertMany([
    {
      title: 'Mastering GSAP ScrollTrigger', slug: 'mastering-gsap-scrolltrigger',
      excerpt: 'Patterns I use to ship buttery-smooth scroll animations.',
      content: '## Intro\nGSAP ScrollTrigger is...',
      tags: ['GSAP', 'Animation'], published: true, author: admin._id,
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
    },
  ]);

  await Testimonial.insertMany([
    { name: 'Sarah Chen', role: 'CTO', company: 'Lumen Labs', quote: 'Shipped a flagship product in record time.', rating: 5 },
    { name: 'Marcus Reed', role: 'Design Director', company: 'Orbit', quote: 'Animations that genuinely surprised our users.', rating: 5 },
  ]);

  console.log('Seed complete. Admin login: admin@example.com / admin1234');
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });

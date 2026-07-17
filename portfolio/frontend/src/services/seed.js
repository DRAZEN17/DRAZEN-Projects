// ─────────────────────────────────────────────────────────────────────────────
//  seed.js  ·  Seed initial data into localStorage on first load
// ─────────────────────────────────────────────────────────────────────────────
import { db } from './api.js';

const anidarCover = new URL('../Assets/Screenshot 2026-07-08 172141.png', import.meta.url).href;
const drazenCover = new URL('../Assets/Screenshot 2026-07-08 172931.png', import.meta.url).href;
const sxtCover = new URL('../Assets/flyer.jpg', import.meta.url).href;
const spyltWeb = new URL('../Assets/spylt web.jpg', import.meta.url).href;
const spyltMobile = new URL('../Assets/spylt mobile.png', import.meta.url).href;

const seededProjects = [
  {
    title: 'anidar',
    slug: 'cinematic-portfolio',
    description: ' A personal website made with tailwind and react  website  made for browsing anime, manhwa and manhua ,updates, release dates and details.',
    longDescription: '',
    coverImage: anidarCover,
    techStack: ['React', 'TailwindCSS', 'Vite'],
    category: 'web',
    githubUrl: 'https://github.com/DRAZEN17/DRAZEN-Projects/tree/f5edc523542547396e842a620726aef0f9c17029/anidar',
    liveUrl: 'https://anidar.vercel.app/',
    featured: true,
    order: 0,
    clicks: 0,
  },
  {
    title: 'DRAZEN PAVILLION',
    slug: 'drazen-pavillion',
    description: ' A personal website made with tailwind and react  website  made for browsing, renting, selling and buying houses ',
    longDescription: '',
    coverImage: drazenCover,
    techStack: ['React', 'TailwindCSS', 'Vite'],
    category: 'web',
    githubUrl: 'https://github.com/DRAZEN17/DRAZEN-Projects/tree/2d2caddcb2c06876f0d37264013632e09f298e21/drazen-pavillion',
    liveUrl: 'https://drazen-pavillion.vercel.app',
    featured: true,
    order: 1,
    clicks: 0,
  },
  {
    title: 'SPYLT(web design)',
    slug: 'spylt web',
    description: 'FREAKING DELICIOUS PROTEIN + CAFFEINE',
    longDescription: 'SPYLT is a protein and caffeine drink that helps you stay focused and energized throughout the day. With a unique blend of natural ingredients, SPYLT provides a clean energy boost without the jitters or crash associated with traditional energy drinks.',
    coverImage: spyltWeb,
    techStack: ['UI/UX'],
    category: 'landing page',
    githubUrl: '',
    liveUrl: '',
    featured: true,
    order: 2,
    clicks: 0,
  },
  {
    title: 'SPYLT(mobile design)',
    slug: 'spylt mobile',
    description: 'FREAKING DELICIOUS PROTEIN + CAFFEINE',
    longDescription: 'SPYLT is a protein and caffeine drink that helps you stay focused and energized throughout the day. With a unique blend of natural ingredients, SPYLT provides a clean energy boost without the jitters or crash associated with traditional energy drinks.',
    coverImage: spyltMobile,
    techStack: ['UI/UX'],
    category: 'landing page',
    githubUrl: '',
    liveUrl: '',
    featured: true,
    order: 3,
    clicks: 0,
  },
  {
    title: 'SXT PRINTING',
    slug: 'sxt printing',
    description: 'Professional printing and graphic design services.',
    longDescription: '',
    coverImage: sxtCover,
    techStack: ['UI/UX'],
    category: 'flyer',
    githubUrl: '',
    liveUrl: '',
    featured: true,
    order: 4,
    clicks: 0,
  },
];

export function seedIfEmpty() {
  // ── Projects ───────────────────────────────────────────────────────────────
  if (db.projects.all().length === 0) {
    db.projects.seed(seededProjects);
  } else {
    seededProjects.forEach((project) => {
      const existing = db.projects.query((d) => d.slug === project.slug)[0];
      if (existing && existing.coverImage !== project.coverImage) {
        db.projects.update(existing._id, { coverImage: project.coverImage });
      }
    });
  }

  // ── Blogs ──────────────────────────────────────────────────────────────────
  db.blogs.seed([
    {
      title: 'Building Cinematic Web Experiences with GSAP',
      slug: 'gsap-cinematic-web',
      excerpt: 'How to use ScrollTrigger, pinning, and horizontal scroll to create scroll-driven animations that feel like film.',
      content: 'Cinematic web design borrows from filmmaking: staging, timing, and emotional arcs.\n\nGSAP ScrollTrigger lets you synchronize any animation to scroll position with sub-pixel precision. The key insight is treating the scroll bar like a film timeline — each pixel of scroll maps to a moment in your story.\n\nStart with a pinned horizontal section. Pin the wrapper, measure the track width, and animate `translateX` from 0 to `-trackWidth`. Set `scrub: true` and the scroll position drives the animation directly, no RAF loops needed.\n\nNext, layer staggered text reveals. Split headings into lines with SplitText (or a manual span wrapper), then use `gsap.from` with a `stagger` of 0.05–0.1 seconds. The result feels like a title card from a Kubrick film.\n\nFinally, integrate WebGL particles with Three.js. A few hundred instanced meshes, each position driven by a simplex noise field, add atmospheric depth without blocking the main thread — use an offscreen canvas or OffscreenRenderer.\n\nThe result: a portfolio that visitors remember.',
      coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=900&q=80',
      tags: ['GSAP', 'Animation', 'JavaScript'],
      published: false,
      views: 0,
    },
  ]);

  // ── Testimonials ───────────────────────────────────────────────────────────
  db.testimonials.seed([
    {
      name: 'Sarah Chen',
      role: 'CTO',
      company: 'Launchpad Studio',
      avatar: 'https://i.pravatar.cc/80?img=1',
      quote: 'DRAZEN shipped our entire marketing site in 10 days. The animations are genuinely stunning — clients keep asking who built it.',
      rating: 5,
      approved: false,
    },
  ]);

  // ── Admin user (password: draxly170) ───────────────────────────────────────
  if (db.users.all().length === 0) {
    const hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    db.users.create({
      name: 'DRAZEN Admin',
      email: 'drazen90sea@gmail.com',
      password: 'draxly170',
      role: 'admin',
    });
  }
}

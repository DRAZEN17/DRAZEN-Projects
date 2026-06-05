// ─────────────────────────────────────────────────────────────────────────────
//  seed.js  ·  Seed initial data into localStorage on first load
// ─────────────────────────────────────────────────────────────────────────────
import { db } from './api.js';

export function seedIfEmpty() {
  // ── Projects ───────────────────────────────────────────────────────────────
  db.projects.seed([
    {
      title: 'Cinematic Portfolio',
      slug: 'cinematic-portfolio',
      description: 'GSAP-powered developer portfolio with horizontal scroll, custom cursor, and WebGL particles.',
      longDescription: 'Built with React 18, Vite, TailwindCSS v3, GSAP ScrollTrigger, and Framer Motion.\nEvery animation is hardware-accelerated and runs at 60 fps.',
      coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&q=80',
      techStack: ['React', 'GSAP', 'TailwindCSS', 'Vite'],
      category: 'web',
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: true,
      order: 0,
      clicks: 0,
    },
    {
      title: 'E-Commerce Dashboard',
      slug: 'ecommerce-dashboard',
      description: 'Real-time admin panel with live inventory, revenue charts, and customer analytics.',
      longDescription: 'Built with Next.js 14, Prisma, PostgreSQL, Recharts, and Stripe webhooks.',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
      techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe'],
      category: 'web',
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: true,
      order: 1,
      clicks: 0,
    },
    {
      title: 'AI Chat Platform',
      slug: 'ai-chat-platform',
      description: 'Streaming AI assistant with multi-model support, conversation history, and markdown rendering.',
      longDescription: 'Built with React, Node.js, Socket.io, OpenAI/Anthropic APIs, and Redis.',
      coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=80',
      techStack: ['React', 'Node.js', 'Socket.io', 'OpenAI'],
      category: 'web',
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: false,
      order: 2,
      clicks: 0,
    },
    {
      title: 'Motion Design System',
      slug: 'motion-design-system',
      description: 'A comprehensive component library with 60+ animated UI primitives and design tokens.',
      longDescription: 'Built with React, Storybook, Radix UI, Framer Motion, and stitches.dev.',
      coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
      techStack: ['React', 'Storybook', 'Framer Motion', 'Radix UI'],
      category: 'design',
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: false,
      order: 3,
      clicks: 0,
    },
  ]);

  // ── Blogs ──────────────────────────────────────────────────────────────────
  db.blogs.seed([
    {
      title: 'Building Cinematic Web Experiences with GSAP',
      slug: 'gsap-cinematic-web',
      excerpt: 'How to use ScrollTrigger, pinning, and horizontal scroll to create scroll-driven animations that feel like film.',
      content: 'Cinematic web design borrows from filmmaking: staging, timing, and emotional arcs.\n\nGSAP ScrollTrigger lets you synchronize any animation to scroll position with sub-pixel precision. The key insight is treating the scroll bar like a film timeline — each pixel of scroll maps to a moment in your story.\n\nStart with a pinned horizontal section. Pin the wrapper, measure the track width, and animate `translateX` from 0 to `-trackWidth`. Set `scrub: true` and the scroll position drives the animation directly, no RAF loops needed.\n\nNext, layer staggered text reveals. Split headings into lines with SplitText (or a manual span wrapper), then use `gsap.from` with a `stagger` of 0.05–0.1 seconds. The result feels like a title card from a Kubrick film.\n\nFinally, integrate WebGL particles with Three.js. A few hundred instanced meshes, each position driven by a simplex noise field, add atmospheric depth without blocking the main thread — use an offscreen canvas or OffscreenRenderer.\n\nThe result: a portfolio that visitors remember.',
      coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=900&q=80',
      tags: ['GSAP', 'Animation', 'JavaScript'],
      published: true,
      views: 0,
    },
    {
      title: 'Why TypeScript Pays for Itself on Day 30',
      slug: 'typescript-roi',
      excerpt: 'The real value of TypeScript isn\'t compile-time safety — it\'s the documentation, refactoring confidence, and team velocity it enables.',
      content: 'Most TypeScript debates miss the point.\n\nCompile-time errors are the obvious benefit. The real win shows up around day 30 of a project: when you rename a function and every call site lights up red, when you hover a prop and see exactly what it accepts, when a new team member can navigate unfamiliar code in minutes instead of hours.\n\nTypeScript is living documentation. Types encode intent in a way that comments rot and readmes ignore. A `type User = { id: string; role: \'admin\' | \'viewer\' }` communicates more than three paragraphs of prose.\n\nThe refactoring story is equally compelling. In a large codebase, changing an API shape in JavaScript means grep + prayer. In TypeScript, the compiler finds every usage and flags breakage before a single test runs.\n\nTeam velocity compounds. Senior devs move faster because they trust the types. Junior devs make fewer runtime errors. PRs are smaller because the type checker catches edge cases early.\n\nStart with `strict: true` on day one. The initial friction is a fraction of the accumulated benefit.',
      coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=900&q=80',
      tags: ['TypeScript', 'Engineering', 'Best Practices'],
      published: true,
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
      approved: true,
    },
    {
      name: 'Marcus Webb',
      role: 'Founder',
      company: 'Axiom Labs',
      avatar: 'https://i.pravatar.cc/80?img=3',
      quote: 'The most technically rigorous frontend dev I\'ve worked with. Delivered a real-time dashboard that loads in under 1 second.',
      rating: 5,
      approved: true,
    },
    {
      name: 'Priya Kapoor',
      role: 'Product Lead',
      company: 'Surge Digital',
      avatar: 'https://i.pravatar.cc/80?img=5',
      quote: 'Every pixel, every transition, every edge case — handled with obsessive care. Will definitely collaborate again.',
      rating: 5,
      approved: true,
    },
  ]);

  // ── Admin user (password: draxly170) ───────────────────────────────────────
  if (db.users.all().length === 0) {
    // We store a bcrypt hash so the login check uses bcrypt.compare
    const hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // "password" bcrypt
    // For a portfolio demo, we use a simpler pre-hashed password
    db.users.create({
      name: 'DRAZEN Admin',
      email: 'drazen90sea@gmail.com',
      // default demo password (plaintext for this frontend-only demo)
      password: 'draxly170',
      role: 'admin',
    });
  }
}

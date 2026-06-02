import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CursorFollower from './components/CursorFollower.jsx';
import Loader from './components/Loader.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuthStore } from './store/authStore.js';
import { trackPageView } from './services/analytics.js';

const Home = lazy(() => import('./pages/Home.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const Blog = lazy(() => import('./pages/Blog.jsx'));
const BlogDetail = lazy(() => import('./pages/BlogDetail.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const ProjectsAdmin = lazy(() => import('./pages/admin/ProjectsAdmin.jsx'));
const BlogsAdmin = lazy(() => import('./pages/admin/BlogsAdmin.jsx'));
const MessagesAdmin = lazy(() => import('./pages/admin/MessagesAdmin.jsx'));
const AnalyticsAdmin = lazy(() => import('./pages/admin/AnalyticsAdmin.jsx'));

export default function App() {
  const { hydrate } = useAuthStore();
  const location = useLocation();

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => { trackPageView(location.pathname); }, [location.pathname]);

  return (
    <>
      <CursorFollower />
      <Navbar />
      <Suspense fallback={<Loader />}>
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen"
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute role="admin" />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="projects" element={<ProjectsAdmin />} />
                  <Route path="blogs" element={<BlogsAdmin />} />
                  <Route path="messages" element={<MessagesAdmin />} />
                  <Route path="analytics" element={<AnalyticsAdmin />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.main>
        </AnimatePresence>
      </Suspense>
      <Footer />
    </>
  );
}

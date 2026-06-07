import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import PublicLayout from './components/PublicLayout';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';
import LanguageUrlHandler from './components/LanguageUrlHandler';
import { useTranslation } from './context/LanguageContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AcademyPage = lazy(() => import('./pages/AcademyPage'));
const SetupPage = lazy(() => import('./pages/SetupPage'));
const GrowthPage = lazy(() => import('./pages/GrowthPage'));
const AIPage = lazy(() => import('./pages/AIPage'));
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const BlogManagement = lazy(() => import('./admin/BlogManagement'));
const CaseStudiesManagement = lazy(() => import('./admin/CaseStudiesManagement'));
const ContactsManagement = lazy(() => import('./admin/ContactsManagement'));
const ChangePassword = lazy(() => import('./admin/ChangePassword'));

import { AuthProvider } from './auth';

function MetaManager() {
  const { pathname } = useLocation();
  const t = useTranslation();
  useEffect(() => {
    const titles = {
      '/': t('seo.defaultTitle'),
      '/about': `${t('about.title')} · ${t('common.brandFull')}`,
      '/academy': `${t('academy.title')} · ${t('common.brandFull')}`,
      '/setup': `${t('setup.title')} · ${t('common.brandFull')}`,
      '/growth': `${t('growth.title')} · ${t('common.brandFull')}`,
      '/ai': `${t('ai.title')} · ${t('common.brandFull')}`,
      '/case-studies': `${t('caseStudies.title')} · ${t('common.brandFull')}`,
      '/blog': `${t('blog.title')} · ${t('common.brandFull')}`,
      '/contact': `${t('contact.title')} · ${t('common.brandFull')}`,
      '/admin': `${t('admin.dashboard.title')} · ${t('common.brandFull')}`,
    };
    const base =
      titles[pathname] ||
      (pathname.startsWith('/blog/') ? `${t('blog.title')} · ${t('common.brandFull')}` : null);
    if (base) document.title = base;
  }, [pathname, t]);
  return null;
}

function PageLoader() {
  const t = useTranslation();
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="page-loader-spinner" aria-hidden="true" />
      <span className="sr-only">{t('common.loading')}</span>
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/growth" element={<GrowthPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="blog" element={<BlogManagement />} />
          <Route path="cases" element={<CaseStudiesManagement />} />
          <Route path="contacts" element={<ContactsManagement />} />
          <Route path="password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  // Default: BrowserRouter (Hostinger, custom domain, any real server).
  // Set VITE_ROUTER=hash at build time for static hosts without an SPA
  // fallback (e.g. GitHub Pages) — URLs become /#/blog/some-slug.
  const Router = import.meta.env.VITE_ROUTER === 'hash' ? HashRouter : BrowserRouter;
  return (
    <AuthProvider>
      <Router>
        <LanguageUrlHandler />
        <ScrollToTop />
        <MetaManager />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

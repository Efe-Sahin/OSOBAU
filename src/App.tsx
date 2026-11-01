import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { AnimatePresence, MotionConfig } from 'motion/react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SkipLink from './components/SkipLink';
import HomePage from './pages/HomePage';

// Unterseiten werden bei Bedarf geladen (kleineres Start-Bundle)
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const ImprintPage = lazy(() => import('./pages/ImprintPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  const location = useLocation();

  return (
    // reducedMotion="user" → respektiert prefers-reduced-motion automatisch
    <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
      <SkipLink />
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<div className="min-h-[70vh]" aria-hidden="true" />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            {/* Onepager: frühere Unterseiten leiten auf die Abschnitte der Startseite um */}
            <Route path="/ueber-uns" element={<Navigate to="/#ueber-uns" replace />} />
            <Route path="/leistungen" element={<Navigate to="/#leistungen" replace />} />
            <Route path="/leistungen/:slug" element={<Navigate to="/#leistungen" replace />} />
            <Route path="/projekte" element={<Navigate to="/#projekte" replace />} />
            <Route path="/kontakt" element={<Navigate to="/#kontakt" replace />} />
            {/* Ausnahmen mit eigener Seite */}
            <Route path="/projekte/:slug" element={<ProjectDetailPage />} />
            {/* Englische Fassung */}
            <Route path="/en" element={<HomePage />} />
            <Route path="/en/projekte/:slug" element={<ProjectDetailPage />} />
            <Route path="/en/*" element={<NotFoundPage />} />
            <Route path="/impressum" element={<ImprintPage />} />
            <Route path="/datenschutz" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <Footer />
    </MotionConfig>
  );
}

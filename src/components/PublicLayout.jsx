import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Navigation from './Navigation';
import Footer from './Footer';
import ConsentBanner from './ConsentBanner';
import { initAnalytics, subscribeConsent } from '../consent';
import { pageTransition } from '../motion/presets';

export default function PublicLayout() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    initAnalytics();
    const unsubscribe = subscribeConsent((value) => {
      if (value && value.analytics) {
        const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
        if (domain && !document.querySelector('script[data-plausible]')) {
          const s = document.createElement('script');
          s.defer = true;
          s.src = 'https://plausible.io/js/script.js';
          s.dataset.plausible = domain;
          s.dataset.domain = domain;
          document.head.appendChild(s);
        }
      }
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <Navigation />
      <AnimatePresence mode="wait">
        {shouldReduceMotion ? (
          <div key={location.pathname}>
            <Suspense fallback={
              <div className="page-loader" role="status" aria-live="polite">
                <div className="page-loader-spinner" aria-hidden="true" />
              </div>
            }>
              <Outlet />
            </Suspense>
          </div>
        ) : (
          <motion.main
            key={location.pathname}
            initial={pageTransition.initial}
            animate={pageTransition.animate}
            exit={pageTransition.exit}
          >
            <Suspense fallback={
              <div className="page-loader" role="status" aria-live="polite">
                <div className="page-loader-spinner" aria-hidden="true" />
              </div>
            }>
              <Outlet />
            </Suspense>
          </motion.main>
        )}
      </AnimatePresence>
      <Footer />
      <ConsentBanner />
    </>
  );
}

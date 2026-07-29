import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher/LanguageSwitcher';
import './NavPortal.css';

/* ── Animation variants ── */
const SPRING_SLIDE = { type: 'spring', stiffness: 320, damping: 32, mass: 0.8 };

const menuInitial = { x: '100%' };
const menuAnimate = { x: 0, transition: SPRING_SLIDE };
const menuExit = { x: '100%', transition: { ...SPRING_SLIDE, duration: 0.25 } };

const reducedMenuInitial = { opacity: 0 };
const reducedMenuAnimate = { opacity: 1, transition: { duration: 0.15 } };
const reducedMenuExit = { opacity: 0, transition: { duration: 0.1 } };

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function NavPortal() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const t = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  /* Close menu on route change */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  /* Lock body scroll when menu is open */
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const original = document.body.style.overflow;
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = original;
    }
    return () => {
      document.body.style.overflow = original;
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const motionProps = shouldReduceMotion
    ? { initial: reducedMenuInitial, animate: reducedMenuAnimate, exit: reducedMenuExit }
    : { initial: menuInitial, animate: menuAnimate, exit: menuExit };

  return (
    <>
      {/* ── NAV BAR ── */}
      <nav className="np-nav" aria-label={t('nav.primaryLabel')}>
        <div className="np-inner">
          <Link to="/" className="np-logo" onClick={closeMobileMenu}>
            <img
              src={`${import.meta.env.BASE_URL}images/nav logo.png`}
              alt={t('common.brand')}
            />
          </Link>

          <div className="np-center">
            <ul className="np-links" id="np-nav-links">
              <li><Link to="/academy" onClick={closeMobileMenu}>{t('nav.academy')}</Link></li>
              <li><Link to="/setup" onClick={closeMobileMenu}>{t('nav.setup')}</Link></li>
              <li><Link to="/growth" onClick={closeMobileMenu}>{t('nav.growth')}</Link></li>
              <li><Link to="/contact" onClick={closeMobileMenu}>{t('nav.contact')}</Link></li>
            </ul>

            <div className="np-cta">
              <LanguageSwitcher variant="compact" />
              <button
                type="button"
                className="np-cta-btn"
                onClick={() => navigate('/roadmap')}
              >
                📞 <span className="np-cta-label">{t('nav.roadmap')}</span>
              </button>
            </div>
          </div>

          {/* ── HAMBURGER TOGGLE ── */}
          <button
            type="button"
            className="np-toggle"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
            aria-expanded={isMobileMenuOpen}
            aria-controls="np-mobile-menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* ── BACKDROP ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.button
            key="np-backdrop"
            type="button"
            className="np-backdrop"
            aria-label={t('common.closeMenu')}
            onClick={closeMobileMenu}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={backdropVariants}
          />
        )}
      </AnimatePresence>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="np-mobile-menu"
            className="np-mobile-menu"
            id="np-mobile-menu"
            aria-hidden={!isMobileMenuOpen}
            animate={isMobileMenuOpen ? 'animate' : shouldReduceMotion ? 'exit' : 'initial'}
            initial={false}
            {...motionProps}
          >
            <ul className="np-mobile-links">
              <li><Link to="/academy" onClick={closeMobileMenu}>{t('nav.academy')}</Link></li>
              <li><Link to="/setup" onClick={closeMobileMenu}>{t('nav.setup')}</Link></li>
              <li><Link to="/growth" onClick={closeMobileMenu}>{t('nav.growth')}</Link></li>
              <li><Link to="/contact" onClick={closeMobileMenu}>{t('nav.contact')}</Link></li>
            </ul>

            <div className="np-mobile-lang">
              <LanguageSwitcher variant="mobile" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

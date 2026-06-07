import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import './Navigation.css';

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

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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
    ? {
        initial: reducedMenuInitial,
        animate: reducedMenuAnimate,
        exit: reducedMenuExit,
      }
    : {
        initial: menuInitial,
        animate: menuAnimate,
        exit: menuExit,
      };

  return (
    <nav className="nav" aria-label={t('nav.primaryLabel')}>
      <div className="nav-inner container">
        <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
          {t('common.brand')}
          <span>.</span>
        </Link>

        <motion.ul
          className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}
          id="primary-nav"
          aria-hidden={!isMobileMenuOpen}
          animate={isMobileMenuOpen ? 'animate' : shouldReduceMotion ? 'exit' : 'initial'}
          initial={false}
          {...motionProps}
        >
          <li>
            <Link to="/" onClick={closeMobileMenu}>
              {t('nav.home')}
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={closeMobileMenu}>
              {t('nav.about')}
            </Link>
          </li>
          <li>
            <Link to="/academy" onClick={closeMobileMenu}>
              {t('nav.academy')}
            </Link>
          </li>
          <li>
            <Link to="/setup" onClick={closeMobileMenu}>
              {t('nav.setup')}
            </Link>
          </li>
          <li>
            <Link to="/growth" onClick={closeMobileMenu}>
              {t('nav.growth')}
            </Link>
          </li>
          <li>
            <Link to="/ai" onClick={closeMobileMenu}>
              {t('nav.ai')}
            </Link>
          </li>
          <li>
            <Link to="/case-studies" onClick={closeMobileMenu}>
              {t('nav.caseStudies')}
            </Link>
          </li>
          <li>
            <Link to="/blog" onClick={closeMobileMenu}>
              {t('nav.blog')}
            </Link>
          </li>
          <li className="nav-mobile-cta nav-mobile-lang">
            <LanguageSwitcher variant="mobile" />
          </li>
          <li className="nav-mobile-cta">
            <Link to="/contact" className="btn btn-outline" onClick={closeMobileMenu}>
              {t('nav.contact')}
            </Link>
          </li>
          <li className="nav-mobile-cta">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                closeMobileMenu();
                navigate('/contact');
              }}
            >
              {t('nav.bookFreeCall')}
            </button>
          </li>
        </motion.ul>

        <div className="nav-cta">
          <LanguageSwitcher variant="compact" />
          <Link to="/contact" className="btn btn-outline">
            {t('nav.contact')}
          </Link>
          <button
            type="button"
            className="btn btn-primary nav-cta-call"
            onClick={() => navigate('/contact')}
          >
            <span className="nav-cta-icon" aria-hidden="true">
              📞
            </span>
            <span className="nav-cta-label">{t('nav.bookFreeCall')}</span>
          </button>
        </div>

        <button
          type="button"
          className="nav-toggle"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
          aria-expanded={isMobileMenuOpen}
          aria-controls="primary-nav"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.button
            type="button"
            className="nav-backdrop"
            aria-label={t('common.closeMenu')}
            onClick={closeMobileMenu}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={backdropVariants}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navigation;

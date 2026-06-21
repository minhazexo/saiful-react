import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import './Navigation.css';
import './Navigation.responsive.css';

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

const Chevron = () => (
  <svg className="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const t = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  const toggleDropdown = (key) => setOpenMenu((cur) => (cur === key ? null : key));

  // Instant jump (the app sets a global scroll-behavior: smooth, which would
  // otherwise restart its animation on every re-pin and crawl very slowly).
  const jumpToPackages = () => {
    const el = document.getElementById('packages');
    if (!el) return;
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    el.scrollIntoView({ block: 'start' });
    root.style.scrollBehavior = prev;
  };

  const goToPackages = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setOpenMenu(null);
    if (location.pathname === '/') {
      document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/');
      // Re-pin during the post-navigation settling window so lazy content
      // reflow above the section doesn't leave us short of the target.
      let tries = 0;
      const tick = () => {
        jumpToPackages();
        if (++tries < 10) setTimeout(tick, 120);
      };
      setTimeout(tick, 200);
    }
  };

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
      <div className="nav-inner">
        <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
          <img src={`${import.meta.env.BASE_URL}images/nav logo.png`} alt={t('common.brand')} />
        </Link>

        <div className="nav-center-wrap container">
          <motion.ul
            className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}
            id="primary-nav"
            aria-hidden={!isMobileMenuOpen}
            animate={isMobileMenuOpen ? 'animate' : shouldReduceMotion ? 'exit' : 'initial'}
            initial={false}
            {...motionProps}
          >
            <li>
              <Link to="/academy" onClick={closeMobileMenu}>
                {t('nav.academy')}
              </Link>
            </li>

            <li className={`nav-dropdown ${openMenu === 'services' ? 'open' : ''}`}>
              <button
                type="button"
                className="nav-dropdown-toggle"
                onClick={() => toggleDropdown('services')}
                aria-expanded={openMenu === 'services'}
                aria-haspopup="true"
              >
                {t('nav.services')}
                <Chevron />
              </button>
              <ul className="nav-dropdown-menu">
                <li>
                  <Link to="/setup" onClick={closeMobileMenu}>
                    <span className="nav-dd-icon" aria-hidden="true">🚀</span>
                    {t('nav.setup')}
                  </Link>
                </li>
                <li>
                  <Link to="/growth" onClick={closeMobileMenu}>
                    <span className="nav-dd-icon" aria-hidden="true">📈</span>
                    {t('nav.growth')}
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/case-studies" onClick={closeMobileMenu}>
                {t('nav.successStories')}
              </Link>
            </li>

            <li className={`nav-dropdown ${openMenu === 'more' ? 'open' : ''}`}>
              <button
                type="button"
                className="nav-dropdown-toggle"
                onClick={() => toggleDropdown('more')}
                aria-expanded={openMenu === 'more'}
                aria-haspopup="true"
              >
                {t('nav.more')}
                <Chevron />
              </button>
              <ul className="nav-dropdown-menu">
                <li>
                  <a href="/#packages" onClick={goToPackages}>
                    <span className="nav-dd-icon" aria-hidden="true">💳</span>
                    {t('nav.pricing')}
                  </a>
                </li>
                <li>
                  <Link to="/ai" onClick={closeMobileMenu}>
                    <span className="nav-dd-icon" aria-hidden="true">🤖</span>
                    {t('nav.ai')}
                  </Link>
                </li>
                <li>
                  <Link to="/blog" onClick={closeMobileMenu}>
                    <span className="nav-dd-icon" aria-hidden="true">✍️</span>
                    {t('nav.blog')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={closeMobileMenu}>
                    <span className="nav-dd-icon" aria-hidden="true">✉️</span>
                    {t('nav.contact')}
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-mobile-cta nav-mobile-lang">
              <LanguageSwitcher variant="mobile" />
            </li>
            <li className="nav-mobile-cta">
              <Link to="/roadmap" className="btn btn-primary" onClick={closeMobileMenu}>
                {t('nav.roadmap')}
              </Link>
            </li>
          </motion.ul>

          <div className="nav-cta">
            <div className="nav-lang-cta">
              <LanguageSwitcher variant="compact" />
            </div>
            <button
              type="button"
              className="btn btn-primary nav-cta-call"
              onClick={() => navigate('/roadmap')}
            >
              <span className="nav-cta-icon" aria-hidden="true">
                📞
              </span>
              <span className="nav-cta-label">{t('nav.roadmap')}</span>
            </button>
          </div>

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

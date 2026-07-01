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

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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
              <Link to="/contact" onClick={closeMobileMenu}>
                {t('nav.contact')}
              </Link>
            </li>

            <li className="nav-mobile-cta nav-mobile-lang">
              <LanguageSwitcher variant="mobile" />
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

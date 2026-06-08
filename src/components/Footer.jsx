import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import './Footer.css';

function Footer() {
  const t = useTranslation();
  const year = new Date().getFullYear();

  const SOCIALS = [
    {
      key: 'socialFacebook',
      href: 'https://facebook.com/saifulstudios',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
        </svg>
      ),
    },
    {
      key: 'socialInstagram',
      href: 'https://instagram.com/saifulstudios',
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      key: 'socialYouTube',
      href: 'https://youtube.com/@saifulstudios',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5 3-5 3z" />
        </svg>
      ),
    },
    {
      key: 'socialLinkedIn',
      href: 'https://linkedin.com/company/saifulstudios',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.1A4.2 4.2 0 0 1 17.5 9c4 0 4.7 2.6 4.7 6.1V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4V9z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo" style={{ marginBottom: '16px' }}>
              <img src={`${import.meta.env.BASE_URL}images/SS-Color-Logo-White.png`} alt={t('common.brand')} />
            </div>
            <p>{t('footer.tagline')}</p>
            <div className="footer-socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  className="social-btn"
                  aria-label={t(`footer.${s.key}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <div className="footer-lang">
              <span className="footer-lang-label">{t('common.language')}:</span>
              <LanguageSwitcher variant="mobile" />
            </div>
          </div>

          <div className="footer-col">
            <h4>{t('footer.services')}</h4>
            <ul className="footer-links">
              <li>
                <Link to="/academy">{t('footer.academy')}</Link>
              </li>
              <li>
                <Link to="/setup">{t('footer.businessSetup')}</Link>
              </li>
              <li>
                <Link to="/growth">{t('footer.growthServices')}</Link>
              </li>
              <li>
                <Link to="/ai">{t('footer.aiMarketing')}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('footer.company')}</h4>
            <ul className="footer-links">
              <li>
                <Link to="/about">{t('footer.aboutUs')}</Link>
              </li>
              <li>
                <Link to="/case-studies">{t('nav.caseStudies')}</Link>
              </li>
              <li>
                <Link to="/blog">{t('footer.blog')}</Link>
              </li>
              <li>
                <Link to="/contact">{t('nav.contact')}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('footer.contact')}</h4>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <span aria-hidden="true">📧</span>{' '}
                <a href="mailto:saifulstudios@gmail.com">saifulstudios@gmail.com</a>
              </div>
              <div className="footer-contact-item">
                <span aria-hidden="true">📍</span> {t('footer.locationValue')}
              </div>
              <div className="footer-contact-item">⏰ {t('footer.businessHours')}</div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('footer.copyright', { year })}</p>
          <p>
            {t('footer.builtFor')} · {t('footer.privacy')} · {t('footer.terms')}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

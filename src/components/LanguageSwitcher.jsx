import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import './LanguageSwitcher.css';

const LABELS = {
  en: { short: 'EN', full: 'English' },
  bn: { short: 'BN', full: 'বাংলা' },
};

const PILL_LAYOUT_ID = 'lang-switcher-active-pill';

function LanguageSwitcher({ variant = 'desktop' }) {
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const handleSelect = (lang) => {
    if (lang === language) return;
    setLanguage(lang);
  };

  return (
    <div
      className={`lang-switcher lang-switcher--${variant}`}
      role="group"
      aria-label={t('common.switchLanguage')}
    >
      {supportedLanguages.map((lang) => {
        const isActive = lang === language;
        return (
          <button
            key={lang}
            type="button"
            className={`lang-switcher-btn ${isActive ? 'active' : ''}`}
            onClick={() => handleSelect(lang)}
            aria-pressed={isActive}
            aria-label={t('common.selectLanguage') + ' — ' + LABELS[lang].full}
            lang={lang}
          >
            {isActive && !shouldReduceMotion && (
              <motion.span
                aria-hidden="true"
                layoutId={PILL_LAYOUT_ID}
                className="lang-switcher-active-bg"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="lang-short" aria-hidden="true">
              {LABELS[lang].short}
            </span>
            <span className="lang-full">{LABELS[lang].full}</span>
          </button>
        );
      })}
    </div>
  );
}

export default LanguageSwitcher;

import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitcher.css';
import './LanguageSwitcher.responsive.css';

const LABELS = {
  en: { short: 'EN', full: 'English' },
  bn: { short: 'BN', full: 'বাংলা' },
};

function LanguageSwitcher({ variant = 'desktop' }) {
  const { language, setLanguage, supportedLanguages, t } = useLanguage();

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

import { useEffect, useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { acceptAll, rejectAll, getConsent, subscribeConsent } from '../../consent';
import './ConsentBanner.css';
import './ConsentBanner.responsive.css';

export default function ConsentBanner() {
  const t = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsent()) return undefined;
    setVisible(true);
    const unsubscribe = subscribeConsent(() => setVisible(false));
    return unsubscribe;
  }, []);

  if (!visible) return null;

  return (
    <div className="consent-banner" role="region" aria-label={t('consent.label')}>
      <p>{t('consent.text')}</p>
      <div className="consent-actions">
        <button type="button" className="btn btn-outline" onClick={rejectAll}>
          {t('consent.reject')}
        </button>
        <button type="button" className="btn btn-primary" onClick={acceptAll}>
          {t('consent.accept')}
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { IS_DEMO_MODE } from '../api';
import { useTranslation } from '../context/LanguageContext';

const DISMISS_KEY = 'saiful-demo-banner-dismissed';

export default function DemoBanner() {
  const t = useTranslation();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY) === '1') setDismissed(true);
    } catch {
      /* sessionStorage unavailable */
    }
  }, []);

  if (!IS_DEMO_MODE || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="demo-banner" role="status" aria-live="polite">
      <div className="demo-banner-inner container">
        <span className="demo-banner-icon" aria-hidden="true">
          👀
        </span>
        <span className="demo-banner-text">{t('demo.banner')}</span>
        <button
          type="button"
          className="demo-banner-close"
          onClick={handleDismiss}
          aria-label={t('common.close')}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

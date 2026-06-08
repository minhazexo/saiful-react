import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import en from '../../public/locales/en.json';
import bn from '../../public/locales/bn.json';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'saiful-language';
const SUPPORTED_LANGUAGES = ['en', 'bn'];
const DEFAULT_LANGUAGE = 'bn';
const BUNDLED = { en, bn };

function detectLanguageFromPath(pathname) {
  if (typeof pathname !== 'string') return null;
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && SUPPORTED_LANGUAGES.includes(parts[0])) {
    return parts[0];
  }
  return null;
}

function getInitialLanguage() {
  try {
    const fromUrl =
      typeof window !== 'undefined' ? detectLanguageFromPath(window.location.pathname) : null;
    if (fromUrl) return fromUrl;
  } catch {
    // ignore
  }
  // Always start with the configured default language ('bn')
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children, initialLanguage, initialTranslations }) {
  const [language, setLanguageState] = useState(() => initialLanguage || getInitialLanguage());
  const [translations, setTranslations] = useState(
    () => initialTranslations || BUNDLED[initialLanguage || getInitialLanguage()] || BUNDLED.en
  );
  const [isLoading] = useState(false);

  useEffect(() => {
    if (initialTranslations) return;
    const next = BUNDLED[language] || BUNDLED.en;
    setTranslations(next);
  }, [language, initialTranslations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = language;
        document.documentElement.setAttribute('data-lang', language);
      }
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setLanguageState(lang);
    }
  }, []);

  const t = useCallback(
    (key, params = {}) => {
      const keys = String(key).split('.');
      let value = translations;
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key;
        }
      }
      if (Array.isArray(value)) return value;
      if (typeof value !== 'string') return key;
      return value.replace(/\{\{(\w+)\}\}/g, (match, param) =>
        params[param] !== undefined ? String(params[param]) : match
      );
    },
    [translations]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      isLoading,
      supportedLanguages: SUPPORTED_LANGUAGES,
    }),
    [language, setLanguage, t, isLoading]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}

export function useTranslation() {
  const { t } = useLanguage();
  return t;
}

export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, detectLanguageFromPath };

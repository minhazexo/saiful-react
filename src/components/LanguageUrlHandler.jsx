import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useLanguage,
  detectLanguageFromPath,
  SUPPORTED_LANGUAGES,
} from '../context/LanguageContext';

/**
 * Strips a leading /en or /bn prefix from the URL, sets the language
 * to match, and replaces the history entry. Runs once on first mount and
 * again whenever the path changes to another prefixed path.
 */
export default function LanguageUrlHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const fromUrl = detectLanguageFromPath(location.pathname);
    if (!fromUrl) return;

    if (fromUrl !== language) {
      setLanguage(fromUrl);
    }

    const stripped = location.pathname.replace(/^\/(en|bn)(?=\/|$)/, '') || '/';
    if (stripped !== location.pathname) {
      navigate(stripped + location.search + location.hash, { replace: true });
    }
  }, [location.pathname, location.search, location.hash, language, setLanguage, navigate]);

  return null;
}

export { SUPPORTED_LANGUAGES };

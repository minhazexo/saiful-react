import { useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';

const SITE_URL = (typeof window !== 'undefined' && window.__SITE_URL__) || '';

function setMeta(name, content, attr = 'name') {
  if (!content) return;
  const selector = `meta[${attr}="${name}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  if (!href) return;
  const selector = `link[rel="${rel}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo({
  title,
  description,
  path,
  image,
  type = 'website',
  noIndex = false,
}) {
  const t = useTranslation();
  const defaultTitle = t('seo.defaultTitle');
  const defaultDescription = t('seo.defaultDescription');
  const resolvedDescription = description || defaultDescription;

  useEffect(() => {
    const fullTitle = title ? `${title} · ${defaultTitle}` : defaultTitle;
    document.title = fullTitle;
    setMeta('description', resolvedDescription);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', resolvedDescription, 'property');
    setMeta('og:type', type, 'property');
    if (image) {
      const abs = /^https?:\/\//.test(image) ? image : `${SITE_URL}${image}`;
      setMeta('og:image', abs, 'property');
    }
    if (path) {
      const url = `${SITE_URL}${path}`;
      setLink('canonical', url);
      setMeta('og:url', url, 'property');
    }
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', resolvedDescription);
    if (image) {
      const abs = /^https?:\/\//.test(image) ? image : `${SITE_URL}${image}`;
      setMeta('twitter:image', abs);
    }
    if (noIndex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      setMeta('robots', 'index, follow');
    }
  }, [title, resolvedDescription, path, image, type, noIndex, defaultTitle]);

  return null;
}

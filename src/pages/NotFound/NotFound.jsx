import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import Seo from '../../components/Seo';

export default function NotFound() {
  const t = useTranslation();
  return (
    <div className="page">
      <Seo title={t('notFound.subtitle')} description={t('notFound.description')} noIndex />
      <div className="container not-found-wrap">
        <h1 className="not-found-code">{t('notFound.title')}</h1>
        <h2>{t('notFound.subtitle')}</h2>
        <p className="not-found-desc">{t('notFound.description')}</p>
        <Link to="/" className="btn btn-primary">
          ← {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  );
}

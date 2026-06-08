import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import Seo from '../../components/Seo';

export default function NotFound() {
  const t = useTranslation();
  return (
    <div className="page">
      <Seo title={t('notFound.subtitle')} description={t('notFound.description')} noIndex />
      <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 96, marginBottom: 8 }}>{t('notFound.title')}</h1>
        <h2>{t('notFound.subtitle')}</h2>
        <p style={{ marginTop: 16, marginBottom: 24, color: 'var(--text-muted)' }}>
          {t('notFound.description')}
        </p>
        <Link to="/" className="btn btn-primary">
          ← {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import './AdminDashboard.css';

function AdminDashboard() {
  const t = useTranslation();
  const cards = [
    { to: '/admin/blog', icon: '📰', key: 'blog' },
    { to: '/admin/cases', icon: '📁', key: 'cases' },
    { to: '/admin/contacts', icon: '📧', key: 'contacts' },
  ];

  return (
    <>
      <header className="admin-header">
        <h1>{t('admin.dashboard.title')}</h1>
      </header>

      <div className="admin-body">
        <div className="dashboard-overview">
          <h2>{t('admin.dashboard.welcome')}</h2>
          <p>{t('admin.dashboard.welcomeSubtitle')}</p>

          <div className="stats-grid">
            {cards.map((c) => {
              const title = t(`admin.dashboard.cards.${c.key}.title`);
              const desc = t(`admin.dashboard.cards.${c.key}.desc`);
              return (
                <Link
                  key={c.to}
                  to={c.to}
                  className="stat-card"
                  aria-label={t('admin.dashboard.openCard', { title })}
                >
                  <div className="stat-icon" aria-hidden="true">
                    {c.icon}
                  </div>
                  <h3>{title}</h3>
                  <p className="stat-value">{desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;

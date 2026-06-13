import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';
import { useTranslation } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher/LanguageSwitcher';
import './AdminDashboard/AdminDashboard.css';
import './AdminDashboard/AdminDashboard.responsive.css';

function AdminLayout() {
  const t = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const original = document.body.style.overflow;
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = original;
    }
    return () => {
      document.body.style.overflow = original;
    };
  }, [isSidebarOpen]);

  return (
    <div className={`admin-dashboard ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <button
        type="button"
        className="sidebar-toggle"
        aria-label={isSidebarOpen ? t('admin.nav.closeSidebar') : t('admin.nav.openSidebar')}
        aria-expanded={isSidebarOpen}
        aria-controls="admin-sidebar-nav"
        onClick={() => setIsSidebarOpen((v) => !v)}
      >
        <span aria-hidden="true">{isSidebarOpen ? '✕' : '☰'}</span>
      </button>

      {isSidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label={t('admin.nav.closeSidebar')}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}
        aria-hidden={!isSidebarOpen}
      >
        <div className="sidebar-header">
          <h2>{t('admin.nav.title')}</h2>
        </div>

        <nav id="admin-sidebar-nav" className="admin-nav" aria-label={t('admin.nav.title')}>
          <NavLink
            end
            to="/admin"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span aria-hidden="true">📊</span> {t('admin.nav.dashboard')}
          </NavLink>
          <NavLink
            to="/admin/blog"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span aria-hidden="true">📰</span> {t('admin.nav.blog')}
          </NavLink>
          <NavLink
            to="/admin/cases"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span aria-hidden="true">📁</span> {t('admin.nav.cases')}
          </NavLink>
          <NavLink
            to="/admin/contacts"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span aria-hidden="true">📧</span> {t('admin.nav.contacts')}
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span aria-hidden="true">👥</span> {t('admin.nav.users')}
          </NavLink>
          <NavLink
            to="/admin/audit"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span aria-hidden="true">📋</span> {t('admin.nav.audit')}
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar" aria-hidden="true">
              {user?.name?.[0] || 'A'}
            </div>
            <div>
              <p className="user-name">{user?.name || t('admin.nav.title')}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          <div className="sidebar-actions">
            <NavLink to="/admin/password" className="sidebar-link">
              <span aria-hidden="true">🔒</span> {t('admin.nav.password')}
            </NavLink>
            <div className="sidebar-lang">
              <LanguageSwitcher variant="mobile" />
            </div>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              {t('admin.nav.logout')}
            </button>
          </div>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;

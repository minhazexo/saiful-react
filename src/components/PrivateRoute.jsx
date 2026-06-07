import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';
import { useTranslation } from '../context/LanguageContext';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, bootstrapping } = useAuth();
  const location = useLocation();
  const t = useTranslation();

  if (bootstrapping) {
    return (
      <div className="admin-loading" role="status" aria-live="polite">
        <span className="sr-only">{t('privateRoute.checking')}</span>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

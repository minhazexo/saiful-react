import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';
import { useTranslation } from '../context/LanguageContext';
import './AdminLogin.css';

function AdminLogin() {
  const t = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from =
        location.state?.from && location.state.from !== '/admin/login'
          ? location.state.from
          : '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.error || t('admin.login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-box">
          <h1>{t('admin.login.title')}</h1>
          <p>{t('admin.login.subtitle')}</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">{t('admin.login.emailLabel')}</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('admin.login.emailPlaceholder')}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('admin.login.passwordLabel')}</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('admin.login.passwordPlaceholder')}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? t('admin.login.submitting') : t('admin.login.submit')}
            </button>
          </form>

          <p className="signup-text">
            {t('admin.login.signupPrompt')}{' '}
            <a href="mailto:hello@saifulstudios.com">{t('admin.login.signupLink')}</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

import { useState } from 'react';
import api from '../api';
import { useTranslation } from '../context/LanguageContext';
import './ChangePassword.css';

function ChangePassword() {
  const t = useTranslation();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ kind: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ kind: 'error', message: t('admin.password.mismatch') });
      return;
    }
    setIsSubmitting(true);
    setStatus({ kind: 'idle', message: '' });
    try {
      const { data } = await api.put('/auth/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setStatus({ kind: 'success', message: data.message || t('admin.password.success') });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setStatus({
        kind: 'error',
        message: error.response?.data?.error || t('admin.password.error'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="change-password-page">
      <header className="admin-header">
        <h1>{t('admin.password.title')}</h1>
      </header>
      <div className="admin-body">
        <form className="management-form change-password-form" onSubmit={handleSubmit}>
          {status.kind === 'success' && (
            <p className="success-message" role="status" aria-live="polite">
              {status.message}
            </p>
          )}
          {status.kind === 'error' && (
            <p className="error-message" role="alert">
              {status.message}
            </p>
          )}

          <div className="form-group">
            <label htmlFor="currentPassword">{t('admin.password.currentLabel')}</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">{t('admin.password.newLabel')}</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={12}
              value={form.newPassword}
              onChange={handleChange}
              required
              aria-describedby="newPassword-help"
            />
            <small id="newPassword-help">{t('admin.password.help')}</small>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">{t('admin.password.confirmLabel')}</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? t('admin.password.submitting') : t('admin.password.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;

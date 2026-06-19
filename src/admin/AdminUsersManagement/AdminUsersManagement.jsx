import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../api';
import { useTranslation } from '../../context/LanguageContext';
import { formatDate } from '../../utils/date';
import './AdminUsersManagement.css';

function UsersManagement() {
  const t = useTranslation();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'editor',
  });

  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => { aliveRef.current = false; };
  }, []);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/users');
      if (!aliveRef.current) return;
      setUsers(res.data || []);
    } catch (err) {
      if (err.response?.status === 401) return;
      if (!aliveRef.current) return;
      setError(err.response?.data?.error || t('admin.users.errorLoad'));
    } finally {
      if (aliveRef.current) setIsLoading(false);
    }
  }, [t]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const openCreate = () => {
    setEditingId(null);
    setFormData({ email: '', password: '', name: '', role: 'editor' });
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      email: user.email || '',
      password: '',
      name: user.name || '',
      role: user.role || 'editor',
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ email: '', password: '', name: '', role: 'editor' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const payload = { email: formData.email, name: formData.name, role: formData.role };
        if (formData.password) payload.password = formData.password;
        await api.put(`/admin/users/${editingId}`, payload);
      } else {
        await api.post('/admin/users', formData);
      }
      closeForm();
      loadUsers();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Unknown error';
      window.alert(msg);
    }
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(t('admin.users.deleteConfirm', { email }))) return;
    try {
      await api.delete(`/admin/users/${id}`);
      loadUsers();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Unknown error';
      window.alert(msg);
    }
  };

  return (
    <>
      <header className="admin-header">
        <h1>{t('admin.users.title')}</h1>
      </header>
      <div className="admin-body">
        <div className="management-panel">
          <div className="management-header">
            <h2>{editingId ? t('admin.users.edit') : t('admin.users.title')}</h2>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => (showForm ? closeForm() : openCreate())}
            >
              {showForm ? (
                <><span aria-hidden="true">✕</span> {t('admin.users.cancel')}</>
              ) : (
                <><span aria-hidden="true">+</span> {t('admin.users.new')}</>
              )}
            </button>
          </div>

          {error && <div className="error-message" role="alert">{error}</div>}

          {showForm && (
            <form className="management-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="user-email">{t('admin.users.emailLabel')}</label>
                  <input
                    id="user-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="user-name">{t('admin.users.nameLabel')}</label>
                  <input
                    id="user-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="user-password">
                    {editingId ? t('admin.users.passwordOptional') : t('admin.users.passwordLabel')}
                  </label>
                  <input
                    id="user-password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!editingId}
                    minLength={12}
                    autoComplete="new-password"
                  />
                  {editingId && <small>{t('admin.users.passwordHelp')}</small>}
                </div>
                <div className="form-group">
                  <label htmlFor="user-role">{t('admin.users.roleLabel')}</label>
                  <select id="user-role" name="role" value={formData.role} onChange={handleChange}>
                    <option value="editor">{t('admin.users.roleEditor')}</option>
                    <option value="admin">{t('admin.users.roleAdmin')}</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? t('admin.users.save') : t('admin.users.create')}
                </button>
                <button type="button" className="btn btn-outline" onClick={closeForm}>
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          )}

          <div className="management-list">
            {isLoading ? (
              <p>{t('admin.users.loading')}</p>
            ) : users.length === 0 ? (
              <p className="no-items">{t('admin.users.noItems')}</p>
            ) : (
              <table className="management-table">
                <thead>
                  <tr>
                    <th>{t('admin.users.col.name')}</th>
                    <th>{t('admin.users.col.email')}</th>
                    <th>{t('admin.users.col.role')}</th>
                    <th>{t('admin.users.col.created')}</th>
                    <th>{t('admin.contacts.col.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name || '—'}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'published' : 'draft'}`}>
                          {user.role === 'admin' ? t('admin.users.roleAdmin') : t('admin.users.roleEditor')}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <button
                          type="button"
                          className="action-btn edit"
                          onClick={() => openEdit(user)}
                          aria-label={`${t('common.edit')} ${user.email}`}
                        >
                          <span aria-hidden="true">✏</span> {t('common.edit')}
                        </button>
                        <button
                          type="button"
                          className="action-btn delete"
                          onClick={() => handleDelete(user.id, user.email)}
                          aria-label={`${t('common.delete')} ${user.email}`}
                        >
                          <span aria-hidden="true">🗑</span> {t('common.delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UsersManagement;

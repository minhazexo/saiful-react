import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../api';
import { useTranslation } from '../../context/LanguageContext';
import { formatDate } from '../../utils/date';
import './AuditLog.css';

function AuditLogPage() {
  const t = useTranslation();
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 30;

  const [filters, setFilters] = useState({
    admin: '',
    resource: '',
    action: '',
  });

  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => { aliveRef.current = false; };
  }, []);

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = { limit, offset: page * limit, sort: 'createdAt', order: 'DESC' };
      if (filters.admin) params.admin = filters.admin;
      if (filters.resource) params.resource = filters.resource;
      if (filters.action) params.action = filters.action;
      const res = await api.get('/audit', { params });
      if (!aliveRef.current) return;
      setLogs(res.data.rows || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      // 401 is handled globally by the auth interceptor — no need to show an error
      if (err.response?.status === 401) return;
      if (!aliveRef.current) return;
      setError(err.response?.data?.error || t('admin.audit.errorLoad'));
    } finally {
      if (aliveRef.current) setIsLoading(false);
    }
  }, [page, filters, t]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const pageCount = Math.ceil(total / limit);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const actionLabels = {
    create: t('admin.audit.actionCreate'),
    update: t('admin.audit.actionUpdate'),
    delete: t('admin.audit.actionDelete'),
    login: t('admin.audit.actionLogin'),
    logout: t('admin.audit.actionLogout'),
    bulk_delete: t('admin.audit.actionBulkDelete'),
    bulk_update: t('admin.audit.actionBulkUpdate'),
  };

  const resourceLabels = {
    blog: t('admin.audit.resourceBlog'),
    case_study: t('admin.audit.resourceCase'),
    contact: t('admin.audit.resourceContact'),
    admin: t('admin.audit.resourceAdmin'),
  };

  return (
    <>
      <header className="admin-header">
        <h1>{t('admin.audit.title')}</h1>
      </header>
      <div className="admin-body">
        <div className="management-panel">
          <div className="management-header">
            <h2>{t('admin.audit.subtitle')}</h2>
          </div>

          {error && <div className="error-message" role="alert">{error}</div>}

          <div className="toolbar">
            <input
              type="search"
              placeholder={t('admin.audit.searchAdmin')}
              value={filters.admin}
              onChange={(e) => handleFilterChange('admin', e.target.value)}
              aria-label={t('admin.audit.searchAria')}
            />
            <select
              value={filters.resource}
              onChange={(e) => handleFilterChange('resource', e.target.value)}
              aria-label={t('admin.audit.filterResource')}
            >
              <option value="">{t('admin.audit.allResources')}</option>
              <option value="blog">{t('admin.audit.resourceBlog')}</option>
              <option value="case_study">{t('admin.audit.resourceCase')}</option>
              <option value="contact">{t('admin.audit.resourceContact')}</option>
              <option value="admin">{t('admin.audit.resourceAdmin')}</option>
            </select>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              aria-label={t('admin.audit.filterAction')}
            >
              <option value="">{t('admin.audit.allActions')}</option>
              <option value="create">{t('admin.audit.actionCreate')}</option>
              <option value="update">{t('admin.audit.actionUpdate')}</option>
              <option value="delete">{t('admin.audit.actionDelete')}</option>
              <option value="login">{t('admin.audit.actionLogin')}</option>
              <option value="logout">{t('admin.audit.actionLogout')}</option>
            </select>
          </div>

          <div className="management-list">
            {isLoading ? (
              <p>{t('admin.audit.loading')}</p>
            ) : logs.length === 0 ? (
              <p className="no-items">{t('admin.audit.noItems')}</p>
            ) : (
              <table className="management-table audit-table">
                <thead>
                  <tr>
                    <th>{t('admin.audit.col.date')}</th>
                    <th>{t('admin.audit.col.admin')}</th>
                    <th>{t('admin.audit.col.action')}</th>
                    <th>{t('admin.audit.col.resource')}</th>
                    <th>{t('admin.audit.col.resourceId')}</th>
                    <th>{t('admin.audit.col.ip')}</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="audit-date">{formatDate(log.createdAt)}</td>
                      <td>{log.adminEmail}</td>
                      <td>
                        <span className={`badge badge-action badge-${log.action}`}>
                          {actionLabels[log.action] || log.action}
                        </span>
                      </td>
                      <td>{resourceLabels[log.resource] || log.resource}</td>
                      <td>{log.resourceId || '—'}</td>
                      <td className="audit-ip">{log.ip || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {pageCount > 1 && (
            <nav className="pagination" aria-label={t('admin.pagination.label')}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                {t('common.previous')}
              </button>
              <span className="pagination-info">
                {t('admin.pagination.info', {
                  from: total === 0 ? 0 : page * limit + 1,
                  to: Math.min(total, (page + 1) * limit),
                  total,
                })}
              </span>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setPage(Math.min(pageCount - 1, page + 1))}
                disabled={page >= pageCount - 1}
              >
                {t('common.next')}
              </button>
            </nav>
          )}
        </div>
      </div>
    </>
  );
}

export default AuditLogPage;

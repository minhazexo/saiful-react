import { useEffect, useRef, useState } from 'react';
import api from '../api';
import { useTranslation } from '../context/LanguageContext';
import { useAdminList, SortHeader, Pagination } from './useAdminList';
import { formatDate } from '../utils/date';
import './ContactsManagement.css';
import './ContactsManagement.responsive.css';

function ContactsManagement() {
  const t = useTranslation();
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({ new: 0, contacted: 0, interested: 0, closed: 0 });

  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const extraParams = filterStatus === 'all' ? {} : { status: filterStatus };

  const {
    rows,
    setRows,
    total,
    setTotal,
    page,
    setPage,
    q,
    setSearch,
    sort,
    order,
    toggleSort,
    isLoading,
    error,
    reload,
    limit,
    pageCount,
  } = useAdminList('/contact', { extraParams });

  void reload;

  const rowsRef = useRef(rows);
  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);

  const loadStats = async () => {
    try {
      const res = await api.get('/contact/stats');
      if (!aliveRef.current) return;
      setStats(res.data || { new: 0, contacted: 0, interested: 0, closed: 0 });
    } catch {
      /* swallow stats error */
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleStatusChange = async (contactId, newStatus) => {
    const prevStatus = rowsRef.current.find((c) => c.id === contactId)?.status;
    if (prevStatus === newStatus) return;
    setRows((prev) => prev.map((c) => (c.id === contactId ? { ...c, status: newStatus } : c)));
    try {
      await api.put(`/contact/${contactId}`, { status: newStatus });
      loadStats();
    } catch (error) {
      setRows((prev) => prev.map((c) => (c.id === contactId ? { ...c, status: prevStatus } : c)));
      const msg = error.response?.data?.error || error.message || 'Unknown error';
      window.alert(t('admin.contacts.errorUpdate', { msg }));
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm(t('admin.contacts.deleteConfirm'))) return;
    const previousRows = rowsRef.current;
    const previousTotal = total;
    setRows((prev) => prev.filter((c) => c.id !== contactId));
    setTotal((t) => Math.max(0, t - 1));
    try {
      await api.delete(`/contact/${contactId}`);
      loadStats();
    } catch (error) {
      setRows(previousRows);
      setTotal(previousTotal);
      const msg = error.response?.data?.error || error.message || 'Unknown error';
      window.alert(t('admin.contacts.errorDelete', { msg }));
    }
  };

  return (
    <>
      <header className="admin-header">
        <h1>{t('admin.contacts.title')}</h1>
      </header>
      <div className="admin-body">
        <div className="management-panel">
          <div className="management-header">
            <h2>{t('admin.contacts.subtitle')}</h2>
            <div className="header-stats">
              <div className="stat">
                <span className="stat-label">{t('admin.contacts.new')}</span>
                <span className="stat-value new">{stats.new}</span>
              </div>
              <div className="stat">
                <span className="stat-label">{t('admin.contacts.contacted')}</span>
                <span className="stat-value contacted">{stats.contacted}</span>
              </div>
              <div className="stat">
                <span className="stat-label">{t('admin.contacts.interested')}</span>
                <span className="stat-value interested">{stats.interested}</span>
              </div>
              <div className="stat">
                <span className="stat-label">{t('admin.contacts.closed')}</span>
                <span className="stat-value closed">{stats.closed}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="toolbar">
            <input
              type="search"
              placeholder={t('admin.contacts.searchPlaceholder')}
              value={q}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={t('admin.contacts.searchAria')}
            />
            <label htmlFor="contact-filter" className="sr-only">
              {t('admin.contacts.filterAria')}
            </label>
            <select
              id="contact-filter"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(0);
              }}
            >
              <option value="all">{t('admin.contacts.filterAll')}</option>
              <option value="new">{t('admin.contacts.filterNew')}</option>
              <option value="contacted">{t('admin.contacts.filterContacted')}</option>
              <option value="interested">{t('admin.contacts.filterInterested')}</option>
              <option value="closed">{t('admin.contacts.filterClosed')}</option>
            </select>
          </div>

          <div className="management-list">
            {isLoading ? (
              <p>{t('admin.contacts.loading')}</p>
            ) : rows.length === 0 ? (
              <p className="no-items">
                {q || filterStatus !== 'all'
                  ? t('admin.contacts.noMatches')
                  : t('admin.contacts.noItems')}
              </p>
            ) : (
              <table className="management-table">
                <thead>
                  <tr>
                    <SortHeader field="name" sort={sort} order={order} onSort={toggleSort}>
                      {t('admin.contacts.col.name')}
                    </SortHeader>
                    <SortHeader field="email" sort={sort} order={order} onSort={toggleSort}>
                      {t('admin.contacts.col.email')}
                    </SortHeader>
                    <th>{t('admin.contacts.col.whatsapp')}</th>
                    <SortHeader field="service" sort={sort} order={order} onSort={toggleSort}>
                      {t('admin.contacts.col.service')}
                    </SortHeader>
                    <SortHeader field="status" sort={sort} order={order} onSort={toggleSort}>
                      {t('admin.contacts.col.status')}
                    </SortHeader>
                    <SortHeader field="createdAt" sort={sort} order={order} onSort={toggleSort}>
                      {t('admin.contacts.col.date')}
                    </SortHeader>
                    <th>{t('admin.contacts.col.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((contact) => (
                    <tr key={contact.id}>
                      <td>{contact.name}</td>
                      <td>
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      </td>
                      <td>
                        <a
                          href={`https://wa.me/${String(contact.whatsapp).replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {contact.whatsapp}
                        </a>
                      </td>
                      <td>{contact.service || '—'}</td>
                      <td>
                        <select
                          className={`status-select status-${contact.status}`}
                          value={contact.status}
                          onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                          aria-label={`${t('admin.contacts.col.status')} ${contact.name}`}
                        >
                          <option value="new">{t('admin.contacts.filterNew')}</option>
                          <option value="contacted">{t('admin.contacts.filterContacted')}</option>
                          <option value="interested">{t('admin.contacts.filterInterested')}</option>
                          <option value="closed">{t('admin.contacts.filterClosed')}</option>
                        </select>
                      </td>
                      <td>{formatDate(contact.createdAt)}</td>
                      <td>
                        <button
                          type="button"
                          className="action-btn delete"
                          onClick={() => handleDelete(contact.id)}
                          aria-label={`${t('common.delete')} ${contact.name}`}
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

          <Pagination
            page={page}
            pageCount={pageCount}
            total={total}
            limit={limit}
            onPage={setPage}
          />
        </div>
      </div>
    </>
  );
}

export default ContactsManagement;

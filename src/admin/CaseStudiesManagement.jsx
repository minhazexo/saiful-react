import { useState } from 'react';
import api from '../api';
import { useTranslation } from '../context/LanguageContext';
import { useAdminList, SortHeader, Pagination } from './useAdminList';
import ImageUploader from './ImageUploader';
import './CaseStudiesManagement.css';

function emptyForm() {
  return {
    title: '',
    slug: '',
    category: '',
    icon: '📊',
    challenge: '',
    solution: '',
    result: '',
    resultHighlight: '',
    headerGradient: 'linear-gradient(135deg,#FFE7CC,#fff)',
    metrics: [],
    images: [],
    featured: true,
  };
}

function CaseStudiesManagement() {
  const t = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm());

  const {
    rows: cases,
    total,
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
  } = useAdminList('/cases', { extraParams: { status: 'all' } });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMetricsChange = (idx, field, value) => {
    setFormData((prev) => {
      const metrics = Array.isArray(prev.metrics) ? [...prev.metrics] : [];
      metrics[idx] = { ...(metrics[idx] || {}), [field]: value };
      return { ...prev, metrics };
    });
  };

  const addMetric = () => {
    setFormData((prev) => ({
      ...prev,
      metrics: [...(prev.metrics || []), { label: '', value: '' }],
    }));
  };

  const removeMetric = (idx) => {
    setFormData((prev) => ({
      ...prev,
      metrics: (prev.metrics || []).filter((_, i) => i !== idx),
    }));
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm());
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setFormData({
      title: c.title || '',
      slug: c.slug || '',
      category: c.category || '',
      icon: c.icon || '📊',
      challenge: c.challenge || '',
      solution: c.solution || '',
      result: c.result || '',
      resultHighlight: c.resultHighlight || '',
      headerGradient: c.headerGradient || 'linear-gradient(135deg,#FFE7CC,#fff)',
      metrics: Array.isArray(c.metrics) ? c.metrics : [],
      images: Array.isArray(c.images) ? c.images : [],
      featured: Boolean(c.featured),
    });
    setShowForm(true);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/cases/${editingId}`, formData);
      } else {
        await api.post('/cases', formData);
      }
      closeForm();
      reload();
    } catch (error) {
      const msg = error.response?.data?.error || error.message || 'Unknown error';
      window.alert(t(editingId ? 'admin.cases.errorUpdate' : 'admin.cases.errorCreate', { msg }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.cases.deleteConfirm'))) return;
    try {
      await api.delete(`/cases/${id}`);
      if (editingId === id) closeForm();
      reload();
    } catch (error) {
      const msg = error.response?.data?.error || error.message || 'Unknown error';
      window.alert(t('admin.cases.errorDelete', { msg }));
    }
  };

  const handleImageUploaded = (idx, url) => {
    setFormData((prev) => {
      const next = Array.from(prev.images || []);
      next[idx] = url;
      return { ...prev, images: next.filter((u) => u !== undefined) };
    });
  };

  const addImageSlot = () => {
    setFormData((prev) => ({ ...prev, images: [...(prev.images || []), ''] }));
  };

  const removeImageSlot = (idx) => {
    setFormData((prev) => {
      const next = Array.from(prev.images || []);
      next.splice(idx, 1);
      return { ...prev, images: next };
    });
  };

  return (
    <>
      <header className="admin-header">
        <h1>{t('admin.cases.title')}</h1>
      </header>
      <div className="admin-body">
        <div className="management-panel">
          <div className="management-header">
            <h2>{editingId ? t('admin.cases.edit') : t('admin.cases.title')}</h2>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => (showForm ? closeForm() : openCreate())}
            >
              {showForm ? (
                <>
                  <span aria-hidden="true">✕</span> {t('admin.cases.cancel')}
                </>
              ) : (
                <>
                  <span aria-hidden="true">+</span> {t('admin.cases.new')}
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {showForm && (
            <form className="management-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="case-title">{t('admin.cases.titleLabel')}</label>
                  <input
                    id="case-title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="case-slug">{t('admin.cases.slugLabel')}</label>
                  <input
                    id="case-slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="case-category">{t('admin.cases.categoryLabel')}</label>
                  <input
                    id="case-category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="case-icon">{t('admin.cases.iconLabel')}</label>
                  <input
                    id="case-icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleFormChange}
                    maxLength={4}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="case-result-hl">{t('admin.cases.resultHighlight')}</label>
                  <input
                    id="case-result-hl"
                    name="resultHighlight"
                    value={formData.resultHighlight}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="case-challenge">{t('admin.cases.challengeLabel')}</label>
                <textarea
                  id="case-challenge"
                  name="challenge"
                  value={formData.challenge}
                  onChange={handleFormChange}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="case-solution">{t('admin.cases.solutionLabel')}</label>
                <textarea
                  id="case-solution"
                  name="solution"
                  value={formData.solution}
                  onChange={handleFormChange}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="case-result">{t('admin.cases.resultLabel')}</label>
                <textarea
                  id="case-result"
                  name="result"
                  value={formData.result}
                  onChange={handleFormChange}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="case-gradient">{t('admin.cases.gradientLabel')}</label>
                <input
                  id="case-gradient"
                  name="headerGradient"
                  value={formData.headerGradient}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label>{t('admin.cases.metricsLabel')}</label>
                {(formData.metrics || []).map((m, idx) => (
                  <div key={idx} className="form-row" style={{ marginBottom: 8 }}>
                    <div className="form-group">
                      <input
                        placeholder={t('admin.cases.metricLabelPlaceholder')}
                        value={m.label || ''}
                        onChange={(e) => handleMetricsChange(idx, 'label', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        placeholder={t('admin.cases.metricValuePlaceholder')}
                        value={m.value || ''}
                        onChange={(e) => handleMetricsChange(idx, 'value', e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => removeMetric(idx)}
                    >
                      {t('admin.cases.removeMetric')}
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline" onClick={addMetric}>
                  {t('admin.cases.addMetric')}
                </button>
              </div>

              <div className="form-group">
                <label>{t('admin.cases.imagesLabel')}</label>
                {(formData.images || []).map((url, idx) => (
                  <div key={idx} className="case-image-row">
                    <ImageUploader
                      id={`case-image-${idx}`}
                      label={`${t('admin.cases.imagesLabel')} ${idx + 1}`}
                      value={url}
                      onChange={(u) => handleImageUploaded(idx, u)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => removeImageSlot(idx)}
                    >
                      {t('admin.cases.removeImage')}
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline" onClick={addImageSlot}>
                  {t('admin.cases.addImage')}
                </button>
              </div>

              <div className="checkbox-group">
                <input
                  id="case-featured"
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleFormChange}
                />
                <label htmlFor="case-featured">{t('admin.cases.featured')}</label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? t('admin.cases.save') : t('admin.cases.create')}
                </button>
                <button type="button" className="btn btn-outline" onClick={closeForm}>
                  {t('admin.cases.cancel')}
                </button>
              </div>
            </form>
          )}

          <div className="toolbar">
            <input
              type="search"
              placeholder={t('admin.cases.searchPlaceholder')}
              value={q}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={t('admin.cases.searchAria')}
            />
          </div>

          <div className="management-list">
            {isLoading ? (
              <p>{t('admin.cases.loading')}</p>
            ) : cases.length === 0 ? (
              <p className="no-items">
                {q ? t('admin.cases.noMatches') : t('admin.cases.noItems')}
              </p>
            ) : (
              <table className="management-table">
                <thead>
                  <tr>
                    <SortHeader field="title" sort={sort} order={order} onSort={toggleSort}>
                      {t('admin.cases.col.title')}
                    </SortHeader>
                    <SortHeader field="category" sort={sort} order={order} onSort={toggleSort}>
                      {t('admin.cases.col.category')}
                    </SortHeader>
                    <SortHeader field="featured" sort={sort} order={order} onSort={toggleSort}>
                      {t('admin.cases.col.status')}
                    </SortHeader>
                    <th>{t('admin.contacts.col.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => (
                    <tr key={c.id}>
                      <td>{c.title}</td>
                      <td>{c.category}</td>
                      <td>
                        <span className={`badge ${c.featured ? 'featured' : 'draft'}`}>
                          {c.featured
                            ? t('admin.cases.statusFeatured')
                            : t('admin.cases.statusStandard')}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="action-btn edit"
                          onClick={() => openEdit(c)}
                          aria-label={`${t('common.edit')} ${c.title}`}
                        >
                          <span aria-hidden="true">✏</span> {t('common.edit')}
                        </button>
                        <button
                          type="button"
                          className="action-btn delete"
                          onClick={() => handleDelete(c.id)}
                          aria-label={`${t('common.delete')} ${c.title}`}
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

export default CaseStudiesManagement;

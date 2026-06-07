import { useState } from 'react';
import api from '../api';
import { useTranslation } from '../context/LanguageContext';
import { useAdminList, SortHeader, Pagination } from './useAdminList';
import ImageUploader from './ImageUploader';
import './BlogManagement.css';

function emptyForm() {
  return {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    image: '',
    readTime: 5,
    featured: false,
    published: false,
  };
}

function BlogManagement() {
  const t = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm());

  const {
    rows: blogs,
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
  } = useAdminList('/blog', { extraParams: { status: 'all' } });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm());
    setShowForm(true);
  };

  const openEdit = (blog) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      category: blog.category || '',
      author: blog.author || '',
      image: blog.image || '',
      readTime: Number(blog.readTime) || 5,
      featured: Boolean(blog.featured),
      published: Boolean(blog.published),
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
        await api.put(`/blog/${editingId}`, formData);
      } else {
        await api.post('/blog', formData);
      }
      closeForm();
      reload();
    } catch (error) {
      const msg = error.response?.data?.error || error.message || 'Unknown error';
      window.alert(t(editingId ? 'admin.blog.errorUpdate' : 'admin.blog.errorCreate', { msg }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.blog.deleteConfirm'))) return;
    try {
      await api.delete(`/blog/${id}`);
      if (editingId === id) closeForm();
      reload();
    } catch (error) {
      const msg = error.response?.data?.error || error.message || 'Unknown error';
      window.alert(t('admin.blog.errorDelete', { msg }));
    }
  };

  return (
    <>
      <header className="admin-header">
        <h1>{t('admin.blog.title')}</h1>
      </header>
      <div className="admin-body">
        <div className="management-panel">
          <div className="management-header">
            <h2>{editingId ? t('admin.blog.edit') : t('admin.blog.title')}</h2>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => (showForm ? closeForm() : openCreate())}
            >
              {showForm ? (
                <>
                  <span aria-hidden="true">✕</span> {t('admin.blog.cancel')}
                </>
              ) : (
                <>
                  <span aria-hidden="true">+</span> {t('admin.blog.new')}
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
                  <label htmlFor="title">{t('admin.blog.titleLabel')}</label>
                  <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="slug">{t('admin.blog.slugLabel')}</label>
                  <input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="excerpt">{t('admin.blog.excerptLabel')}</label>
                <input
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">{t('admin.blog.contentLabel')}</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  rows={8}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">{t('admin.blog.categoryLabel')}</label>
                  <input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="author">{t('admin.blog.authorLabel')}</label>
                  <input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="readTime">{t('admin.blog.readTimeLabel')}</label>
                  <input
                    id="readTime"
                    type="number"
                    min="0"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <ImageUploader
                  id="image"
                  label={t('admin.blog.imageLabel')}
                  value={formData.image}
                  onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                />
              </div>

              <div className="form-row">
                <div className="checkbox-group">
                  <input
                    id="featured"
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleFormChange}
                  />
                  <label htmlFor="featured">{t('admin.blog.featured')}</label>
                </div>
                <div className="checkbox-group">
                  <input
                    id="published"
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleFormChange}
                  />
                  <label htmlFor="published">{t('admin.blog.published')}</label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? t('admin.blog.save') : t('admin.blog.create')}
                </button>
                <button type="button" className="btn btn-outline" onClick={closeForm}>
                  {t('admin.blog.cancel')}
                </button>
              </div>
            </form>
          )}

          <div className="toolbar">
            <input
              type="search"
              placeholder={t('admin.blog.searchPlaceholder')}
              value={q}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={t('admin.blog.searchAria')}
            />
          </div>

          <div className="management-list">
            {isLoading ? (
              <p>{t('admin.blog.loading')}</p>
            ) : blogs.length === 0 ? (
              <p className="no-items">{q ? t('admin.blog.noMatches') : t('admin.blog.noPosts')}</p>
            ) : (
              <table className="management-table">
                <thead>
                  <tr>
                    <SortHeader field="title" sort={sort} order={order} onSort={toggleSort}>
                      {t('admin.blog.col.title')}
                    </SortHeader>
                    <SortHeader field="category" sort={sort} order={order} onSort={toggleSort}>
                      {t('admin.blog.col.category')}
                    </SortHeader>
                    <SortHeader field="author" sort={sort} order={order} onSort={toggleSort}>
                      {t('admin.blog.col.author')}
                    </SortHeader>
                    <SortHeader field="published" sort={sort} order={order} onSort={toggleSort}>
                      {t('admin.blog.col.status')}
                    </SortHeader>
                    <th>{t('admin.contacts.col.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id}>
                      <td>{blog.title}</td>
                      <td>{blog.category}</td>
                      <td>{blog.author}</td>
                      <td>
                        <span className={`badge ${blog.published ? 'published' : 'draft'}`}>
                          {blog.published
                            ? t('admin.blog.statusPublished')
                            : t('admin.blog.statusDraft')}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="action-btn edit"
                          onClick={() => openEdit(blog)}
                          aria-label={`${t('common.edit')} ${blog.title}`}
                        >
                          <span aria-hidden="true">✏</span> {t('common.edit')}
                        </button>
                        <button
                          type="button"
                          className="action-btn delete"
                          onClick={() => handleDelete(blog.id)}
                          aria-label={`${t('common.delete')} ${blog.title}`}
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

export default BlogManagement;

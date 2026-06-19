import { useRef, useState } from 'react';
import api from '../api';
import { useTranslation } from '../context/LanguageContext';

export function resolveImageUrl(value) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/uploads/')) return value;
  return value;
}

export default function ImageUploader({ value, onChange, label, id = 'image-upload' }) {
  const t = useTranslation();
  const resolvedLabel = label || t('admin.imageUploader.upload');
  const fileRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    if (file.size > 5 * 1024 * 1024) {
      setError(t('admin.imageUploader.tooLarge'));
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    setIsUploading(true);
    const form = new FormData();
    form.append('image', file);
    try {
      const res = await api.post('/upload', form);
      if (!res.data?.url) {
        throw new Error(t('admin.imageUploader.noUrl'));
      }
      onChange(res.data.url);
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.error;
      let msg = serverMsg || err.message || t('admin.imageUploader.upload');
      if (status === 401) msg = t('admin.imageUploader.unauthorized');
      else if (status === 403) msg = t('admin.imageUploader.forbidden');
      else if (status === 413) msg = t('admin.imageUploader.tooLarge');
      console.error('[ImageUploader] upload failed', { status, serverMsg, err });
      setError(msg);
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const previewSrc = value ? resolveImageUrl(value) : '';

  return (
    <div className="image-uploader">
      <label htmlFor={id}>{resolvedLabel}</label>
      <div className="image-uploader-row">
        <input
          id={id}
          type="text"
          placeholder={t('admin.imageUploader.placeholder')}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          ref={fileRef}
          id={`${id}-file`}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="sr-only"
        />
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? t('admin.imageUploader.uploading') : t('admin.imageUploader.upload')}
        </button>
        {value && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => onChange('')}
            disabled={isUploading}
          >
            {t('admin.imageUploader.clear')}
          </button>
        )}
      </div>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      {previewSrc && (
        <div className="image-uploader-preview">
          <img src={previewSrc} alt={t('admin.imageUploader.preview')} loading="lazy" />
        </div>
      )}
    </div>
  );
}

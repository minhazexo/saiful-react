import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../api';
import { useTranslation } from '../context/LanguageContext';

const DEFAULT_LIMIT = 20;

export function useAdminList(
  path,
  { extraParams = {}, defaultSort = 'createdAt', defaultOrder = 'DESC', limit = DEFAULT_LIMIT } = {}
) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState(defaultSort);
  const [order, setOrder] = useState(defaultOrder);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const extraParamsRef = useRef(extraParams);
  useEffect(() => {
    extraParamsRef.current = extraParams;
  }, [extraParams]);

  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const t = useTranslation();

  const reload = useCallback(
    async (overrides = {}) => {
      const params = {
        ...extraParamsRef.current,
        limit,
        offset: (overrides.page ?? page) * limit,
        sort: overrides.sort ?? sort,
        order: overrides.order ?? order,
      };
      const qVal = overrides.q ?? q;
      if (qVal) params.q = qVal;
      try {
        setIsLoading(true);
        const res = await api.get(path, { params });
        if (!aliveRef.current) return;
        const data = res.data;
        if (Array.isArray(data)) {
          setRows(data);
          setTotal(data.length);
        } else if (data && Array.isArray(data.rows)) {
          setRows(data.rows);
          setTotal(Number(data.total) || data.rows.length);
        } else {
          setRows([]);
          setTotal(0);
        }
        setError('');
      } catch (err) {
        if (!aliveRef.current) return;
        setError(err.response?.data?.error || t('admin.contacts.errorLoad'));
      } finally {
        if (aliveRef.current) setIsLoading(false);
      }
    },
    [path, limit, page, q, sort, order, t]
  );

  useEffect(() => {
    reload();
  }, [reload]);

  const toggleSort = useCallback(
    (field) => {
      if (sort === field) {
        setOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'));
      } else {
        setSort(field);
        setOrder('ASC');
      }
      setPage(0);
    },
    [sort]
  );

  const setSearch = useCallback((value) => {
    setQ(value);
    setPage(0);
  }, []);

  return {
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
    pageCount: limit > 0 ? Math.ceil(total / limit) : 1,
  };
}

export function SortHeader({ field, sort, order, onSort, children }) {
  const active = sort === field;
  return (
    <th>
      <button
        type="button"
        className="sort-header"
        onClick={() => onSort(field)}
        aria-sort={active ? (order === 'ASC' ? 'ascending' : 'descending') : 'none'}
      >
        {children}
        <span className="sort-indicator" aria-hidden="true">
          {active ? (order === 'ASC' ? ' ↑' : ' ↓') : ''}
        </span>
      </button>
    </th>
  );
}

export function Pagination({ page, pageCount, total, limit, onPage }) {
  const t = useTranslation();
  if (pageCount <= 1) return null;
  const from = total === 0 ? 0 : page * limit + 1;
  const to = Math.min(total, (page + 1) * limit);
  return (
    <nav className="pagination" aria-label={t('admin.pagination.label')}>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => onPage(Math.max(0, page - 1))}
        disabled={page === 0}
      >
        {t('common.previous')}
      </button>
      <span className="pagination-info">{t('admin.pagination.info', { from, to, total })}</span>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => onPage(Math.min(pageCount - 1, page + 1))}
        disabled={page >= pageCount - 1}
      >
        {t('common.next')}
      </button>
    </nav>
  );
}

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import api, { setUnauthorizedHandler, ensureCsrf } from './api';

const AuthContext = createContext(null);

const STORAGE_USER = 'adminUser';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [bootstrapping, setBootstrapping] = useState(true);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore — best-effort */
    }
    localStorage.removeItem(STORAGE_USER);
    setUser(null);
  }, []);

  // Bootstrap: ask /me if the cookie is still valid
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureCsrf();
        const res = await api.get('/auth/me');
        if (!cancelled) {
          setUser(res.data.admin);
          localStorage.setItem(STORAGE_USER, JSON.stringify(res.data.admin));
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem(STORAGE_USER);
          setUser(null);
        }
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      localStorage.removeItem(STORAGE_USER);
      setUser(null);
    });
  }, []);

  const login = useCallback(async (email, password) => {
    // Prime the CSRF cookie before login (login is exempt from CSRF, but
    // subsequent state-changing requests will need a valid token).
    await ensureCsrf();
    const res = await api.post('/auth/login', { email, password });
    const admin = res.data.admin;
    localStorage.setItem(STORAGE_USER, JSON.stringify(admin));
    setUser(admin);
    return admin;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      bootstrapping,
      login,
      logout,
    }),
    [user, bootstrapping, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

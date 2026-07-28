'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const themes = [
  { id: 'blue', name: 'Aurora Blue' },
  { id: 'green', name: 'Aurora Green' },
  { id: 'orange', name: 'Aurora Orange' },
  { id: 'purple', name: 'Aurora Purple' },
  { id: 'cyan', name: 'Aurora Cyan' },
  { id: 'pink', name: 'Aurora Pink' },
  { id: 'amber', name: 'Aurora Amber' },
  { id: 'silver', name: 'Aurora Silver' },
] 

const ThemeContext = createContext({
  theme: 'blue',
  setTheme: () => {},
  themes,
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children, defaultTheme = 'blue', storageKey = 'aurora-theme' }) {
  const [theme, setThemeState] = useState(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(storageKey)
    if (stored && themes.some((t) => t.id === stored)) {
      setThemeState(stored)
    }
  }, [storageKey])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(storageKey, theme)
  }, [theme, mounted, storageKey])

  const setTheme = useCallback((newTheme) => {
    if (themes.some((t) => t.id === newTheme)) {
      setThemeState(newTheme)
    }
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

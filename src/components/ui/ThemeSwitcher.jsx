'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../providers/ThemeProvider'
import { useState, useRef, useEffect } from 'react'

const themeColors = {
  blue: '#00D5FF',
  green: '#00FFA3',
  orange: '#FF7A00',
  purple: '#A855F7',
  cyan: '#22D3EE',
  pink: '#FF4CC7',
  amber: '#FFD700',
  silver: '#FFFFFF',
}

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button
        onClick={() => setOpen(!open)}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid var(--border)',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Switch theme"
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: themeColors[theme] || 'var(--primary)',
            boxShadow: `0 0 8px ${themeColors[theme]}40`,
            transition: 'background 0.3s ease',
          }}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: 'var(--glass-strong)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: 8,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 4,
              zIndex: 100,
              minWidth: 176,
            }}
          >
            {themes.map((t) => (
              <motion.button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false) }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: theme === t.id ? '2px solid var(--text)' : '2px solid transparent',
                  background: themeColors[t.id],
                  cursor: 'pointer',
                  boxShadow: theme === t.id ? `0 0 12px ${themeColors[t.id]}60` : 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                title={t.name}
                aria-label={`Switch to ${t.name}`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

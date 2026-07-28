'use client'

import { motion } from 'framer-motion'

export function GlassCard({ children, className = '', style, hoverLift = true, ...props }) {
  return (
    <motion.div
      className={className}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        transition: 'transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease',
        ...style,
      }}
      whileHover={hoverLift ? { y: -4, boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 20px var(--glow-color)', borderColor: 'var(--primary)' } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}

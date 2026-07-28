'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

export function FloatingParticles({ count = 100 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 20 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.05 + Math.random() * 0.15,
      xMove: (Math.random() - 0.5) * 40,
      yMove: (Math.random() - 0.5) * 40,
    }))
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            opacity: p.opacity,
          }}
          animate={{
            x: [0, p.xMove / 2, p.xMove, p.xMove / 2, 0],
            y: [0, p.yMove / 2, p.yMove, p.yMove / 2, 0],
            opacity: [p.opacity, p.opacity * 0.4, p.opacity, p.opacity * 0.6, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

'use client'

import { useRef, useMemo, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const HEX_SIZE = 60
const HEX_W = HEX_SIZE * Math.sqrt(3)
const HEX_H = HEX_SIZE * 2
const PATTERN_W = HEX_W * 2
const PATTERN_H = HEX_H * 3

function hexPath(cx, cy, size) {
  const pts = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6
    pts.push(`${cx + size * Math.cos(a)},${cy + size * Math.sin(a)}`)
  }
  return `M${pts.join('L')}Z`
}

const cx1 = HEX_W / 2
const cy1 = HEX_H / 2
const cx2 = HEX_W * 1.5
const cy2 = HEX_H / 2
const cx3 = HEX_W / 2
const cy3 = HEX_H * 1.5 + HEX_H / 2
const cx4 = HEX_W * 1.5
const cy4 = HEX_H * 1.5 + HEX_H / 2

const SVG_PATTERN = (
  <g>
    <path d={hexPath(cx1, cy1, HEX_SIZE * 0.46)} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
    <path d={hexPath(cx2, cy2, HEX_SIZE * 0.46)} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
    <path d={hexPath(cx3, cy3, HEX_SIZE * 0.46)} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
    <path d={hexPath(cx4, cy4, HEX_SIZE * 0.46)} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
  </g>
)

function HexLayer({ opacity, animationDuration, delay, parallaxFactor }) {
  const maskId = useMemo(() => `hexFade-${opacity.toString().replace('.', '')}`, [opacity])

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        opacity,
        willChange: 'transform',
        maskImage: `url(#${maskId})`,
        WebkitMaskImage: `url(#${maskId})`,
      }}
      animate={{
        y: [0, -HEX_H * 2, 0],
      }}
      transition={{
        duration: animationDuration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 4px var(--pattern-color))' }}
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={`hexGrid-${opacity}`}
            x="0"
            y="0"
            width={PATTERN_W}
            height={PATTERN_H}
            patternUnits="userSpaceOnUse"
          >
            {SVG_PATTERN}
          </pattern>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill={`url(#hexFadeGradient)`} />
          </mask>
          <linearGradient id="hexFadeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="15%" stopColor="white" />
            <stop offset="85%" stopColor="white" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#hexGrid-${opacity})`}
          stroke="var(--pattern-color)"
        />
      </svg>
    </motion.div>
  )
}

export function HexagonGrid() {
  const containerRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  const parallaxX = useTransform(springX, [-0.5, 0.5], [-10, 10])
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-10, 10])

  const handleMouse = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const layers = useMemo(() => [
    { opacity: 0.10, duration: 180, delay: 0, factor: 0.5 },
    { opacity: 0.05, duration: 240, delay: -60, factor: 0.3 },
    { opacity: 0.03, duration: 300, delay: -120, factor: 0.15 },
  ], [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      onMouseMove={handleMouse}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          x: parallaxX,
          y: parallaxY,
        }}
      >
        {layers.map((layer) => (
          <HexLayer
            key={layer.opacity}
            opacity={layer.opacity}
            animationDuration={layer.duration}
            delay={layer.delay}
            parallaxFactor={layer.factor}
          />
        ))}
      </motion.div>
    </div>
  )
}

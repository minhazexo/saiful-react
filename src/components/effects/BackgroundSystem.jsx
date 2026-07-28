'use client'

import { useMemo } from 'react'
import { FloatingParticles } from './FloatingParticles'
import { NoiseOverlay } from './NoiseOverlay'
import { HexagonGrid } from './HexagonGrid'

function AuroraBlobs() {
  const blobs = useMemo(() => {
    const colors = ['var(--aurora-1)', 'var(--aurora-2)', 'var(--aurora-3)', 'var(--aurora-1)', 'var(--aurora-2)']
    const sizes = [700, 600, 800, 500, 650]
    const positions = [
      { top: '5%', left: '10%' },
      { top: '30%', left: '60%' },
      { top: '55%', left: '20%' },
      { top: '70%', left: '55%' },
      { top: '15%', left: '45%' },
    ]
    const opacities = [0.18, 0.15, 0.22, 0.12, 0.18]
    const durations = [25, 30, 40, 35, 50]
    const delays = [0, 5, 10, 3, 8]
    const blurAmounts = [250, 300, 400, 300, 250]

    return colors.map((color, i) => ({
      color,
      size: sizes[i],
      position: positions[i],
      opacity: opacities[i],
      duration: durations[i],
      delay: delays[i],
      blur: blurAmounts[i],
    }))
  }, [])

  return (
    <>
      {blobs.map((blob, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: blob.position.top,
            left: blob.position.left,
            width: blob.size,
            height: blob.size,
            borderRadius: '50%',
            background: `radial-gradient(circle at center, ${blob.color} 0%, transparent 70%)`,
            filter: `blur(${blob.blur}px)`,
            opacity: blob.opacity,
            animation: `aurora-drift-${(i % 3) + 1} ${blob.duration}s ease-in-out ${blob.delay}s infinite`,
            willChange: 'transform',
          }}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

function AuroraWave() {
  return (
    <div className="fixed inset-0 pointer-events-none z-background overflow-hidden" aria-hidden="true">
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '-10%',
          width: '120%',
          height: '500px',
          background: 'linear-gradient(90deg, transparent 0%, var(--aurora-1) 20%, var(--aurora-2) 50%, var(--aurora-3) 80%, transparent 100%)',
          filter: 'blur(70px)',
          opacity: 0.2,
          animation: 'aurora-ribbon 25s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
    </div>
  )
}

function LightBeams() {
  const beams = useMemo(() => {
    return Array.from({ length: 65 }, (_, i) => ({
      width: 2 + Math.random() * 6,
      height: 40 + Math.random() * 40,
      left: Math.random() * 100,
      opacity: 0.03 + Math.random() * 0.09,
      duration: 6 + Math.random() * 4,
      delay: Math.random() * 8,
      blur: 1 + Math.random() * 2,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-background overflow-hidden" aria-hidden="true">
      {beams.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: `${b.left}%`,
            width: `${b.width}px`,
            height: `${b.height}%`,
            background: `linear-gradient(180deg, transparent 0%, var(--beam-color, var(--primary)) 40%, var(--aurora-2) 60%, transparent 100%)`,
            opacity: b.opacity,
            filter: `blur(${b.blur}px)`,
            animation: `beam-pulse ${b.duration}s ease-in-out ${b.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  )
}

function ColorWaves() {
  return (
    <div className="fixed inset-0 pointer-events-none z-background" aria-hidden="true">
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '-20%',
          width: '1200px',
          height: '600px',
          opacity: 0.08,
          background: 'linear-gradient(90deg, var(--aurora-1) 0%, transparent 50%, var(--aurora-2) 100%)',
          filter: 'blur(260px)',
          animation: 'aurora-drift-1 40s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '-20%',
          width: '1200px',
          height: '600px',
          opacity: 0.06,
          background: 'linear-gradient(270deg, var(--aurora-2) 0%, transparent 50%, var(--aurora-3) 100%)',
          filter: 'blur(260px)',
          animation: 'aurora-drift-2 35s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '10%',
          width: '1000px',
          height: '500px',
          opacity: 0.05,
          background: 'linear-gradient(180deg, var(--aurora-1) 0%, transparent 50%, var(--aurora-3) 100%)',
          filter: 'blur(260px)',
          animation: 'aurora-drift-3 45s ease-in-out infinite',
        }}
      />
    </div>
  )
}

function GradientMesh() {
  return (
    <div className="fixed inset-0 pointer-events-none z-background" aria-hidden="true">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.06,
          background: `
            radial-gradient(ellipse at 20% 50%, var(--aurora-1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, var(--aurora-2) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, var(--aurora-3) 0%, transparent 50%)
          `,
          filter: 'blur(300px)',
          animation: 'aurora-drift-1 40s ease-in-out infinite',
        }}
      />
    </div>
  )
}

function GlowClouds() {
  const clouds = [
    { top: '15%', left: '10%', w: 500, h: 300, opacity: 0.06, anim: 'aurora-drift-2', dur: 50 },
    { top: '50%', right: '15%', w: 400, h: 250, opacity: 0.05, anim: 'aurora-drift-3', dur: 55 },
    { bottom: '20%', left: '30%', w: 600, h: 350, opacity: 0.04, anim: 'aurora-drift-1', dur: 45 },
    { top: '60%', left: '5%', w: 450, h: 280, opacity: 0.04, anim: 'aurora-drift-1', dur: 48 },
    { top: '25%', right: '20%', w: 550, h: 320, opacity: 0.05, anim: 'aurora-drift-2', dur: 52 },
    { bottom: '35%', left: '40%', w: 380, h: 220, opacity: 0.03, anim: 'aurora-drift-3', dur: 58 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-background" aria-hidden="true">
      {clouds.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: c.top,
            left: c.left,
            right: c.right,
            bottom: c.bottom,
            width: c.w,
            height: c.h,
            opacity: c.opacity,
            background: `radial-gradient(ellipse, var(--aurora-${(i % 3) + 1}) 0%, transparent 70%)`,
            filter: 'blur(180px)',
            animation: `${c.anim} ${c.dur}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

function BloomFog() {
  return (
    <div className="fixed inset-0 pointer-events-none z-background" aria-hidden="true">
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1200px',
          height: '1200px',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, transparent 70%)',
          filter: 'blur(300px)',
        }}
      />
    </div>
  )
}

function Vignette() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }} aria-hidden="true">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.4,
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(5,8,22,0.9) 100%)',
        }}
      />
    </div>
  )
}

export function BackgroundSystem() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      {/* Layer 01: Base gradient overlay */}
      <div className="fixed inset-0 z-background" style={{ background: 'linear-gradient(180deg, #050816 0%, #060B1A 40%, #050816 100%)' }} />

      {/* Layer 02: Aurora Foundation */}
      <div className="fixed inset-0 z-background">
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '1600px',
            height: '1600px',
            opacity: 0.2,
            background: 'radial-gradient(circle at center, var(--glow-color) 0%, transparent 70%)',
            filter: 'blur(180px)',
          }}
        />
      </div>

      {/* Layer 03: Aurora Blobs */}
      <AuroraBlobs />

      {/* Layer 04: Aurora Ribbon Wave */}
      <AuroraWave />

      {/* Layer 05: Color Waves */}
      <ColorWaves />

      {/* Layer 06: Gradient Mesh */}
      <GradientMesh />

      {/* Layer 07: Vertical Light Beams */}
      <LightBeams />

      {/* Layer 08: Hexagon Grid */}
      <HexagonGrid />

      {/* Layer 09: Glow Clouds */}
      <GlowClouds />

      {/* Layer 10: Bloom Fog */}
      <BloomFog />

      {/* Layer 11: Floating Particles */}
      <FloatingParticles count={100} />

      {/* Layer 12: Vignette */}
      <Vignette />

      {/* Layer 13: Noise Texture */}
      <NoiseOverlay />
    </div>
  )
}

import React from 'react'

interface HeartParticle {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
}

// Static deterministic particle data to ensure pure rendering
const HEARTS_CONFIG: HeartParticle[] = [
  { id: 1, left: 5, size: 16, duration: 12, delay: 0, opacity: 0.25 },
  { id: 2, left: 12, size: 24, duration: 15, delay: 2, opacity: 0.35 },
  { id: 3, left: 20, size: 14, duration: 10, delay: 4, opacity: 0.2 },
  { id: 4, left: 28, size: 20, duration: 14, delay: 1, opacity: 0.4 },
  { id: 5, left: 35, size: 18, duration: 11, delay: 3, opacity: 0.28 },
  { id: 6, left: 42, size: 26, duration: 16, delay: 0.5, opacity: 0.45 },
  { id: 7, left: 50, size: 15, duration: 9, delay: 2.5, opacity: 0.22 },
  { id: 8, left: 58, size: 22, duration: 13, delay: 4.5, opacity: 0.38 },
  { id: 9, left: 65, size: 17, duration: 11.5, delay: 1.5, opacity: 0.3 },
  { id: 10, left: 72, size: 25, duration: 14.5, delay: 3.5, opacity: 0.42 },
  { id: 11, left: 80, size: 13, duration: 10.5, delay: 0.8, opacity: 0.2 },
  { id: 12, left: 88, size: 23, duration: 15.5, delay: 2.8, opacity: 0.36 },
  { id: 13, left: 95, size: 19, duration: 12.5, delay: 4.2, opacity: 0.26 },
]

export const FloatingHearts: React.FC = () => {
  return (
    <div className="floating-hearts-layer" aria-hidden="true">
      {HEARTS_CONFIG.map((h) => (
        <span
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
          }}
        >
          <i className="fas fa-heart"></i>
        </span>
      ))}
    </div>
  )
}

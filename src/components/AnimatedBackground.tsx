import { memo } from 'react'
import styles from '../styles/AnimatedBackground.module.css'

export const AnimatedBackground = memo(function AnimatedBackground() {
  return (
    <div className={styles.background} aria-hidden="true">
      {/* Optimized: Reduced to 3 gradient orbs for better performance */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      {/* Noise texture overlay */}
      <div className={styles.noise} />
    </div>
  )
})

import styles from '../styles/AnimatedBackground.module.css'

export function AnimatedBackground() {
  return (
    <div className={styles.background} aria-hidden="true">
      {/* Multiple gradient orbs for ambient lighting effect */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />
      <div className={styles.orb4} />

      {/* Noise texture overlay */}
      <div className={styles.noise} />
    </div>
  )
}

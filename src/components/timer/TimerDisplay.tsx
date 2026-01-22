import styles from '../../styles/timer/TimerDisplay.module.css'

interface TimerDisplayProps {
  remainingTime: number // in milliseconds
  isActive: boolean
  isPaused: boolean
  mode: 'pomodoro' | 'free' | 'custom'
}

export function TimerDisplay({
  remainingTime,
  isActive,
  isPaused,
  mode,
}: TimerDisplayProps) {
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getProgress = (): number => {
    if (!isActive) return 0
    // Assume 25 min default for progress calculation
    const totalTime = 25 * 60 * 1000
    return ((totalTime - remainingTime) / totalTime) * 100
  }

  const progress = getProgress()

  return (
    <div className={styles.display}>
      {isActive && (
        <>
          <div className={styles.time} aria-live="polite" aria-atomic="true">
            {formatTime(remainingTime)}
          </div>
          <div className={styles.status}>
            {isPaused && <span className={styles.paused}>PAUSED</span>}
            {!isPaused && mode === 'pomodoro' && <span className={styles.mode}>Pomodoro</span>}
            {!isPaused && mode === 'free' && <span className={styles.mode}>Free Timer</span>}
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Timer progress"
            />
          </div>
        </>
      )}
      {!isActive && (
        <div className={styles.placeholder}>
          <span className={styles.placeholderText}>No active timer</span>
        </div>
      )}
    </div>
  )
}

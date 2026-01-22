import styles from '../../styles/timer/TimerControls.module.css'

interface TimerControlsProps {
  isActive: boolean
  isPaused: boolean
  onPause: () => void
  onResume: () => void
  onStop: () => void
}

export function TimerControls({
  isActive,
  isPaused,
  onPause,
  onResume,
  onStop,
}: TimerControlsProps) {
  return (
    <div className={styles.controls}>
      {isActive && (
        <>
          {isPaused ? (
            <button
              type="button"
              className={`${styles.button} ${styles.resumeButton}`}
              onClick={onResume}
              aria-label="Resume timer"
            >
              ▶ Resume
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.button} ${styles.pauseButton}`}
              onClick={onPause}
              aria-label="Pause timer"
            >
              ⏸ Pause
            </button>
          )}
          <button
            type="button"
            className={`${styles.button} ${styles.stopButton}`}
            onClick={onStop}
            aria-label="Stop timer"
          >
            ⏹ Stop
          </button>
        </>
      )}
    </div>
  )
}

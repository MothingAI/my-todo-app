import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import styles from '../../styles/timer/PomodoroSettings.module.css'

interface PomodoroSettingsProps {
  onStart: (workMinutes: number, breakMinutes: number) => void
}

export function PomodoroSettings({ onStart }: PomodoroSettingsProps) {
  const { t } = useLanguage()
  const [workMinutes, setWorkMinutes] = useState(25)
  const [breakMinutes, setBreakMinutes] = useState(5)

  const handleStart = () => {
    onStart(workMinutes, breakMinutes)
  }

  return (
    <div className={styles.settings}>
      <h3 className={styles.title}>{t('timerCustomSettings')}</h3>

      <div className={styles.fieldGroup}>
        <label htmlFor="work-time" className={styles.label}>
          {t('timerWorkTime')}
        </label>
        <input
          id="work-time"
          type="number"
          className={styles.input}
          value={workMinutes}
          onChange={(e) => setWorkMinutes(Math.max(1, parseInt(e.target.value) || 1))}
          min="1"
          max="120"
          aria-label="Work duration in minutes"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="break-time" className={styles.label}>
          {t('timerBreakTime')}
        </label>
        <input
          id="break-time"
          type="number"
          className={styles.input}
          value={breakMinutes}
          onChange={(e) => setBreakMinutes(Math.max(1, parseInt(e.target.value) || 1))}
          min="1"
          max="30"
          aria-label="Break duration in minutes"
        />
      </div>

      <button
        type="button"
        className={styles.startButton}
        onClick={handleStart}
        aria-label="Start pomodoro timer"
      >
        {t('timerStartCustom')}
      </button>

      <p className={styles.hint}>
        {t('timerDefaultHint')}
      </p>
    </div>
  )
}

import { useState } from 'react'
import { useTimer } from '../../hooks/useTimer'
import { useTodos } from '../../hooks/useTodos'
import { useLanguage } from '../../contexts/LanguageContext'
import { TimerDisplay } from './TimerDisplay'
import { TimerControls } from './TimerControls'
import { PomodoroSettings } from './PomodoroSettings'
import styles from '../../styles/timer/TimerPanel.module.css'

export function TimerPanel() {
  const { t } = useLanguage()
  const [selectedTodoId, setSelectedTodoId] = useState<string | undefined>()
  const { activeTodos } = useTodos()

  const timer = useTimer(selectedTodoId)

  const handleStartPomodoro = (workMinutes: number, _breakMinutes: number) => {
    timer.startPomodoro(workMinutes)
  }

  const handleStartFreeTimer = () => {
    timer.startFreeTimer()
  }

  // Auto-select first active todo if none selected
  const activeTodo = selectedTodoId
    ? activeTodos.find((t) => t.id === selectedTodoId)
    : activeTodos[0]

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>{t('timerTitle')}</h2>

      {/* Todo Selection */}
      {activeTodos.length > 0 && (
        <div className={styles.todoSelector}>
          <label htmlFor="todo-select" className={styles.label}>
            {t('timerSelectTodo')}
          </label>
          <select
            id="todo-select"
            className={styles.select}
            value={selectedTodoId || ''}
            onChange={(e) => setSelectedTodoId(e.target.value || undefined)}
            aria-label="Select todo for timer"
          >
            <option value="">{t('timerSelectPlaceholder')}</option>
            {activeTodos.map((todo) => (
              <option key={todo.id} value={todo.id}>
                {todo.description}
              </option>
            ))}
          </select>
        </div>
      )}

      {activeTodos.length === 0 && (
        <p className={styles.emptyState}>
          {t('timerEmpty')}
        </p>
      )}

      {/* Timer Display */}
      {activeTodo && (
        <TimerDisplay
          remainingTime={timer.remainingTime}
          isActive={timer.isActive}
          isPaused={timer.isPaused}
          mode={timer.mode}
        />
      )}

      {/* Timer Controls */}
      {activeTodo && (
        <TimerControls
          isActive={timer.isActive}
          isPaused={timer.isPaused}
          onPause={timer.pauseTimer}
          onResume={timer.resumeTimer}
          onStop={timer.stopTimer}
        />
      )}

      {/* Start Buttons (when no active timer) */}
      {activeTodo && !timer.isActive && (
        <div className={styles.startButtons}>
          <button
            type="button"
            className={`${styles.button} ${styles.pomodoroButton}`}
            onClick={() => timer.startPomodoro()}
            aria-label="Start pomodoro timer"
          >
            {t('timerStartPomodoro')}
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.freeButton}`}
            onClick={handleStartFreeTimer}
            aria-label="Start free timer"
          >
            {t('timerStartFree')}
          </button>
        </div>
      )}

      {/* Pomodoro Settings */}
      {!timer.isActive && (
        <div className={styles.settingsSection}>
          <details className={styles.details}>
            <summary className={styles.summary}>{t('timerCustomSettings')}</summary>
            <PomodoroSettings onStart={handleStartPomodoro} />
          </details>
        </div>
      )}
    </div>
  )
}

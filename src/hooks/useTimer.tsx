import { useCallback, useEffect, useRef, useState } from 'react'
import { useTodos } from './useTodos'

export function useTimer(todoId?: string) {
  const { timer, dispatch } = useTodos()
  const intervalRef = useRef<number | null>(null)
  const [remainingTime, setRemainingTime] = useState(0)

  const { activeSession, isPaused, pausedTime, mode } = timer

  // Calculate remaining time
  const calculateRemainingTime = useCallback((): number => {
    if (!activeSession) return 0

    if (isPaused) {
      return activeSession.duration - pausedTime
    }

    const elapsed = Date.now() - activeSession.startTime
    return Math.max(0, activeSession.duration - elapsed)
  }, [activeSession, isPaused, pausedTime])

  // Start pomodoro timer
  const startPomodoro = useCallback(
    (workMinutes = 25) => {
      if (!todoId) {
        console.warn('No todo selected for timer')
        return
      }

      dispatch({
        type: 'START_TIMER',
        todoId,
        mode: 'pomodoro',
        duration: workMinutes * 60 * 1000,
      })
    },
    [todoId, dispatch]
  )

  // Start free timer
  const startFreeTimer = useCallback(() => {
    if (!todoId) {
      console.warn('No todo selected for timer')
      return
    }

    dispatch({
      type: 'START_TIMER',
      todoId,
      mode: 'free',
    })
  }, [todoId, dispatch])

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (!activeSession || isPaused) return
    dispatch({ type: 'PAUSE_TIMER' })
  }, [activeSession, isPaused, dispatch])

  // Resume timer
  const resumeTimer = useCallback(() => {
    if (!activeSession || !isPaused) return
    dispatch({ type: 'RESUME_TIMER' })
  }, [activeSession, isPaused, dispatch])

  // Stop timer and save session
  const stopTimer = useCallback(() => {
    if (!activeSession) return

    const duration = remainingTime
    const actualDuration = activeSession.duration - duration

    dispatch({ type: 'STOP_TIMER', duration: Math.round(actualDuration / 1000 / 60) }) // Convert to minutes
  }, [activeSession, remainingTime, dispatch])

  // Update remaining time every second when running
  useEffect(() => {
    if (!activeSession || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Initial update
    setRemainingTime(calculateRemainingTime())

    intervalRef.current = window.setInterval(() => {
      const remaining = calculateRemainingTime()
      setRemainingTime(remaining)

      if (remaining <= 0) {
        // Timer completed
        stopTimer()

        // Play notification sound (if available)
        try {
          const audio = new Audio('/notification.mp3')
          audio.play().catch(() => {
            // Audio play failed (browser restriction or file not found)
            console.log('Audio notification not available')
          })
        } catch (e) {
          // Ignore audio errors
        }

        // Update page title
        document.title = '⏰ Timer Complete!'

        // Reset title after 5 seconds
        setTimeout(() => {
          document.title = 'My Todo App'
        }, 5000)
      } else {
        // Update page title with remaining time
        const minutes = Math.floor(remaining / 60000)
        const seconds = Math.floor((remaining % 60000) / 1000)
        document.title = `${minutes}:${seconds.toString().padStart(2, '0')} - Timer`
      }
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [activeSession, isPaused, calculateRemainingTime, stopTimer])

  // Update remaining time immediately when pause state changes
  useEffect(() => {
    if (activeSession && isPaused) {
      setRemainingTime(calculateRemainingTime())
    }
  }, [isPaused, activeSession, calculateRemainingTime])

  return {
    activeSession,
    isPaused,
    mode,
    remainingTime,
    startPomodoro,
    startFreeTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    isActive: !!activeSession,
  }
}

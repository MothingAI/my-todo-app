import { useState } from 'react'
import { format, isToday } from 'date-fns'
import { useCalendar } from '../../hooks/useCalendar'
import { useLanguage } from '../../contexts/LanguageContext'
import { MonthView } from './MonthView'
import styles from '../../styles/calendar/CalendarView.module.css'

export function CalendarView() {
  const { t } = useLanguage()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const {
    getTodosForDate,
    getOverdueTodos,
    getTodayTodos,
    formatMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
  } = useCalendar(currentDate)

  const selectedDateTodos = selectedDate ? getTodosForDate(selectedDate) : []
  const overdueTodos = getOverdueTodos()
  const todayTodos = getTodayTodos()

  const handlePreviousMonth = () => {
    setCurrentDate(goToPreviousMonth())
  }

  const handleNextMonth = () => {
    setCurrentDate(goToNextMonth())
  }

  const handleToday = () => {
    const today = goToToday()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  return (
    <div className={styles.calendarView}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.navigation}>
          <button
            type="button"
            className={styles.navButton}
            onClick={handlePreviousMonth}
            aria-label={t('calendarPreviousMonth')}
          >
            ←
          </button>
          <h2 className={styles.monthTitle}>{formatMonth(currentDate)}</h2>
          <button
            type="button"
            className={styles.navButton}
            onClick={handleNextMonth}
            aria-label={t('calendarNextMonth')}
          >
            →
          </button>
        </div>
        <button
          type="button"
          className={styles.todayButton}
          onClick={handleToday}
          aria-label={t('calendarToday')}
        >
          {t('calendarToday')}
        </button>
      </div>

      {/* Overdue alerts */}
      {overdueTodos.length > 0 && (
        <div className={styles.overdueAlert} role="alert">
          <strong>{t('calendarOverdueAlert', { count: overdueTodos.length })}</strong>
          <ul className={styles.overdueList}>
            {overdueTodos.slice(0, 3).map((todo) => (
              <li key={todo.id}>
                {todo.description}
                {todo.dueDate && ` (${format(new Date(todo.dueDate), 'MMM d')})`}
              </li>
            ))}
            {overdueTodos.length > 3 && (
              <li>{t('calendarAndMore', { count: overdueTodos.length - 3 })}</li>
            )}
          </ul>
        </div>
      )}

      {/* Today's todos summary */}
      {todayTodos.length > 0 && (
        <div className={styles.todaySummary}>
          <strong>{t('calendarTodayTodos', { count: todayTodos.length })}</strong>
        </div>
      )}

      {/* Calendar */}
      <MonthView currentDate={currentDate} onDateClick={handleDateClick} />

      {/* Selected date details */}
      {selectedDate && (
        <div className={styles.dateDetails}>
          <h3 className={styles.dateTitle}>
            {isToday(selectedDate) ? t('calendarToday') + "'s" : format(selectedDate, 'MMM d, yyyy')} {t('calendarSelectedDateTodos')}
          </h3>
          {selectedDateTodos.length === 0 ? (
            <p className={styles.noTodos}>{t('calendarNoTodos')}</p>
          ) : (
            <ul className={styles.todoList}>
              {selectedDateTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={`${styles.todoItem} ${todo.completed ? styles.completed : ''} ${
                    todo.dueDate && todo.dueDate < Date.now() && !todo.completed ? styles.overdueItem : ''
                  }`}
                >
                  <span className={styles.todoDescription}>{todo.description}</span>
                  <span className={styles.todoMeta}>
                    {todo.priority && <span className={styles.priority}>{todo.priority}</span>}
                    {todo.estimatedMinutes && (
                      <span className={styles.estimatedTime}>{todo.estimatedMinutes}m</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className={styles.closeDetails}
            onClick={() => setSelectedDate(null)}
            aria-label={t('calendarClose')}
          >
            {t('calendarClose')}
          </button>
        </div>
      )}
    </div>
  )
}

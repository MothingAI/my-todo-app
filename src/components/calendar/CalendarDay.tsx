import { isToday, isSameMonth, format } from 'date-fns'
import type { Todo } from '../../types/todo'
import styles from '../../styles/calendar/CalendarDay.module.css'

interface CalendarDayProps {
  date: Date
  currentDate: Date
  todos: Todo[]
  onClick: () => void
}

export function CalendarDay({ date, currentDate, todos, onClick }: CalendarDayProps) {
  const isCurrentMonth = isSameMonth(date, currentDate)
  const isTodayDate = isToday(date)
  const hasTodos = todos.length > 0
  const hasOverdue = todos.some((todo) => !todo.completed && todo.dueDate && todo.dueDate < Date.now())

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length

  return (
    <button
      type="button"
      className={`${styles.day} ${!isCurrentMonth ? styles.otherMonth : ''} ${
        isTodayDate ? styles.today : ''
      } ${hasTodos ? styles.hasTodos : ''}`}
      onClick={onClick}
      aria-label={`${format(date, 'MMM d, yyyy')}${totalCount > 0 ? `, ${totalCount} todo${totalCount > 1 ? 's' : ''}` : ''}`}
    >
      <span className={styles.dayNumber}>{format(date, 'd')}</span>

      {hasTodos && (
        <div className={styles.todoIndicators}>
          {totalCount > 0 && (
            <span
              className={`${styles.count} ${hasOverdue && completedCount < totalCount ? styles.overdue : ''}`}
            >
              {totalCount}
            </span>
          )}
        </div>
      )}

      {/* Progress bar for completed todos */}
      {totalCount > 0 && completedCount > 0 && (
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      )}
    </button>
  )
}

import { useCalendar } from '../../hooks/useCalendar'
import { CalendarDay } from './CalendarDay'
import styles from '../../styles/calendar/MonthView.module.css'

interface MonthViewProps {
  currentDate: Date
  onDateClick: (date: Date) => void
}

export function MonthView({ currentDate, onDateClick }: MonthViewProps) {
  const { calendarDays, formatWeekday, getTodosForDate } = useCalendar(currentDate)

  // Get weekday headers (Sun, Mon, Tue, etc.)
  const weekdays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - date.getDay() + i)
    return formatWeekday(date)
  })

  return (
    <div className={styles.monthView}>
      {/* Weekday headers */}
      <div className={styles.weekdays}>
        {weekdays.map((weekday) => (
          <div key={weekday} className={styles.weekday}>
            {weekday}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={styles.daysGrid}>
        {calendarDays.map((date) => (
          <CalendarDay
            key={date.toISOString()}
            date={date}
            currentDate={currentDate}
            todos={getTodosForDate(date)}
            onClick={() => onDateClick(date)}
          />
        ))}
      </div>
    </div>
  )
}

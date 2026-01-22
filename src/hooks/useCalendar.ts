import { useMemo } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isPast,
  isToday,
  format,
  addMonths,
  subMonths,
  startOfDay,
} from 'date-fns'
import { useTodos } from './useTodos'
import type { Todo } from '../types/todo'

export function useCalendar(currentDate: Date) {
  const { activeTodos, completedTodos } = useTodos()

  // Combine all todos
  const allTodos = useMemo(() => [...activeTodos, ...completedTodos], [activeTodos, completedTodos])

  // Get calendar days for the month view (includes days from previous/next months to fill the grid)
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }) // Sunday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentDate])

  // Get todos for a specific date
  const getTodosForDate = (date: Date): Todo[] => {
    return allTodos.filter((todo: Todo) => {
      if (!todo.dueDate) return false
      const dueDate = startOfDay(new Date(todo.dueDate))
      return isSameDay(dueDate, date)
    })
  }

  // Get overdue todos (past due date and not completed)
  const getOverdueTodos = (): Todo[] => {
    return activeTodos.filter((todo: Todo) => {
      if (!todo.dueDate) return false
      const dueDate = new Date(todo.dueDate)
      return isPast(dueDate) && !isToday(dueDate)
    })
  }

  // Get today's todos
  const getTodayTodos = (): Todo[] => {
    return getTodosForDate(new Date())
  }

  // Get upcoming todos (future due dates)
  const getUpcomingTodos = (days: number = 7): Todo[] => {
    const now = new Date()
    const futureDate = new Date()
    futureDate.setDate(now.getDate() + days)

    return activeTodos.filter((todo: Todo) => {
      if (!todo.dueDate) return false
      const dueDate = new Date(todo.dueDate)
      return dueDate > now && dueDate <= futureDate
    })
  }

  // Navigation helpers
  const goToPreviousMonth = () => subMonths(currentDate, 1)
  const goToNextMonth = () => addMonths(currentDate, 1)
  const goToToday = () => new Date()

  // Format helpers
  const formatMonth = (date: Date) => format(date, 'MMMM yyyy')
  const formatWeekday = (date: Date) => format(date, 'EEE')
  const formatDay = (date: Date) => format(date, 'd')

  return {
    calendarDays,
    getTodosForDate,
    getOverdueTodos,
    getTodayTodos,
    getUpcomingTodos,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    formatMonth,
    formatWeekday,
    formatDay,
    currentDate,
  }
}

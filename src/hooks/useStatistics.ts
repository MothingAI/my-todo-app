import { useMemo } from 'react'
import { format, subDays, startOfDay, differenceInDays } from 'date-fns'
import { useTodos } from './useTodos'

export interface DailyStats {
  date: string
  completedCount: number
  addedCount: number
}

export interface PriorityDistribution {
  priority: 'low' | 'medium' | 'high'
  count: number
  percentage: number
}

export interface TimeStats {
  totalEstimated: number
  totalActual: number
  averageEstimated: number
  averageActual: number
  variance: number
}

export function useStatistics() {
  const { activeTodos, completedTodos } = useTodos()

  const allTodos = useMemo(() => [...activeTodos, ...completedTodos], [activeTodos, completedTodos])

  // Calculate daily completion stats for the last 30 days
  const dailyStats = useMemo((): DailyStats[] => {
    const days = 30
    const stats: DailyStats[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i))
      const dateStr = format(date, 'MMM d')

      const completedOnDay = completedTodos.filter((todo) => {
        const completedDate = startOfDay(new Date(todo.createdAt))
        return differenceInDays(date, completedDate) === 0 && todo.completed
      })

      const addedOnDay = allTodos.filter((todo) => {
        const addedDate = startOfDay(new Date(todo.createdAt))
        return differenceInDays(date, addedDate) === 0
      })

      stats.push({
        date: dateStr,
        completedCount: completedOnDay.length,
        addedCount: addedOnDay.length,
      })
    }

    return stats
  }, [allTodos, completedTodos])

  // Calculate priority distribution
  const priorityDistribution = useMemo((): PriorityDistribution[] => {
    const todosWithPriority = allTodos.filter((todo) => todo.priority)
    const total = todosWithPriority.length

    if (total === 0) {
      return [
        { priority: 'low', count: 0, percentage: 0 },
        { priority: 'medium', count: 0, percentage: 0 },
        { priority: 'high', count: 0, percentage: 0 },
      ]
    }

    const distribution = todosWithPriority.reduce(
      (acc, todo) => {
        if (todo.priority) {
          acc[todo.priority]++
        }
        return acc
      },
      { low: 0, medium: 0, high: 0 }
    )

    return [
      { priority: 'high', count: distribution.high, percentage: (distribution.high / total) * 100 },
      {
        priority: 'medium',
        count: distribution.medium,
        percentage: (distribution.medium / total) * 100,
      },
      { priority: 'low', count: distribution.low, percentage: (distribution.low / total) * 100 },
    ]
  }, [allTodos])

  // Calculate time statistics
  const timeStats = useMemo((): TimeStats => {
    const todosWithEstimates = allTodos.filter((todo) => todo.estimatedMinutes)
    const todosWithActuals = allTodos.filter((todo) => todo.actualMinutes && todo.actualMinutes > 0)

    const totalEstimated = todosWithEstimates.reduce((sum, todo) => sum + (todo.estimatedMinutes || 0), 0)
    const totalActual = todosWithActuals.reduce((sum, todo) => sum + (todo.actualMinutes || 0), 0)

    const averageEstimated = todosWithEstimates.length > 0 ? totalEstimated / todosWithEstimates.length : 0
    const averageActual = todosWithActuals.length > 0 ? totalActual / todosWithActuals.length : 0

    // Calculate variance (average difference between estimated and actual)
    const todosWithBoth = allTodos.filter(
      (todo) => todo.estimatedMinutes && todo.actualMinutes && todo.actualMinutes > 0
    )

    const variance =
      todosWithBoth.length > 0
        ? todosWithBoth.reduce((sum, todo) => {
            const diff = (todo.actualMinutes || 0) - (todo.estimatedMinutes || 0)
            return sum + Math.abs(diff)
          }, 0) / todosWithBoth.length
        : 0

    return {
      totalEstimated,
      totalActual,
      averageEstimated,
      averageActual,
      variance,
    }
  }, [allTodos])

  // Completion rate
  const completionRate = useMemo(() => {
    const total = allTodos.length
    if (total === 0) return 0
    return (completedTodos.length / total) * 100
  }, [allTodos, completedTodos])

  // Overdue count
  const overdueCount = useMemo(() => {
    const now = new Date()
    return activeTodos.filter((todo) => {
      if (!todo.dueDate) return false
      const dueDate = new Date(todo.dueDate)
      return dueDate < now && !isToday(dueDate)
    }).length
  }, [activeTodos])

  // Helper to check if a date is today
  function isToday(date: Date): boolean {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return {
    dailyStats,
    priorityDistribution,
    timeStats,
    completionRate,
    overdueCount,
    totalTodos: allTodos.length,
    activeTodosCount: activeTodos.length,
    completedTodosCount: completedTodos.length,
  }
}

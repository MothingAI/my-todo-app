import type { Todo, TimerSession } from '../types/todo'
import { TODO_SCHEMA_VERSION } from '../types/todo'

const TIMER_STORAGE_KEY = 'todo-app-timer-sessions'

/**
 * Migrate a single todo to the latest schema version
 * v1: { id, description, completed, createdAt }
 * v2: adds { dueDate?, estimatedMinutes?, actualMinutes?, priority?, tags?, _version }
 * v3: adds { subtasks?, _version }
 */
export function migrateTodo(todo: any): Todo {
  // If already at current version (v3), return as-is
  if (todo._version === TODO_SCHEMA_VERSION) {
    return todo as Todo
  }

  // Migrate from v2 to v3
  if (todo._version === 2) {
    return {
      ...todo,
      subtasks: todo.subtasks || [],
      _version: 3,
    }
  }

  // Migrate from v1 to v2, then to v3
  return {
    id: todo.id,
    description: todo.description,
    completed: todo.completed,
    createdAt: todo.createdAt,
    // New fields with default values (v2)
    dueDate: todo.dueDate,
    estimatedMinutes: todo.estimatedMinutes,
    actualMinutes: todo.actualMinutes || 0,
    priority: todo.priority || 'medium',
    tags: todo.tags || [],
    // New fields with default values (v3)
    subtasks: [],
    _version: TODO_SCHEMA_VERSION,
  }
}

/**
 * Migrate all todos from storage
 */
export function migrateAllTodos(storedTodos: any[]): Todo[] {
  if (!Array.isArray(storedTodos)) {
    console.warn('Stored todos is not an array, returning empty array')
    return []
  }

  return storedTodos.map(migrateTodo)
}

/**
 * Load timer sessions from localStorage
 */
export function loadTimerSessions(): TimerSession[] {
  try {
    const stored = localStorage.getItem(TIMER_STORAGE_KEY)
    if (!stored) return []

    const sessions = JSON.parse(stored) as TimerSession[]
    return Array.isArray(sessions) ? sessions : []
  } catch (error) {
    console.error('Failed to load timer sessions:', error)
    return []
  }
}

/**
 * Save timer sessions to localStorage
 */
export function saveTimerSessions(sessions: TimerSession[]): boolean {
  try {
    const serialized = JSON.stringify(sessions)
    localStorage.setItem(TIMER_STORAGE_KEY, serialized)
    return true
  } catch (error) {
    console.error('Failed to save timer sessions:', error)
    return false
  }
}

/**
 * Clear timer sessions from localStorage
 */
export function clearTimerSessions(): boolean {
  try {
    localStorage.removeItem(TIMER_STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear timer sessions:', error)
    return false
  }
}

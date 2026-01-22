import type { Todo } from '../types/todo'
import { migrateAllTodos } from './dataMigration'

const STORAGE_KEY = 'todo-app-todos'

export const todoStorage = {
  loadTodos(): Todo[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []

      const todos = JSON.parse(stored)

      // Validate array structure
      if (!Array.isArray(todos)) return []

      // Migrate todos to latest schema version
      return migrateAllTodos(todos)
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error)
      return []
    }
  },

  saveTodos(todos: Todo[]): boolean {
    try {
      const serialized = JSON.stringify(todos)
      localStorage.setItem(STORAGE_KEY, serialized)
      return true
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error)
      return false
    }
  },

  clearTodos(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      console.error('Failed to clear todos from localStorage:', error)
      return false
    }
  },
}

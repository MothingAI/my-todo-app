import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { todoStorage } from '@/utils/todoStorage'
import type { Todo } from '@/types/todo'

describe('todoStorage', () => {
  const mockTodos: Todo[] = [
    {
      id: '1',
      description: 'Test todo 1',
      completed: false,
      createdAt: 1705382400000,
    },
    {
      id: '2',
      description: 'Test todo 2',
      completed: true,
      createdAt: 1705382500000,
    },
  ]

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('loadTodos', () => {
    it('should return empty array when no todos exist', () => {
      const result = todoStorage.loadTodos()
      expect(result).toEqual([])
    })

    it('should load existing todos from localStorage', () => {
      localStorage.setItem('todo-app-todos', JSON.stringify(mockTodos))
      const result = todoStorage.loadTodos()

      // Data migration adds new fields (v3 schema)
      const expectedMigratedTodos = mockTodos.map((todo) => ({
        ...todo,
        _version: 3,
        actualMinutes: 0,
        priority: 'medium' as const,
        tags: [],
        subtasks: [],
      }))

      expect(result).toEqual(expectedMigratedTodos)
      expect(result).toHaveLength(2)

      // Verify core fields are preserved
      expect(result[0].id).toBe(mockTodos[0].id)
      expect(result[0].description).toBe(mockTodos[0].description)
      expect(result[0].completed).toBe(mockTodos[0].completed)
      expect(result[0].createdAt).toBe(mockTodos[0].createdAt)
    })

    it('should return empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('todo-app-todos', 'invalid json')
      const result = todoStorage.loadTodos()

      expect(result).toEqual([])
    })

    it('should return empty array when localStorage contains non-array data', () => {
      localStorage.setItem('todo-app-todos', JSON.stringify({ not: 'an array' }))
      const result = todoStorage.loadTodos()

      expect(result).toEqual([])
    })

    it('should return empty array when localStorage is unavailable', () => {
      // Mock localStorage.getItem to throw error
      const originalGetItem = localStorage.getItem
      localStorage.getItem = vi.fn(() => {
        throw new Error('localStorage unavailable')
      })

      const result = todoStorage.loadTodos()
      expect(result).toEqual([])

      localStorage.getItem = originalGetItem
    })
  })

  describe('saveTodos', () => {
    it('should save todos to localStorage', () => {
      const result = todoStorage.saveTodos(mockTodos)

      expect(result).toBe(true)

      const stored = localStorage.getItem('todo-app-todos')
      expect(stored).toBe(JSON.stringify(mockTodos))
    })

    it('should overwrite existing todos', () => {
      todoStorage.saveTodos(mockTodos)

      const newTodos: Todo[] = [
        {
          id: '3',
          description: 'New todo',
          completed: false,
          createdAt: 1705382600000,
        },
      ]

      todoStorage.saveTodos(newTodos)

      const stored = localStorage.getItem('todo-app-todos')
      expect(stored).toBe(JSON.stringify(newTodos))
    })

    it('should return false when localStorage is unavailable', () => {
      // Mock localStorage.setItem to throw error (quota exceeded)
      const originalSetItem = Storage.prototype.setItem
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError')
      }) as any

      const result = todoStorage.saveTodos(mockTodos)
      expect(result).toBe(false)

      Storage.prototype.setItem = originalSetItem
    })
  })

  describe('clearTodos', () => {
    it('should remove todos from localStorage', () => {
      localStorage.setItem('todo-app-todos', JSON.stringify(mockTodos))

      const result = todoStorage.clearTodos()

      expect(result).toBe(true)
      expect(localStorage.getItem('todo-app-todos')).toBeNull()
    })

    it('should return true when clearing empty storage', () => {
      const result = todoStorage.clearTodos()
      expect(result).toBe(true)
    })

    it('should return false when localStorage is unavailable', () => {
      const originalRemoveItem = Storage.prototype.removeItem
      Storage.prototype.removeItem = vi.fn(() => {
        throw new Error('localStorage unavailable')
      }) as any

      const result = todoStorage.clearTodos()
      expect(result).toBe(false)

      Storage.prototype.removeItem = originalRemoveItem
    })
  })
})

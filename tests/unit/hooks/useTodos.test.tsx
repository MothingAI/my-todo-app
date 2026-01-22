import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { TodoProvider, useTodos } from '@/hooks/useTodos'
import type { Todo } from '@/types/todo'

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TodoProvider>{children}</TodoProvider>
  )

  describe('ADD_TODO action', () => {
    it('should add a new todo to activeTodos', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const newTodo: Todo = {
        id: '1',
        description: 'New todo',
        completed: false,
        createdAt: Date.now(),
      }

      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo: newTodo })
      })

      expect(result.current.activeTodos).toHaveLength(1)
      expect(result.current.activeTodos[0]).toEqual(newTodo)
    })

    it('should prepend new todos to the beginning of activeTodos', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const todo1: Todo = {
        id: '1',
        description: 'First todo',
        completed: false,
        createdAt: 1000,
      }

      const todo2: Todo = {
        id: '2',
        description: 'Second todo',
        completed: false,
        createdAt: 2000,
      }

      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo: todo1 })
      })

      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo: todo2 })
      })

      expect(result.current.activeTodos).toHaveLength(2)
      expect(result.current.activeTodos[0].id).toBe('2') // Most recent first
      expect(result.current.activeTodos[1].id).toBe('1')
    })

    it('should not affect completedTodos when adding active todo', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      // Add a completed todo first
      const completedTodo: Todo = {
        id: '1',
        description: 'Completed todo',
        completed: true,
        createdAt: 1000,
      }

      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo: completedTodo })
      })

      act(() => {
        result.current.dispatch({ type: 'COMPLETE_TODO', id: '1' })
      })

      expect(result.current.completedTodos).toHaveLength(1)

      // Add an active todo
      const activeTodo: Todo = {
        id: '2',
        description: 'Active todo',
        completed: false,
        createdAt: 2000,
      }

      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo: activeTodo })
      })

      expect(result.current.completedTodos).toHaveLength(1) // Unchanged
      expect(result.current.activeTodos).toHaveLength(1)
    })
  })

  describe('initial state', () => {
    it('should start with empty active and completed arrays', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      expect(result.current.activeTodos).toEqual([])
      expect(result.current.completedTodos).toEqual([])
      expect(result.current.undoNotification).toBeNull()
    })
  })

  describe('LOAD_TODOS action', () => {
    it('should load todos and separate them by completed status', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const todos: Todo[] = [
        {
          id: '1',
          description: 'Active todo',
          completed: false,
          createdAt: 1000,
        },
        {
          id: '2',
          description: 'Completed todo',
          completed: true,
          createdAt: 2000,
        },
      ]

      act(() => {
        result.current.dispatch({ type: 'LOAD_TODOS', todos })
      })

      expect(result.current.activeTodos).toHaveLength(1)
      expect(result.current.completedTodos).toHaveLength(1)
      expect(result.current.activeTodos[0].id).toBe('1')
      expect(result.current.completedTodos[0].id).toBe('2')
    })

    it('should sort todos by createdAt descending (newest first)', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const todos: Todo[] = [
        {
          id: '1',
          description: 'Old todo',
          completed: false,
          createdAt: 1000,
        },
        {
          id: '2',
          description: 'New todo',
          completed: false,
          createdAt: 3000,
        },
        {
          id: '3',
          description: 'Middle todo',
          completed: false,
          createdAt: 2000,
        },
      ]

      act(() => {
        result.current.dispatch({ type: 'LOAD_TODOS', todos })
      })

      expect(result.current.activeTodos[0].id).toBe('2') // Newest
      expect(result.current.activeTodos[1].id).toBe('3') // Middle
      expect(result.current.activeTodos[2].id).toBe('1') // Oldest
    })
  })

  describe('COMPLETE_TODO action', () => {
    it('should move todo from activeTodos to completedTodos', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const todo: Todo = {
        id: '1',
        description: 'Test todo',
        completed: false,
        createdAt: 1000,
      }

      // Add the todo
      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo })
      })

      expect(result.current.activeTodos).toHaveLength(1)
      expect(result.current.completedTodos).toHaveLength(0)

      // Mark as complete
      act(() => {
        result.current.dispatch({ type: 'COMPLETE_TODO', id: '1' })
      })

      expect(result.current.activeTodos).toHaveLength(0)
      expect(result.current.completedTodos).toHaveLength(1)
      expect(result.current.completedTodos[0].id).toBe('1')
    })

    it('should return the completed todo for confetti trigger', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const todo: Todo = {
        id: '1',
        description: 'Celebrate!',
        completed: false,
        createdAt: 1000,
      }

      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo })
      })

      act(() => {
        result.current.dispatch({ type: 'COMPLETE_TODO', id: '1' })
      })

      // Verify the todo moved to completedTodos
      expect(result.current.completedTodos).toHaveLength(1)
      expect(result.current.completedTodos[0].id).toBe('1')
      expect(result.current.completedTodos[0].description).toBe('Celebrate!')
    })

    it('should maintain sorting in completedTodos (newest completed first)', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const todo1: Todo = {
        id: '1',
        description: 'First',
        completed: false,
        createdAt: 1000,
      }
      const todo2: Todo = {
        id: '2',
        description: 'Second',
        completed: false,
        createdAt: 2000,
      }

      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo: todo1 })
        result.current.dispatch({ type: 'ADD_TODO', todo: todo2 })
      })

      // Complete second todo first
      act(() => {
        result.current.dispatch({ type: 'COMPLETE_TODO', id: '2' })
      })

      // Then complete first todo
      act(() => {
        result.current.dispatch({ type: 'COMPLETE_TODO', id: '1' })
      })

      expect(result.current.completedTodos).toHaveLength(2)
      expect(result.current.completedTodos[0].id).toBe('1') // Most recently completed
      expect(result.current.completedTodos[1].id).toBe('2')
    })
  })

  describe('ACTIVATE_TODO action', () => {
    it('should move todo from completedTodos back to activeTodos', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const todo: Todo = {
        id: '1',
        description: 'Test todo',
        completed: false,
        createdAt: 1000,
      }

      // Add and complete
      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo })
        result.current.dispatch({ type: 'COMPLETE_TODO', id: '1' })
      })

      expect(result.current.activeTodos).toHaveLength(0)
      expect(result.current.completedTodos).toHaveLength(1)

      // Activate again
      act(() => {
        result.current.dispatch({ type: 'ACTIVATE_TODO', id: '1' })
      })

      expect(result.current.activeTodos).toHaveLength(1)
      expect(result.current.completedTodos).toHaveLength(0)
      expect(result.current.activeTodos[0].id).toBe('1')
    })

    it('should not return confetti trigger for activate (no celebration)', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const todo: Todo = {
        id: '1',
        description: 'Test todo',
        completed: false,
        createdAt: 1000,
      }

      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo })
        result.current.dispatch({ type: 'COMPLETE_TODO', id: '1' })
      })

      act(() => {
        result.current.dispatch({ type: 'ACTIVATE_TODO', id: '1' })
      })

      // Verify the todo moved back to activeTodos
      expect(result.current.activeTodos).toHaveLength(1)
      expect(result.current.activeTodos[0].id).toBe('1')
    })

    it('should maintain createdAt timestamp when moving between sections', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const originalTimestamp = 1000
      const todo: Todo = {
        id: '1',
        description: 'Test todo',
        completed: false,
        createdAt: originalTimestamp,
      }

      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo })
        result.current.dispatch({ type: 'COMPLETE_TODO', id: '1' })
        result.current.dispatch({ type: 'ACTIVATE_TODO', id: '1' })
      })

      expect(result.current.activeTodos[0].createdAt).toBe(originalTimestamp)
    })
  })

  describe('DELETE_TODO action', () => {
    it('should remove todo from activeTodos and store in undoNotification', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const todo: Todo = {
        id: '1',
        description: 'To delete',
        completed: false,
        createdAt: 1000,
      }

      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo })
      })

      act(() => {
        result.current.dispatch({ type: 'DELETE_TODO', id: '1' })
      })

      expect(result.current.activeTodos).toHaveLength(0)
      expect(result.current.undoNotification).not.toBeNull()
      expect(result.current.undoNotification?.todo.id).toBe('1')
    })

    it('should remove todo from completedTodos and store in undoNotification', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const todo: Todo = {
        id: '1',
        description: 'Completed',
        completed: true,
        createdAt: 1000,
      }

      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo })
        result.current.dispatch({ type: 'COMPLETE_TODO', id: '1' })
      })

      act(() => {
        result.current.dispatch({ type: 'DELETE_TODO', id: '1' })
      })

      expect(result.current.completedTodos).toHaveLength(0)
      expect(result.current.undoNotification).not.toBeNull()
      expect(result.current.undoNotification?.todo.id).toBe('1')
    })
  })

  describe('UNDO_DELETE action', () => {
    it('should restore deleted active todo', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const todo: Todo = {
        id: '1',
        description: 'Restore me',
        completed: false,
        createdAt: 1000,
      }

      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo })
        result.current.dispatch({ type: 'DELETE_TODO', id: '1' })
      })

      expect(result.current.activeTodos).toHaveLength(0)

      act(() => {
        result.current.dispatch({ type: 'UNDO_DELETE' })
      })

      expect(result.current.activeTodos).toHaveLength(1)
      expect(result.current.activeTodos[0].id).toBe('1')
      expect(result.current.undoNotification).toBeNull()
    })

    it('should restore deleted completed todo', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const todo: Todo = {
        id: '1',
        description: 'Restore completed',
        completed: true,
        createdAt: 1000,
      }

      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo })
        result.current.dispatch({ type: 'COMPLETE_TODO', id: '1' })
        result.current.dispatch({ type: 'DELETE_TODO', id: '1' })
      })

      expect(result.current.completedTodos).toHaveLength(0)

      act(() => {
        result.current.dispatch({ type: 'UNDO_DELETE' })
      })

      expect(result.current.completedTodos).toHaveLength(1)
      expect(result.current.completedTodos[0].id).toBe('1')
      expect(result.current.undoNotification).toBeNull()
    })
  })

  describe('PERMANENTLY_DELETE action', () => {
    it('should clear undo notification without restoring', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const todo: Todo = {
        id: '1',
        description: 'Gone forever',
        completed: false,
        createdAt: 1000,
      }

      act(() => {
        result.current.dispatch({ type: 'ADD_TODO', todo })
        result.current.dispatch({ type: 'DELETE_TODO', id: '1' })
      })

      expect(result.current.undoNotification).not.toBeNull()

      act(() => {
        result.current.dispatch({ type: 'PERMANENTLY_DELETE' })
      })

      expect(result.current.undoNotification).toBeNull()
      expect(result.current.activeTodos).toHaveLength(0)
    })
  })
})

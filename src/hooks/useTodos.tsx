import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback, useRef } from 'react'
import type { TodoState, TodoAction, TodoContextValue, Todo, Subtask } from '../types/todo'
import { todoStorage } from '../utils/todoStorage'
import { loadTimerSessions, saveTimerSessions } from '../utils/dataMigration'

const TodoContext = createContext<TodoContextValue | undefined>(undefined)

// Helper: Find and update todo in either list
function findAndUpdateTodo(todos: Todo[], todoId: string, updater: (todo: Todo) => Todo): Todo[] {
  return todos.map((todo) => (todo.id === todoId ? updater(todo) : todo))
}

// Helper: Find and update subtask within a todo
function updateSubtaskInTodo(todo: Todo, subtaskId: string, updater: (subtask: Subtask) => Subtask): Todo {
  if (!todo.subtasks) return todo

  const updatedSubtasks = todo.subtasks.map((st) => (st.id === subtaskId ? updater(st) : st))

  return { ...todo, subtasks: updatedSubtasks }
}

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        activeTodos: [action.todo, ...state.activeTodos],
      }

    case 'COMPLETE_TODO': {
      const todoToComplete = state.activeTodos.find((t) => t.id === action.id)
      if (!todoToComplete) return state

      // Cascade completion: complete all subtasks when parent completes
      const completedSubtasks = todoToComplete.subtasks?.map((st) => ({
        ...st,
        completed: true,
      })) || []

      const completedTodo = {
        ...todoToComplete,
        completed: true,
        completedAt: Date.now(), // Set completion timestamp
        subtasks: completedSubtasks,
      }
      return {
        ...state,
        activeTodos: state.activeTodos.filter((t) => t.id !== action.id),
        completedTodos: [completedTodo, ...state.completedTodos],
      }
    }

    case 'ACTIVATE_TODO': {
      const todoToActivate = state.completedTodos.find((t) => t.id === action.id)
      if (!todoToActivate) return state

      const activeTodo = { ...todoToActivate, completed: false, completedAt: undefined }
      return {
        ...state,
        completedTodos: state.completedTodos.filter((t) => t.id !== action.id),
        activeTodos: [activeTodo, ...state.activeTodos],
      }
    }

    case 'DELETE_TODO': {
      // Remove from active todos
      const activeTodo = state.activeTodos.find((t) => t.id === action.id)
      if (activeTodo) {
        return {
          ...state,
          activeTodos: state.activeTodos.filter((t) => t.id !== action.id),
          undoNotification: {
            todo: activeTodo,
            timeoutId: null,
            visible: true,
          },
        }
      }

      // Remove from completed todos
      const completedTodo = state.completedTodos.find((t) => t.id === action.id)
      if (completedTodo) {
        return {
          ...state,
          completedTodos: state.completedTodos.filter((t) => t.id !== action.id),
          undoNotification: {
            todo: completedTodo,
            timeoutId: null,
            visible: true,
          },
        }
      }

      return state
    }

    case 'UNDO_DELETE': {
      if (!state.undoNotification) return state

      const { todo } = state.undoNotification
      if (todo.completed) {
        return {
          ...state,
          completedTodos: [todo, ...state.completedTodos],
          undoNotification: null,
        }
      } else {
        return {
          ...state,
          activeTodos: [todo, ...state.activeTodos],
          undoNotification: null,
        }
      }
    }

    case 'PERMANENTLY_DELETE': {
      // Clear the undo notification without restoring
      return {
        ...state,
        undoNotification: null,
      }
    }

    case 'LOAD_TODOS': {
      const activeTodos = action.todos.filter((t) => !t.completed)
      const completedTodos = action.todos.filter((t) => t.completed)

      // Sort by createdAt descending (newest first)
      activeTodos.sort((a, b) => b.createdAt - a.createdAt)
      completedTodos.sort((a, b) => b.createdAt - a.createdAt)

      return {
        ...state,
        activeTodos,
        completedTodos,
      }
    }

    case 'LOAD_TIMER_SESSIONS': {
      return {
        ...state,
        timerSessions: action.sessions,
      }
    }

    case 'UPDATE_TODO': {
      // Update todo in active list
      const activeTodo = state.activeTodos.find((t) => t.id === action.id)
      if (activeTodo) {
        const updatedActiveTodos = state.activeTodos.map((t) =>
          t.id === action.id ? { ...t, ...action.updates } : t
        )
        return { ...state, activeTodos: updatedActiveTodos }
      }

      // Update todo in completed list
      const completedTodo = state.completedTodos.find((t) => t.id === action.id)
      if (completedTodo) {
        const updatedCompletedTodos = state.completedTodos.map((t) =>
          t.id === action.id ? { ...t, ...action.updates } : t
        )
        return { ...state, completedTodos: updatedCompletedTodos }
      }

      return state
    }

    case 'START_TIMER': {
      const session = {
        todoId: action.todoId,
        startTime: Date.now(),
        duration: action.duration || 25 * 60 * 1000, // Default 25 minutes in ms
        type: action.mode,
      }
      return {
        ...state,
        timer: {
          activeSession: session,
          isPaused: false,
          pausedTime: 0,
          mode: action.mode,
          customDuration: action.duration,
        },
      }
    }

    case 'PAUSE_TIMER': {
      if (!state.timer.activeSession) return state
      return {
        ...state,
        timer: {
          ...state.timer,
          isPaused: true,
          pausedTime: state.timer.pausedTime + (Date.now() - state.timer.activeSession.startTime),
        },
      }
    }

    case 'RESUME_TIMER': {
      if (!state.timer.activeSession) return state
      return {
        ...state,
        timer: {
          ...state.timer,
          isPaused: false,
          activeSession: {
            ...state.timer.activeSession,
            startTime: Date.now(),
          },
        },
      }
    }

    case 'STOP_TIMER': {
      if (!state.timer.activeSession) return state

      const completedSession = {
        ...state.timer.activeSession,
        endTime: Date.now(),
        duration: action.duration,
      }

      return {
        ...state,
        timer: {
          activeSession: null,
          isPaused: false,
          pausedTime: 0,
          mode: 'free',
        },
        timerSessions: [...state.timerSessions, completedSession],
      }
    }

    // Subtask management actions
    case 'ADD_SUBTASK': {
      const updater = (todo: Todo) => ({
        ...todo,
        subtasks: [...(todo.subtasks || []), action.subtask],
      })

      return {
        ...state,
        activeTodos: findAndUpdateTodo(state.activeTodos, action.todoId, updater),
        completedTodos: findAndUpdateTodo(state.completedTodos, action.todoId, updater),
      }
    }

    case 'UPDATE_SUBTASK': {
      const updater = (todo: Todo) => updateSubtaskInTodo(todo, action.subtaskId, (subtask) => ({ ...subtask, ...action.updates }))

      return {
        ...state,
        activeTodos: findAndUpdateTodo(state.activeTodos, action.todoId, updater),
        completedTodos: findAndUpdateTodo(state.completedTodos, action.todoId, updater),
      }
    }

    case 'DELETE_SUBTASK': {
      const updater = (todo: Todo) => ({
        ...todo,
        subtasks: (todo.subtasks || []).filter((st) => st.id !== action.subtaskId),
      })

      return {
        ...state,
        activeTodos: findAndUpdateTodo(state.activeTodos, action.todoId, updater),
        completedTodos: findAndUpdateTodo(state.completedTodos, action.todoId, updater),
      }
    }

    case 'TOGGLE_SUBTASK': {
      // Find the todo in either list
      const allTodos = [...state.activeTodos, ...state.completedTodos]
      const todo = allTodos.find((t) => t.id === action.todoId)

      if (!todo || !todo.subtasks) return state

      const subtask = todo.subtasks.find((st) => st.id === action.subtaskId)
      if (!subtask) return state

      const newCompletedState = !subtask.completed
      const allCompletedAfterToggle = todo.subtasks.every((st) =>
        st.id === action.subtaskId ? newCompletedState : st.completed
      )

      // If all subtasks will be completed after toggle, complete parent todo
      if (allCompletedAfterToggle && newCompletedState && !todo.completed) {
        // Find which list the todo is in
        const isInActive = state.activeTodos.some((t) => t.id === action.todoId)

        if (isInActive) {
          const completedTodo = {
            ...todo,
            subtasks: todo.subtasks.map((st) => (st.id === action.subtaskId ? { ...st, completed: true } : st)),
            completed: true,
          }

          return {
            ...state,
            activeTodos: state.activeTodos.filter((t) => t.id !== action.todoId),
            completedTodos: [completedTodo, ...state.completedTodos],
          }
        }
      }

      // Otherwise just toggle the subtask
      const updater = (todo: Todo) =>
        updateSubtaskInTodo(todo, action.subtaskId, (subtask) => ({
          ...subtask,
          completed: !subtask.completed,
        }))

      return {
        ...state,
        activeTodos: findAndUpdateTodo(state.activeTodos, action.todoId, updater),
        completedTodos: findAndUpdateTodo(state.completedTodos, action.todoId, updater),
      }
    }

    case 'ADD_SUBTASK_IMAGE': {
      const updater = (todo: Todo) =>
        updateSubtaskInTodo(todo, action.subtaskId, (subtask) => ({
          ...subtask,
          images: [...subtask.images, action.image],
        }))

      return {
        ...state,
        activeTodos: findAndUpdateTodo(state.activeTodos, action.todoId, updater),
        completedTodos: findAndUpdateTodo(state.completedTodos, action.todoId, updater),
      }
    }

    case 'DELETE_SUBTASK_IMAGE': {
      const updater = (todo: Todo) =>
        updateSubtaskInTodo(todo, action.subtaskId, (subtask) => ({
          ...subtask,
          images: subtask.images.filter((img) => img.id !== action.imageId),
        }))

      return {
        ...state,
        activeTodos: findAndUpdateTodo(state.activeTodos, action.todoId, updater),
        completedTodos: findAndUpdateTodo(state.completedTodos, action.todoId, updater),
      }
    }

    default:
      return state
  }
}

const initialState: TodoState = {
  activeTodos: [],
  completedTodos: [],
  undoNotification: null,
  timer: {
    activeSession: null,
    isPaused: false,
    pausedTime: 0,
    mode: 'free',
  },
  timerSessions: [],
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, reducerDispatch] = useReducer(todoReducer, initialState)

  // Regular dispatch - just forward to reducer
  const dispatch = useCallback((action: TodoAction): void => {
    reducerDispatch(action)
  }, [])

  // Load todos from localStorage on mount
  useEffect(() => {
    const loaded = todoStorage.loadTodos()
    if (loaded.length > 0) {
      dispatch({ type: 'LOAD_TODOS', todos: loaded })
    }

    // Load timer sessions
    const sessions = loadTimerSessions()
    if (sessions.length > 0) {
      reducerDispatch({ type: 'LOAD_TIMER_SESSIONS', sessions })
    }
  }, [dispatch])

  // Save todos to localStorage with debouncing (500ms)
  const saveTimeoutRef = useRef<number | null>(null)
  useEffect(() => {
    const allTodos = [...state.activeTodos, ...state.completedTodos]

    // Clear previous timeout
    if (saveTimeoutRef.current !== null) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set new timeout for debounced save
    saveTimeoutRef.current = window.setTimeout(() => {
      if (allTodos.length > 0 || todoStorage.loadTodos().length > 0) {
        todoStorage.saveTodos(allTodos)
      }
      saveTimeoutRef.current = null
    }, 500)

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current !== null) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [state.activeTodos, state.completedTodos])

  // Save timer sessions whenever they change (also debounced)
  const timerSaveTimeoutRef = useRef<number | null>(null)
  useEffect(() => {
    // Clear previous timeout
    if (timerSaveTimeoutRef.current !== null) {
      clearTimeout(timerSaveTimeoutRef.current)
    }

    // Set new timeout for debounced save
    timerSaveTimeoutRef.current = window.setTimeout(() => {
      if (state.timerSessions.length > 0 || loadTimerSessions().length > 0) {
        saveTimerSessions(state.timerSessions)
      }
      timerSaveTimeoutRef.current = null
    }, 500)

    // Cleanup on unmount
    return () => {
      if (timerSaveTimeoutRef.current !== null) {
        clearTimeout(timerSaveTimeoutRef.current)
      }
    }
  }, [state.timerSessions])

  // Handle undo timeout
  useEffect(() => {
    if (state.undoNotification?.visible) {
      const timeoutId = window.setTimeout(() => {
        dispatch({ type: 'PERMANENTLY_DELETE' })
      }, 5000)

      return () => clearTimeout(timeoutId)
    }
  }, [state.undoNotification, dispatch])

  const contextValue: TodoContextValue = {
    ...state,
    dispatch,
  }

  return <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
}

export function useTodos() {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider')
  }
  return context
}

// Schema version for data migration
export const TODO_SCHEMA_VERSION = 3

// Image storage structure for subtasks
export interface SubtaskImage {
  id: string
  data: string // Base64 encoded image
  name: string
  size: number // Original size in bytes
  compressedSize: number // Compressed size in bytes
  uploadedAt: number
}

// Subtask entity
export interface Subtask {
  id: string
  description: string
  completed: boolean
  createdAt: number
  priority?: 'low' | 'medium' | 'high'
  dueDate?: number
  notes?: string
  images: SubtaskImage[]
  _version?: number
}

// Core entity
export interface Todo {
  id: string
  description: string
  completed: boolean
  createdAt: number
  // New fields for time management (optional for backward compatibility)
  dueDate?: number
  estimatedMinutes?: number
  actualMinutes?: number
  priority?: 'low' | 'medium' | 'high'
  tags?: string[]
  // New field for subtask support (optional for backward compatibility)
  subtasks?: Subtask[]
  _version?: number
}

// Undo notification
export interface UndoNotification {
  todo: Todo
  timeoutId: number | null
  visible: boolean
}

// Global state
export interface TodoState {
  activeTodos: Todo[]
  completedTodos: Todo[]
  undoNotification: UndoNotification | null
  timer: TimerState
  timerSessions: TimerSession[]
}

// Timer session tracking
export interface TimerSession {
  todoId: string
  startTime: number
  endTime?: number
  duration: number
  type: 'pomodoro' | 'free'
}

// Timer state
export interface TimerState {
  activeSession: TimerSession | null
  isPaused: boolean
  pausedTime: number
  mode: 'pomodoro' | 'free' | 'custom'
  customDuration?: number
}

// Reducer actions
export type TodoAction =
  | { type: 'ADD_TODO'; todo: Todo }
  | { type: 'COMPLETE_TODO'; id: string }
  | { type: 'ACTIVATE_TODO'; id: string }
  | { type: 'DELETE_TODO'; id: string }
  | { type: 'UNDO_DELETE' }
  | { type: 'PERMANENTLY_DELETE' }
  | { type: 'LOAD_TODOS'; todos: Todo[] }
  | { type: 'LOAD_TIMER_SESSIONS'; sessions: TimerSession[] }
  // New actions for time management
  | { type: 'UPDATE_TODO'; id: string; updates: Partial<Todo> }
  | { type: 'START_TIMER'; todoId: string; mode: 'pomodoro' | 'free'; duration?: number }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESUME_TIMER' }
  | { type: 'STOP_TIMER'; duration: number }
  // New actions for subtask management
  | { type: 'ADD_SUBTASK'; todoId: string; subtask: Subtask }
  | { type: 'UPDATE_SUBTASK'; todoId: string; subtaskId: string; updates: Partial<Subtask> }
  | { type: 'DELETE_SUBTASK'; todoId: string; subtaskId: string }
  | { type: 'TOGGLE_SUBTASK'; todoId: string; subtaskId: string }
  | { type: 'ADD_SUBTASK_IMAGE'; todoId: string; subtaskId: string; image: SubtaskImage }
  | { type: 'DELETE_SUBTASK_IMAGE'; todoId: string; subtaskId: string; imageId: string }

// Storage functions
export interface TodoStorage {
  loadTodos: () => Todo[]
  saveTodos: (todos: Todo[]) => boolean
  clearTodos: () => boolean
}

// Context value
export interface TodoContextValue extends TodoState {
  dispatch: (action: TodoAction) => void
}

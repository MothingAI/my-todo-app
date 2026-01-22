# Data Model: Todo Application

**Feature**: 001-todo-app
**Date**: 2026-01-16
**Status**: Final

## Overview

This document defines the data entities, their relationships, validation rules, and state transitions for the Todo Application.

## Entities

### Todo

Represents a single task item in the application.

**Fields**:

| Field | Type | Description | Validation | Required |
|-------|------|-------------|------------|----------|
| `id` | `string` | Unique identifier (UUID v4 format) | Must be valid UUID | Yes |
| `description` | `string` | Task description text | 1-500 characters, at least one non-whitespace character | Yes |
| `completed` | `boolean` | Completion status | `true` or `false` | Yes |
| `createdAt` | `number` | Unix timestamp (milliseconds) | Positive integer | Yes |

**Example**:
```typescript
{
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  description: "Buy groceries",
  completed: false,
  createdAt: 1705382400000
}
```

**Validation Rules**:

1. **id**:
   - Format: UUID v4 (e.g., `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`)
   - Must be unique across all todos
   - Generated at creation time, never modified

2. **description**:
   - Minimum length: 1 character (non-whitespace)
   - Maximum length: 500 characters (including spaces and emojis)
   - Preserves exact user input (including special characters and emojis)
   - Trimmed whitespace not stored (user sees exactly what they typed)

3. **completed**:
   - Default: `false` at creation
   - Toggled by user action
   - Determines which section todo appears in (Active/Completed)

4. **createdAt**:
   - Set to `Date.now()` at creation
   - Never modified
   - Used for sorting (newest first)

**TypeScript Definition**:
```typescript
interface Todo {
  id: string
  description: string
  completed: boolean
  createdAt: number
}
```

---

### UndoNotification

Represents a temporary notification for undoing a deletion.

**Fields**:

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `todo` | `Todo` | The deleted todo item (for potential restore) | Yes |
| `timeoutId` | `number \| null` | setTimeout ID for auto-dismiss | Yes |
| `visible` | `boolean` | Whether notification is currently visible | Yes |

**Lifecycle**:
- Created when todo deleted
- Automatically dismissed after 5 seconds
- Replaced if new deletion occurs before timeout
- Manually dismissed if user clicks "Undo" or dismisses notification

**TypeScript Definition**:
```typescript
interface UndoNotification {
  todo: Todo
  timeoutId: number | null
  visible: boolean
}
```

---

## Relationships

### Todo ↔ TodoList (Composition)

- **Relationship**: One-to-many (TodoList contains many Todos)
- **Cardinality**: One TodoList → Many Todos (0-100 based on performance target)
- **Ownership**: TodoList owns and manages Todos
- **Lifecycle**: Todos are created within and deleted from TodoList

**Visual Representation**:
```
TodoList (1)
    ├── Todo (active) *
    ├── Todo (active) *
    └── Todo (completed) *
```

### Todo ↔ UndoNotification (Temporary Association)

- **Relationship**: Temporary reference during undo window
- **Duration**: 5 seconds maximum
- **Purpose**: Allows restoring deleted todo
- **Constraint**: Only one UndoNotification active at a time

---

## State Transitions

### Todo Lifecycle

```
[Creation]
    ↓
  Active Todo
    ↓
[Toggle Complete]
    ↓
 Completed Todo
    ↓
[Toggle Incomplete]
    ↓
  Active Todo (returns to active section)
```

**Transition Rules**:

1. **Creation**:
   - Trigger: User submits valid input
   - From: Nothing (new entity)
   - To: Active Todo (completed=false)
   - Position: Top of active list
   - Side effect: Saved to localStorage

2. **Completion**:
   - Trigger: User clicks complete button
   - From: Active Todo
   - To: Completed Todo (completed=true)
   - Position: Moves to completed section (bottom of list)
   - Side effect: Confetti animation triggered

3. **Reactivation**:
   - Trigger: User clicks complete button on completed todo
   - From: Completed Todo
   - To: Active Todo (completed=false)
   - Position: Moves to top of active list (newest first)
   - Side effect: No confetti (only on initial completion)

4. **Deletion**:
   - Trigger: User clicks delete button
   - From: Active OR Completed Todo
   - To: Temporary state (UndoNotification)
   - Side effect: Removed from list, undo notification shown

5. **Permanent Deletion**:
   - Trigger: 5-second timeout expires OR user dismisses notification
   - From: UndoNotification state
   - To: Deleted (removed from storage)
   - Side effect: localStorage updated

6. **Undo Deletion**:
   - Trigger: User clicks "Undo" button
   - From: UndoNotification state
   - To: Original section (Active or Completed)
   - Position: Original position restored
   - Side effect: Notification dismissed, todo restored

---

## Validation Rules

### Input Validation (HTML5 + TypeScript)

| Field | HTML5 Attribute | TypeScript Check | Error Message |
|-------|-----------------|------------------|---------------|
| `description` | `required` | `description.trim().length > 0` | "Please enter a todo description" |
| `description` | `maxlength="500"` | `description.length <= 500` | "Description must be 500 characters or less" |
| `description` | `pattern=".*\S+.*"` | `/\S/.test(description)` | "Description cannot be empty or whitespace only" |

### Business Logic Validation

1. **Duplicate Prevention**:
   - Allowed: Multiple todos with same description
   - Rationale: Users may have multiple similar tasks

2. **Character Encoding**:
   - Supported: All Unicode characters (UTF-8)
   - Includes: Emojis, special characters, RTL languages
   - Storage: JSON.stringify() handles encoding

3. **Length Limits**:
   - Maximum todos: No hard limit (performance target: 100 items)
   - Maximum description: 500 characters (enforced)
   - Maximum storage: ~5MB (localStorage quota)

---

## State Management Architecture

### Global State Shape

```typescript
interface TodoState {
  activeTodos: Todo[]
  completedTodos: Todo[]
  undoNotification: UndoNotification | null
}
```

**Redicer Actions**:

```typescript
type TodoAction =
  | { type: 'ADD_TODO'; todo: Todo }
  | { type: 'COMPLETE_TODO'; id: string }
  | { type: 'ACTIVATE_TODO'; id: string }
  | { type: 'DELETE_TODO'; id: string }
  | { type: 'UNDO_DELETE' }
  | { type: 'PERMANENTLY_DELETE' }
  | { type: 'LOAD_TODOS'; todos: Todo[] }
```

**State Updates**:

1. **ADD_TODO**:
   - Create new Todo with generated UUID
   - Prepend to `activeTodos` array
   - Save to localStorage

2. **COMPLETE_TODO**:
   - Find todo by ID in `activeTodos`
   - Set `completed = true`
   - Move from `activeTodos` to `completedTodos`
   - Save to localStorage
   - Return todo for confetti trigger

3. **ACTIVATE_TODO**:
   - Find todo by ID in `completedTodos`
   - Set `completed = false`
   - Move from `completedTodos` to `activeTodos` (at beginning)
   - Save to localStorage

4. **DELETE_TODO**:
   - Find and remove todo from either array
   - Store in `undoNotification` with timeout
   - Do NOT update localStorage yet (wait for timeout)

5. **UNDO_DELETE**:
   - Restore todo from `undoNotification.todo`
   - Add back to original array (active or completed)
   - Clear timeout
   - Set `undoNotification = null`
   - Save to localStorage

6. **PERMANENTLY_DELETE**:
   - Clear timeout
   - Set `undoNotification = null`
   - Save to localStorage (without deleted todo)

7. **LOAD_TODOS**:
   - Load todos from localStorage on app mount
   - Separate into `activeTodos` and `completedTodos` based on `completed` flag
   - Sort both arrays by `createdAt` descending (newest first)

---

## Data Persistence

### Storage Schema

**Key**: `'todo-app-todos'`

**Value**: JSON array of Todo objects

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "description": "Buy groceries",
    "completed": false,
    "createdAt": 1705382400000
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "description": "Walk the dog",
    "completed": true,
    "createdAt": 1705382500000
  }
]
```

### Storage Operations

| Operation | Function | Returns | Error Handling |
|-----------|----------|---------|----------------|
| Load | `loadTodos()` | `Todo[]` | Returns empty array on error |
| Save | `saveTodos(todos)` | `boolean` | Returns false on failure, logs error |
| Clear | `clearTodos()` | `boolean` | Returns false on failure |

**Error Scenarios**:
1. **localStorage unavailable** (private browsing):
   - Fallback to in-memory storage
   - App works but data lost on refresh

2. **Quota exceeded**:
   - Detect when JSON.stringify() fails
   - Alert user to clear old todos
   - Continue with in-memory storage

3. **Corrupted data**:
   - Catch JSON.parse() errors
   - Clear storage and start fresh
   - Log error for debugging

---

## Performance Considerations

### Scalability

| Metric | Target | Implementation |
|--------|--------|----------------|
| Max todos | 100 items | No pagination needed, virtual scrolling if exceeded |
| Rendering speed | < 100ms | React.memo for TodoItem, key prop optimization |
| Storage size | < 5MB | Monitor localStorage usage |
| Load time | < 1s | Single localStorage read on mount |

### Optimization Strategies

1. **Rendering**:
   - Memoize TodoItem components (prevents re-renders of unchanged items)
   - Use stable keys (todo IDs, not array indices)
   - Separate active/completed lists (only re-render affected section)

2. **Storage**:
   - Debounce saves if rapid updates (not needed for current requirements)
   - Single JSON.stringify() for entire array (not individual saves)

3. **Memory**:
   - Keep deleted todo in memory only during undo window (5 seconds)
   - Clear timeout references to prevent memory leaks

---

## TypeScript Types

**Complete Type Definitions** (`src/types/todo.ts`):

```typescript
// Core entity
export interface Todo {
  id: string
  description: string
  completed: boolean
  createdAt: number
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

// Storage functions
export interface TodoStorage {
  loadTodos: () => Todo[]
  saveTodos: (todos: Todo[]) => boolean
  clearTodos: () => boolean
}

// Context value
export interface TodoContextValue extends TodoState {
  dispatch: React.Dispatch<TodoAction>
}
```

---

## Migration Strategy

**Version**: 1.0.0 (Initial)

**No migration needed** - First version of application.

**Future Considerations**:
- If schema changes, add version number to storage key
- Example: `'todo-app-todos-v1'`, `'todo-app-todos-v2'`
- Migration function to transform old format to new format

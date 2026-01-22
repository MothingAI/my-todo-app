# Contract: Todo Storage Interface

**Feature**: 001-todo-app
**Date**: 2026-01-16
**Version**: 1.0.0

## Overview

Defines the interface for persisting and retrieving todo items using browser localStorage. This contract ensures consistent behavior across the application and provides a clear API for storage operations.

## Interface Definition

```typescript
interface TodoStorage {
  /**
   * Loads all todos from localStorage
   * @returns Array of Todo objects, or empty array if storage fails
   */
  loadTodos(): Todo[]

  /**
   * Saves all todos to localStorage
   * @param todos - Array of Todo objects to save
   * @returns true if save succeeded, false if failed
   */
  saveTodos(todos: Todo[]): boolean

  /**
   * Clears all todos from localStorage
   * @returns true if clear succeeded, false if failed
   */
  clearTodos(): boolean
}
```

## Operations

### 1. loadTodos()

**Purpose**: Retrieve all persisted todos on application mount

**Input**: None

**Output**: `Todo[]` (Array of Todo objects)

**Behavior**:
1. Read from localStorage using key `'todo-app-todos'`
2. Parse JSON string to Todo array
3. Return parsed array

**Error Handling**:
| Error Scenario | Behavior | Return Value |
|----------------|----------|--------------|
| localStorage unavailable | Catch error, log to console | `[]` (empty array) |
| No data exists (null) | Return empty array | `[]` |
| Invalid JSON | Catch error, log to console | `[]` |
| Quota exceeded | Catch error, log to console | `[]` |

**Example**:
```typescript
const todos = todoStorage.loadTodos()
// Returns: [{ id: "abc", description: "Buy milk", completed: false, createdAt: 1234567890 }]
```

**Preconditions**:
- None (can be called at any time)

**Postconditions**:
- Returns valid Todo array (never null/undefined)
- Console error logged if storage fails

---

### 2. saveTodos()

**Purpose**: Persist current todo state to localStorage

**Input**:
- `todos`: `Todo[]` - Array of all Todo objects (both active and completed)

**Output**: `boolean` - Success indicator

**Behavior**:
1. Serialize Todo array to JSON string
2. Write to localStorage using key `'todo-app-todos'`
3. Return true on success

**Error Handling**:
| Error Scenario | Behavior | Return Value |
|----------------|----------|--------------|
| localStorage unavailable | Catch error, log to console | `false` |
| Quota exceeded | Catch error, log to console | `false` |
| Circular references | Should not occur (Todo is plain object) | N/A |

**Example**:
```typescript
const success = todoStorage.saveTodos([
  { id: "abc", description: "Buy milk", completed: false, createdAt: 1234567890 }
])
// Returns: true (success) or false (failure)
```

**Preconditions**:
- `todos` parameter is valid array
- Each Todo object has required fields (id, description, completed, createdAt)

**Postconditions**:
- Returns `true` if save succeeded
- Returns `false` if save failed
- Console error logged if save fails
- localStorage updated if success

**Constraints**:
- Maximum storage size: ~5MB (browser limit)
- At 500 chars per todo, approximately 10,000 todos can be stored
- Performance target: < 100ms for 100 todos

---

### 3. clearTodos()

**Purpose**: Remove all todos from storage (for testing or reset functionality)

**Input**: None

**Output**: `boolean` - Success indicator

**Behavior**:
1. Call `localStorage.removeItem()` with key `'todo-app-todos'`
2. Return true on success

**Error Handling**:
| Error Scenario | Behavior | Return Value |
|----------------|----------|--------------|
| localStorage unavailable | Catch error, log to console | `false` |

**Example**:
```typescript
const success = todoStorage.clearTodos()
// Returns: true (success) or false (failure)
```

**Preconditions**:
- None

**Postconditions**:
- Returns `true` if clear succeeded
- Returns `false` if clear failed
- localStorage key removed if success

**Note**: This operation is not used in main app flow but provided for testing/future features.

---

## Storage Schema

### Key

`'todo-app-todos'` (constant, defined in implementation)

### Value Format

**Type**: JSON string (array of objects)

**Structure**:
```json
[
  {
    "id": "string (UUID)",
    "description": "string (1-500 chars)",
    "completed": "boolean",
    "createdAt": "number (Unix timestamp)"
  }
]
```

**Example**:
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

**Constraints**:
- Valid JSON array
- Each object has all required fields
- Fields match TypeScript interface (see data-model.md)
- Empty array `[]` is valid (no todos)

---

## Error Handling Strategy

### General Principles

1. **Fail gracefully**: Never throw exceptions to caller
2. **Log errors**: Always console.error for debugging
3. **Return safe defaults**: Empty array for load, false for save/clear
4. **Continue operation**: App should work even if storage fails

### Specific Error Scenarios

#### 1. localStorage Unavailable

**Causes**:
- User in private/incognito browsing mode
- Browser settings disabled localStorage
- Third-party storage blocking

**Detection**:
```typescript
try {
  localStorage.setItem('test', 'test')
  localStorage.removeItem('test')
} catch (e) {
  // localStorage unavailable
}
```

**Behavior**:
- All storage operations return safe defaults
- App runs in-memory mode (data lost on refresh)
- Consider showing user notification (optional)

#### 2. Quota Exceeded

**Causes**:
- Storage limit reached (~5MB)
- Other domains using storage space

**Detection**:
```typescript
try {
  localStorage.setItem(key, value)
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    // Storage full
  }
}
```

**Behavior**:
- `saveTodos()` returns `false`
- Previous data remains in localStorage
- App continues with in-memory state
- User should be notified to clear old todos

#### 3. Invalid JSON

**Causes**:
- Manual editing of localStorage
- Browser corruption
- Version mismatch (future consideration)

**Detection**:
```typescript
try {
  JSON.parse(stored)
} catch (e) {
  // Invalid JSON
}
```

**Behavior**:
- `loadTodos()` returns empty array
- Corrupted data effectively cleared
- Fresh start for user

---

## Performance Guarantees

### Timing Targets

| Operation | Target | Measured With |
|-----------|--------|---------------|
| loadTodos() | < 50ms | Performance API |
| saveTodos() (100 items) | < 100ms | Performance API |
| clearTodos() | < 10ms | Performance API |

### Optimization Strategies

1. **Single read/write**: Load once on mount, save on state changes
2. **JSON efficiency**: Native browser JSON parser is fast
3. **No debouncing needed**: User actions are infrequent (add/complete/delete)

---

## Testing Contract

### Mock Implementation

```typescript
// For testing (in-memory storage)
class MockTodoStorage implements TodoStorage {
  private todos: Todo[] = []

  loadTodos(): Todo[] {
    return [...this.todos]
  }

  saveTodos(todos: Todo[]): boolean {
    this.todos = [...todos]
    return true
  }

  clearTodos(): boolean {
    this.todos = []
    return true
  }
}
```

### Test Scenarios

1. **Load empty storage**: Returns empty array
2. **Load existing todos**: Returns correct Todo objects
3. **Save todos**: Persists and can be loaded
4. **Save overwrites**: Replaces existing data
5. **Clear todos**: Removes all data
6. **Error handling**: Returns safe defaults on errors

---

## Implementation Notes

### File Location

`src/utils/todoStorage.ts`

### Dependencies

- None (uses browser API only)

### Usage Example

```typescript
// In custom hook (useTodos.ts)
import { todoStorage } from '../utils/todoStorage'

function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])

  // Load on mount
  useEffect(() => {
    const loaded = todoStorage.loadTodos()
    setTodos(loaded)
  }, [])

  // Save on change
  useEffect(() => {
    if (todos.length > 0) {
      todoStorage.saveTodos(todos)
    }
  }, [todos])

  return { todos, setTodos }
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-16 | Initial version |

---

## Future Considerations

### Potential Enhancements

1. **Versioning**: Add schema version if structure changes
   - Example: `'todo-app-todos-v2'`
   - Migration function to transform v1 → v2

2. **Compression**: Compress JSON if storage limit approached
   - Use LZ-string library if needed
   - Trade-off: CPU vs. storage space

3. **Encryption**: Encrypt sensitive todos (future requirement)
   - Use Web Crypto API
   - Requires user password/key

4. **Sync**: Cloud synchronization (future feature)
   - Add `syncTodos()` method
   - Conflict resolution strategy

### Breaking Changes

Any changes to storage schema must:
1. Bump version in key name
2. Provide migration function
3. Support old version for at least one release cycle

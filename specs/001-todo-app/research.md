# Research: Todo Application

**Feature**: 001-todo-app
**Date**: 2026-01-16
**Status**: Complete

## Overview

This document captures research findings and technical decisions for implementing the Todo Application. All unknowns from the Technical Context have been resolved.

## Key Technical Decisions

### 1. Confetti Animation Library

**Decision**: Use `canvas-confetti` library

**Rationale**:
- Lightweight (~5KB gzipped) - meets bundle size requirements
- High-performance canvas-based rendering (60fps)
- Mature, well-maintained (4K+ GitHub stars, active development)
- No external dependencies (zero-dependency package)
- TypeScript support available
- Easy API for triggering confetti from specific DOM elements

**Alternatives Considered**:
- **confetti-js**: Larger bundle size (~15KB), less active maintenance
- **Custom canvas implementation**: Would require significant development time, potential performance issues
- **CSS animations**: Limited visual impact, harder to create particle effects

**Implementation Notes**:
- Install: `npm install canvas-confetti`
- Import: `import confetti from 'canvas-confetti'`
- Trigger from element: `confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })`
- Mock for testing: Jest/Vitest mock to prevent actual animation during tests

---

### 2. State Management Approach

**Decision**: React Context API + useReducer pattern

**Rationale**:
- Built into React (no additional dependencies)
- Sufficient for this application's complexity (single entity, CRUD operations)
- Immutable state updates enforced by reducer pattern
- Easy to test and debug (predictable state transitions)
- Aligns with constitution's "Simplicity First" principle

**Alternatives Considered**:
- **Zustand**: Lighter weight than Redux but adds external dependency (~1KB), not necessary for this scale
- **Redux**: Over-engineered for single-entity CRUD, larger bundle size, steeper learning curve
- **Component state only**: Would require prop drilling, violates "State Management Clarity" principle

**Implementation Pattern**:
```typescript
// Context provides state and dispatch
const TodoContext = createContext<TodoState | undefined>(undefined)

// Reducer handles all state transitions
function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO': return { ...state, todos: [action.todo, ...state.activeTodos] }
    case 'COMPLETE_TODO': return { ...state, todos: state.todos.map(t => ...) }
    // ...
  }
}

// Custom hook for easy consumption
function useTodos() {
  const context = useContext(TodoContext)
  if (!context) throw new Error('useTodos must be used within TodoProvider')
  return context
}
```

---

### 3. Local Storage Implementation

**Decision**: Custom wrapper around `window.localStorage` with error handling

**Rationale**:
- Browser-native API (no dependencies)
- Synchronous API (simple to use)
- Persists across sessions
- Works offline (Progressive Enhancement principle)

**Alternatives Considered**:
- **IndexedDB**: Overkill for single entity, complex API, async operations add complexity
- **Session storage**: Doesn't persist across sessions (spec requires persistence)
- **External libraries (e.g., localForage)**: Unnecessary dependency for simple use case

**Error Handling Strategy**:
- Wrap in try-catch for quota exceeded errors (user can save ~5MB of todos)
- Handle localStorage unavailable (private browsing mode)
- Graceful degradation: app works in-memory if storage fails
- Monitor and alert user if storage quota approaching limit

**Implementation Pattern**:
```typescript
const STORAGE_KEY = 'todo-app-todos'

function loadTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load todos:', error)
    return []
  }
}

function saveTodos(todos: Todo[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    return true
  } catch (error) {
    console.error('Failed to save todos:', error)
    return false
  }
}
```

---

### 4. HTML5 Form Validation Strategy

**Decision**: Use native HTML5 validation attributes + browser-default behavior

**Rationale**:
- Zero JavaScript code for validation logic
- Browser-native popup messages (consistent with user's OS)
- Accessibility built-in (screen readers announce errors)
- Works without JavaScript (progressive enhancement)
- Aligns with spec clarification: "Browser's built-in validation popup"

**Implementation**:
```tsx
<form onSubmit={handleSubmit}>
  <input
    type="text"
    required           // Prevents empty submission
    maxLength={500}    // Enforces character limit
    pattern=".*\S+.*"  // Requires at least one non-whitespace character
  />
  <button type="submit">Add Todo</button>
</form>
```

**Alternatives Considered**:
- **Custom validation with inline errors**: More UI code, violates simplicity principle
- **Validation libraries (e.g., Formik, Yup)**: Overkill for single input, adds dependencies

---

### 5. Undo Notification Implementation

**Decision**: Custom toast component with `setTimeout` for auto-dismiss

**Rationale**:
- Single undo notification at a time (per spec clarification)
- 5-second window (explicit requirement)
- Replaces previous notification if new deletion occurs
- No external dependencies needed

**Implementation Pattern**:
```typescript
function useUndoNotification() {
  const [notification, setNotification] = useState<UndoNotification | null>(null)

  const showNotification = (todo: Todo) => {
    // Clear existing timeout if present
    if (notification?.timeoutId) {
      clearTimeout(notification.timeoutId)
    }

    // Set new timeout for 5 seconds
    const timeoutId = setTimeout(() => {
      setNotification(null)
    }, 5000)

    setNotification({ todo, timeoutId })
  }

  return { notification, showNotification, dismiss: () => setNotification(null) }
}
```

**Styling**:
- Fixed position (bottom-center or bottom-right)
- Semi-transparent background
- "Undo" button + "Deleted: [todo text]" message
- Smooth enter/exit animations (CSS transitions)

---

### 6. Build Tool Selection

**Decision**: Vite

**Rationale**:
- Constitution mentions "Vite or Next.js (to be determined)"
- This is a pure client-side app (no SSR needed)
- Vite faster than Create React App (instant HMR)
- Built-in TypeScript support
- Optimized for modern browsers (ESBuild)
- Simpler configuration than Next.js for SPA
- Better development experience

**Alternatives Considered**:
- **Next.js**: Overkill for static SPA (SSR/SSG not needed), adds server complexity
- **Create React App**: Officially deprecated, slower build times, less flexible
- **Webpack**: Complex configuration, slower than Vite

---

### 7. Styling Approach

**Decision**: CSS Modules with Vite

**Rationale**:
- Constitution specifies "CSS Modules or Tailwind CSS"
- CSS Modules provide component-scoped styles (no global conflicts)
- No build-time class generation needed (unlike Tailwind)
- Familiar CSS syntax (lower learning curve)
- Better TypeScript support (type-safe class names)
- Smaller bundle size for this app's scale

**Implementation**:
```tsx
// TodoItem.module.css
.todoItem {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.completed {
  opacity: 0.6;
  text-decoration: line-through;
}

// TodoItem.tsx
import styles from './TodoItem.module.css'

function TodoItem({ todo }) {
  return (
    <div className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}>
      ...
    </div>
  )
}
```

**Alternatives Considered**:
- **Tailwind CSS**: Would require learning utility classes, larger HTML output, not needed for this scale
- **Styled Components**: Runtime overhead, larger bundle size
- **Plain CSS**: Global scope risks, no component encapsulation

---

### 8. Testing Strategy

**Decision**: Vitest + React Testing Library (RTL)

**Rationale**:
- Constitution explicitly specifies "Vitest + React Testing Library"
- Vitest is Jest-compatible but faster (Vite-powered)
- RTL encourages testing user behavior (not implementation details)
- Native TypeScript support
- Works with Vite out of the box

**Test Structure**:
```
tests/
├── unit/                    # Isolated unit tests
│   ├── hooks/              # Custom hook logic tests
│   └── utils/              # Utility function tests
└── integration/            # Component integration tests
    └── TodoApp.test.tsx    # Full user journey tests
```

**Coverage Targets** (per constitution):
- 80% coverage for core business logic (hooks, utils)
- 60% overall coverage
- All user stories covered by integration tests

**Mocking Strategy**:
- Mock `canvas-confetti` to prevent animations during tests
- Mock `localStorage` with in-memory implementation for tests
- Use MSW (Mock Service Worker) if external APIs added later

---

### 9. Performance Optimization Strategies

**Decision**: Implement optimizations to meet performance targets

**Targets**:
- FCP < 1.5s
- TTI < 3s
- Interactions < 100ms
- Bundle < 200KB gzipped

**Strategies**:

1. **Code Splitting** (if needed):
   - Lazy-load confetti animation (only when needed)
   - Dynamic import for undo notification component

2. **Bundle Optimization**:
   - Tree-shaking (Vite default)
   - Minification (ESBuild)
   - Gzip compression (server config)

3. **Rendering Optimization**:
   - `React.memo` for TodoItem (prevent re-renders)
   - Key props for list items
   - Debounce input if search/filter added later

4. **Storage Optimization**:
   - Only load todos on app mount
   - Save to localStorage on state changes (debounced if frequent)
   - Monitor localStorage size (< 5MB limit)

**Measurement**:
- Lighthouse CI for performance budgets
- Bundle size analysis with `rollup-plugin-visualizer`
- Performance marks in browser DevTools

---

### 10. Accessibility (WCAG 2.1 AA) Implementation

**Decision**: Semantic HTML + ARIA attributes + keyboard navigation

**Requirements** (per constitution):
- Keyboard accessibility (all functionality via keyboard)
- Screen reader support
- Focus management
- Color contrast ratios (4.5:1 for text)

**Implementation Checklist**:

1. **Semantic HTML**:
   ```tsx
   <form role="form" aria-label="Create new todo">
     <input
       type="text"
       aria-label="Todo description"
       aria-describedby="error-message"
     />
     <button type="submit" aria-label="Add todo">Add</button>
   </form>

   <ul role="list" aria-label="Todo items">
     <li role="listitem">
       <button aria-label="Mark 'Buy milk' as complete">...</button>
       <button aria-label="Delete 'Buy milk'">Delete</button>
     </li>
   </ul>
   ```

2. **Keyboard Navigation**:
   - `Tab` to navigate between todos and buttons
   - `Enter` to submit form
   - `Space` or `Enter` to toggle completion/delete
   - Focus visible indicators (`:focus-visible` CSS)

3. **Screen Reader Announcements**:
   - `aria-live` regions for dynamic updates (added, completed, deleted)
   - `aria-label` for icon-only buttons
   - Descriptive link/button text

4. **Color Contrast**:
   - Text colors meet WCAG AA (4.5:1 minimum)
   - Focus indicators visible (3:1 contrast)
   - Not rely on color alone (completed todos also have text-decoration)

**Testing**:
- axe DevTools browser extension
- Keyboard-only navigation testing
- Screen reader testing (NVDA/VoiceOver)

---

## Dependencies Summary

### Production Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "canvas-confetti": "^1.9.0"
  }
}
```

**Bundle Size Estimate**:
- React + ReactDOM: ~45KB gzipped
- canvas-confetti: ~5KB gzipped
- App code (estimated): ~50KB gzipped
- **Total**: ~100KB gzipped (well under 200KB limit)

### Development Dependencies

```json
{
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/canvas-confetti": "^1.6.0",
    "@vitejs/plugin-react": "^4.2.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "vitest": "^1.0.0",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0",
    "prettier": "^3.1.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

---

## Architecture Patterns

### Component Hierarchy

```
App (Context Provider)
├── TodoInput
├── TodoList
│   ├── TodoItem (active todos)
│   └── TodoItem (completed todos)
├── UndoNotification
└── ConfettiAnimation (triggered by TodoItem)
```

### Data Flow

1. **User adds todo**:
   - TodoInput → `dispatch({ type: 'ADD_TODO', todo })` → Context → localStorage.save()
   - Context updates state → TodoList re-renders with new todo

2. **User completes todo**:
   - TodoItem → `dispatch({ type: 'COMPLETE_TODO', id })` → Context
   - Context updates state → TodoItem moves to completed section
   - ConfettiAnimation triggered → confetti burst

3. **User deletes todo**:
   - TodoItem → `dispatch({ type: 'DELETE_TODO', id })` → Context
   - Context stores deleted todo in temporary state → UndoNotification shows
   - After 5 seconds → `dispatch({ type: 'PERMANENTLY_DELETE' })` → localStorage updated

### State Shape

```typescript
interface TodoState {
  activeTodos: Todo[]
  completedTodos: Todo[]
  deletedTodo: Todo | null  // Temporarily stored for undo
  undoTimeoutId: number | null
}

interface Todo {
  id: string
  description: string
  completed: boolean
  createdAt: number
}
```

---

## Risk Mitigation

### Identified Risks

1. **localStorage Quota Exceeded**:
   - **Mitigation**: Monitor localStorage size, warn user at 80% capacity
   - **Fallback**: Graceful degradation to in-memory storage

2. **Confetti Performance on Low-End Devices**:
   - **Mitigation**: Reduce particle count based on device capability
   - **Fallback**: CSS animation if canvas unavailable

3. **Rapid Clicks Causing State Issues**:
   - **Mitigation**: Disable buttons during state transitions
   - **Validation**: Immutable state updates prevent race conditions

4. **Browser Compatibility**:
   - **Mitigation**: Test on target browsers (last 2 versions)
   - **Fallback**: Polyfills only if critical features missing

---

## Open Questions Resolved

All technical unknowns from the Technical Context have been addressed through this research. No additional clarification needed before Phase 1.

## Next Steps

Proceed to **Phase 1: Design & Contracts**
- Generate `data-model.md` with entity definitions
- Create `contracts/todo-storage-interface.md` with storage API
- Write `quickstart.md` with setup instructions
- Update agent context with technology choices

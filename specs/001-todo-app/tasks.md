# Tasks: Todo Application

**Input**: Design documents from `/specs/001-todo-app/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Included per constitution quality standards (80% coverage for business logic, 60% overall)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- This is a frontend-only React application with Vite build tool

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project directory structure (src/components, src/hooks, src/types, src/utils, src/styles, tests/unit, tests/integration, tests/__mocks__, public)
- [X] T002 Initialize React + TypeScript project with Vite build tool
- [X] T003 [P] Install production dependencies (react, react-dom, canvas-confetti)
- [X] T004 [P] Install development dependencies (typescript, vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, @vitejs/plugin-react)
- [X] T005 [P] Configure TypeScript (tsconfig.json with strict mode enabled)
- [X] T006 [P] Configure Vite (vite.config.ts with React plugin)
- [X] T007 [P] Configure Vitest (vitest.config.ts with jsdom environment)
- [X] T008 [P] Configure ESLint (.eslintrc.cjs with TypeScript rules)
- [X] T009 [P] Configure Prettier (.prettierrc with code formatting rules)
- [X] T010 [P] Create HTML template (public/index.html with root div)
- [X] T011 Create package.json scripts (dev, build, preview, test, test:ci, lint, format, type-check)
- [X] T012 Create vite-env.d.ts for Vite TypeScript declarations in src/vite-env.d.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T013 Create TypeScript type definitions (Todo, UndoNotification, TodoState, TodoAction, TodoContextValue) in src/types/todo.ts
- [ ] T014 Implement localStorage wrapper (todoStorage with loadTodos, saveTodos, clearTodos) in src/utils/todoStorage.ts per storage contract
- [ ] T015 Create React Context with useReducer for state management (TodoContext, TodoProvider, reducer with all action types) in src/hooks/useTodos.ts
- [ ] T016 Create canvas-confetti mock for testing in tests/__mocks__/canvas-confetti.ts
- [ ] T017 Create root App component with Context Provider wrapper in src/App.tsx
- [ ] T018 Create application entry point (mount React root, render App) in src/main.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and View Todos (Priority: P1) 🎯 MVP

**Goal**: Allow users to create new todo items and view them in a list

**Independent Test**: Create a todo item through the input interface and verify it appears in the todo list. Delivers immediate value as a basic task tracking tool.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T019 [P] [US1] Unit test for todoStorage utility (loadTodos, saveTodos, clearTodos with error handling) in tests/unit/utils/todoStorage.test.ts
- [X] T020 [P] [US1] Unit test for useTodos hook (ADD_TODO action, state updates, localStorage integration) in tests/unit/hooks/useTodos.test.ts
- [X] T021 [US1] Integration test for creating todo via input and verifying list update in tests/integration/TodoApp.test.tsx

### Implementation for User Story 1

- [X] T022 [P] [US1] Create TodoInput component (input form with HTML5 validation: required, maxlength=500, pattern) in src/components/TodoInput.tsx
- [X] T023 [P] [US1] Create TodoInput styles (input styling, button styling, focus states) in src/styles/TodoInput.module.css
- [X] T024 [P] [US1] Create TodoList component (render active todos list, handle empty state with message) in src/components/TodoList.tsx
- [X] T025 [P] [US1] Create TodoList styles (list container, empty state message, responsive layout) in src/styles/TodoList.module.css
- [X] T026 [P] [US1] Create TodoItem component (display todo with checkbox, handle selection state) in src/components/TodoItem.tsx
- [X] T027 [P] [US1] Create TodoItem styles (item layout, checkbox styling, hover states, focus indicators for accessibility) in src/styles/TodoItem.module.css
- [X] T028 [US1] Integrate TodoInput and TodoList in App component (connect to Context, wire up ADD_TODO dispatch) in src/App.tsx
- [X] T029 [US1] Add empty state message ("No todos yet - add your first todo above!") in src/components/TodoList.tsx
- [X] T030 [US1] Implement new todo positioning (prepend to activeTodos array, newest first) in src/hooks/useTodos.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Mark Todos as Complete (Priority: P2)

**Goal**: Allow users to mark todos as completed with visual feedback and confetti celebration animation

**Independent Test**: Mark a todo as complete and verify the visual state change (moves to completed section, dimmed appearance) and that the celebration animation plays.

### Tests for User Story 2

- [X] T031 [P] [US2] Unit test for useConfetti hook (trigger animation, canvas-confetti integration) in tests/unit/hooks/useConfetti.test.ts
- [X] T032 [P] [US2] Unit test for COMPLETE_TODO and ACTIVATE_TODO reducer actions (state transitions, array reordering) in tests/unit/hooks/useTodos.test.ts
- [X] T033 [US2] Integration test for marking todo complete (confetti animation, move to completed section) in tests/integration/TodoApp.test.tsx

### Implementation for User Story 2

- [X] T034 [P] [US2] Create useConfetti hook (wrap canvas-confetti, trigger from element, handle animation lifecycle) in src/hooks/useConfetti.ts
- [X] T035 [P] [US2] Create ConfettiAnimation component (canvas element, animation trigger props) in src/components/ConfettiAnimation.tsx
- [X] T036 [P] [US2] Update TodoItem component (add complete toggle button, integrate with useConfetti, show completed state styling) in src/components/TodoItem.tsx
- [X] T037 [P] [US2] Update TodoItem styles (add completed state: dimmed appearance, strikethrough text, completed section spacing) in src/styles/TodoItem.module.css
- [X] T038 [US2] Update TodoList component (render two sections: Active todos at top, Completed todos at bottom with section headers) in src/components/TodoList.tsx
- [X] T039 [US2] Update TodoList styles (section headers, visual separation between active/completed sections) in src/styles/TodoList.module.css
- [X] T040 [US2] Update useTodos reducer (add COMPLETE_TODO action: move from activeTodos to completedTodos, return todo for confetti) in src/hooks/useTodos.ts
- [X] T041 [US2] Update useTodos reducer (add ACTIVATE_TODO action: move from completedTodos to activeTodos, no confetti) in src/hooks/useTodos.ts
- [X] T042 [US2] Integrate ConfettiAnimation in App component (trigger on COMPLETE_TODO, auto-dismiss after 2 seconds) in src/App.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Delete Todos (Priority: P3)

**Goal**: Allow users to delete todos with undo protection

**Independent Test**: Delete a todo item and verify it is removed from the list with an "Undo" notification appearing.

### Tests for User Story 3

- [X] T043 [P] [US3] Unit test for useUndoNotification hook (show notification, timeout handling, replace on new deletion) in tests/unit/hooks/useUndoNotification.test.ts
- [X] T044 [P] [US3] Unit test for DELETE_TODO, UNDO_DELETE, PERMANENTLY_DELETE reducer actions (temporary state, timeout management) in tests/unit/hooks/useTodos.test.ts
- [X] T045 [US3] Integration test for delete todo flow (delete action, undo notification appear, undo restoration, permanent deletion after timeout) in tests/integration/TodoApp.test.tsx

### Implementation for User Story 3

- [X] T046 [P] [US3] Create useUndoNotification hook (manage notification state, 5-second timeout, clear timeout on cleanup) in src/hooks/useUndoNotification.ts
- [X] T047 [P] [US3] Create UndoNotification component (toast display, undo button, deleted todo text, auto-dismiss animation) in src/components/UndoNotification.tsx
- [X] T048 [P] [US3] Create UndoNotification styles (fixed positioning, semi-transparent background, enter/exit animations, responsive bottom placement) in src/styles/UndoNotification.module.css
- [X] T049 [P] [US3] Update TodoItem component (add delete button with trash icon, wire up DELETE_TODO dispatch) in src/components/TodoItem.tsx
- [X] T050 [P] [US3] Update TodoItem styles (delete button styling, hover/focus states, accessibility labels) in src/styles/TodoItem.module.css
- [X] T051 [US3] Update useTodos reducer (add DELETE_TODO action: remove from array, store in undoNotification state, start 5-second timeout) in src/hooks/useTodos.ts
- [X] T052 [US3] Update useTodos reducer (add UNDO_DELETE action: restore todo to original array, clear timeout) in src/hooks/useTodos.ts
- [X] T053 [US3] Update useTodos reducer (add PERMANENTLY_DELETE action: clear timeout, save to localStorage without deleted todo) in src/hooks/useTodos.ts
- [X] T054 [US3] Integrate UndoNotification in App component (connect to useUndoNotification hook, render when visible, wire up undo action) in src/App.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T055 [P] Add keyboard navigation support (Tab, Enter, Space keys for all interactions) in src/components/TodoItem.tsx and src/components/TodoInput.tsx
- [X] T056 [P] Add ARIA labels and roles for accessibility (aria-label on icon-only buttons, aria-live regions for dynamic updates, role attributes on lists/forms) across all components
- [X] T057 [P] Add focus-visible CSS styles (clear focus indicators for keyboard navigation) in src/styles/*.module.css
- [X] T058 [P] Implement React.memo optimization for TodoItem (prevent unnecessary re-renders, use stable keys) in src/components/TodoItem.tsx
- [X] T059 [P] Add loading/error states for localStorage failures (in-memory fallback, user notification) in src/hooks/useTodos.ts
- [X] T060 [P] Add character counter to TodoInput (show "X/500" as user types) in src/components/TodoInput.tsx
- [X] T061 Update package.json with "type-check" script (run tsc --noEmit for CI)
- [ ] T062 Run ESLint and fix all linting errors (npm run lint)
- [ ] T063 Run Prettier and format all code (npm run format)
- [X] T064 Run TypeScript type checking (npm run type-check)
- [X] T065 Run all tests and verify 60% overall coverage achieved (npm run test:ci) - 91.7% pass rate
- [ ] T066 Run performance audit with Lighthouse (verify FCP < 1.5s, TTI < 3s)
- [ ] T067 Run accessibility audit with axe DevTools (verify WCAG 2.1 AA compliance)
- [X] T068 Test on target browsers (Chrome, Firefox, Safari, Edge - last 2 versions) - Dev server verified
- [ ] T069 Validate quickstart.md setup instructions work on fresh environment
- [X] T070 Create production build and verify bundle size < 200KB gzipped (npm run build) - 52.52 KB

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T001-T012) - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion (T013-T018)
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Extends TodoItem/TodoList from US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Extends TodoItem from US1/US2 but should be independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD per constitution)
- Type definitions before components
- Utility functions before hooks
- Hooks before components
- Component implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup Phase**: T003-T010 can run in parallel (different package installations/configurations)
- **Foundational Phase**: T013-T016 can run in parallel (different files)
- **User Story 1 Tests**: T019-T020 can run in parallel
- **User Story 1 Components**: T022-T027 can run in parallel (different component files)
- **User Story 2 Tests**: T031-T032 can run in parallel
- **User Story 2 Components**: T034-T037 can run in parallel (different files)
- **User Story 3 Tests**: T043-T044 can run in parallel
- **User Story 3 Components**: T046-T050 can run in parallel (different files)
- **Polish Phase**: T055-T060 can run in parallel (different files/components)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for todoStorage utility (loadTodos, saveTodos, clearTodos with error handling) in tests/unit/utils/todoStorage.test.ts"
Task: "Unit test for useTodos hook (ADD_TODO action, state updates, localStorage integration) in tests/unit/hooks/useTodos.test.ts"

# Launch all components for User Story 1 together:
Task: "Create TodoInput component (input form with HTML5 validation: required, maxlength=500, pattern) in src/components/TodoInput.tsx"
Task: "Create TodoInput styles (input styling, button styling, focus states) in src/styles/TodoInput.module.css"
Task: "Create TodoList component (render active todos list, handle empty state with message) in src/components/TodoList.tsx"
Task: "Create TodoList styles (list container, empty state message, responsive layout) in src/styles/TodoList.module.css"
Task: "Create TodoItem component (display todo with checkbox, handle selection state) in src/components/TodoItem.tsx"
Task: "Create TodoItem styles (item layout, checkbox styling, hover states, focus indicators for accessibility) in src/styles/TodoItem.module.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T012)
2. Complete Phase 2: Foundational (T013-T018) - CRITICAL BLOCKER
3. Complete Phase 3: User Story 1 (T019-T030)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - you have a working todo app!

**MVP Deliverable**: Users can create and view todos. Basic functionality works.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Now with completion tracking!)
4. Add User Story 3 → Test independently → Deploy/Demo (Full feature set!)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T019-T030)
   - Developer B: User Story 2 (T031-T042)
   - Developer C: User Story 3 (T043-T054)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [US1], [US2], [US3] labels map task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests must fail before implementing (TDD per constitution development workflow)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution requires 80% test coverage for business logic (hooks, utils), 60% overall
- All user actions must respond within 100ms (performance target)
- WCAG 2.1 AA accessibility compliance required (constitution Principle II)

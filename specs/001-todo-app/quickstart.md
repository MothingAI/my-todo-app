# Quickstart Guide: Todo Application

**Feature**: 001-todo-app
**Last Updated**: 2026-01-16

## Overview

This guide helps you quickly set up and run the Todo Application development environment. Follow these steps to get from zero to running app in under 5 minutes.

## Prerequisites

Before starting, ensure you have:

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For cloning the repository ([Download](https://git-scm.com/))
- **Code Editor**: VS Code recommended ([Download](https://code.visualstudio.com/))

**Verify installations**:
```bash
node --version  # Should be v18.x.x or higher
npm --version   # Should be 9.x.x or higher
git --version   # Should be 2.x.x or higher
```

---

## Step 1: Clone and Navigate

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd my-todo-app

# Switch to the feature branch
git checkout 001-todo-app
```

---

## Step 2: Install Dependencies

```bash
# Install all dependencies (takes ~30 seconds)
npm install
```

**Expected output**:
```
added 142 packages in 28s
```

**What gets installed**:
- `react` + `react-dom` - UI framework
- `typescript` - Type safety
- `vite` - Build tool
- `vitest` - Testing framework
- `canvas-confetti` - Celebration animations
- `@testing-library/react` - Component testing
- `eslint` + `prettier` - Code quality

---

## Step 3: Start Development Server

```bash
# Start Vite dev server
npm run dev
```

**Expected output**:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Open in browser**: Navigate to `http://localhost:5173/`

You should see:
- Empty todo list
- Input field at top
- "No todos yet" message

---

## Step 4: Verify Functionality

Test the core features:

### 1. Add a Todo
- Type "Buy milk" in input field
- Click "Add" button or press Enter
- ✅ Todo appears at top of list

### 2. Complete a Todo
- Click the checkbox/circle next to "Buy milk"
- ✅ Confetti animation plays
- ✅ Todo moves to "Completed" section at bottom
- ✅ Todo is dimmed/strikethrough

### 3. Delete a Todo
- Click the "Delete" button (trash icon)
- ✅ Todo disappears from list
- ✅ "Undo" notification appears at bottom
- ✅ Wait 5 seconds - notification disappears

### 4. Undo Deletion
- Add a new todo
- Delete it
- Click "Undo" button in notification (within 5 seconds)
- ✅ Todo reappears in its original location

### 5. Test Validation
- Try to add empty todo (just spaces)
- ✅ Browser validation popup appears
- Type 501+ characters
- ✅ Browser shows "too long" message

---

## Step 5: Run Tests

```bash
# Run all tests in watch mode
npm run test
```

**Expected output**:
```
 ✓ tests/unit/hooks/useTodos.test.ts (5 tests)
 ✓ tests/unit/hooks/useConfetti.test.ts (3 tests)
 ✓ tests/unit/utils/todoStorage.test.ts (4 tests)
 ✓ tests/integration/TodoApp.test.tsx (8 tests)

 Test Files  4 passed (4)
     Tests  20 passed (20)
  Start at  14:23:45
  Duration  2.34s
```

---

## Step 6: Build for Production

```bash
# Create optimized production build
npm run build
```

**Expected output**:
```
vite v5.0.0 building for production...
✓ 32 modules transformed.
dist/index.html                  0.45 kB
dist/assets/index-abc123.css     2.15 kB
dist/assets/index-def456.js      95.00 kB

✓ built in 1.23s
```

**Preview production build**:
```bash
npm run preview
```

Navigate to `http://localhost:4173/`

---

## Available Scripts

| Command | Description | Used For |
|---------|-------------|----------|
| `npm run dev` | Start dev server | Development |
| `npm run build` | Build for production | Creating deployable build |
| `npm run preview` | Preview production build | Testing production build locally |
| `npm run test` | Run tests in watch mode | Development/testing |
| `npm run test:ci` | Run tests once (CI mode) | CI/CD pipelines |
| `npm run lint` | Check code with ESLint | Code quality |
| `npm run format` | Format code with Prettier | Code style |
| `npm run type-check` | Check TypeScript types | Type safety |

---

## Project Structure

```
my-todo-app/
├── src/
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   ├── styles/              # CSS modules
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── tests/                   # Test files
├── public/                  # Static assets
├── specs/                   # Feature specifications
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
└── vitest.config.ts         # Test configuration
```

---

## Development Workflow

### 1. Make Changes

Edit files in `src/` directory. Vite will automatically reload the browser.

**Example**: Change button color in `src/styles/TodoInput.module.css`:
```css
.addButton {
  background-color: #ff6b6b; /* Change from default */
}
```

### 2. Check Types

```bash
npm run type-check
```

Fix any TypeScript errors before committing.

### 3. Run Tests

```bash
npm run test
```

All tests must pass before committing.

### 4. Format Code

```bash
npm run format
```

Prettier will format all source files.

### 5. Commit Changes

```bash
git add .
git commit -m "feat: add dark mode toggle"
```

---

## Troubleshooting

### Issue: "Module not found" Error

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 5173 Already in Use

**Solution**:
```bash
# Use different port
npm run dev -- --port 3000
```

### Issue: Tests Fail with "Cannot find module"

**Solution**:
```bash
# Rebuild dependencies
npm rebuild
```

### Issue: localStorage Not Working

**Cause**: Browser in private/incognito mode

**Solution**: Use normal browser window or accept in-memory mode

### Issue: Confetti Not Showing

**Cause**: Ad blocker or browser extension blocking canvas

**Solution**: Disable ad blocker for localhost or check browser console

---

## Performance Tips

### Keep Bundle Small

```bash
# Analyze bundle size
npm run build -- --mode analyze
```

Target: < 100KB gzipped for JavaScript

### Monitor localStorage

Open browser DevTools → Application → Local Storage

Check size of `'todo-app-todos'` key

### Performance Testing

1. Open Chrome DevTools → Performance tab
2. Click "Record"
3. Add/complete/delete 50 todos
4. Stop recording
5. Check FPS (should stay at 60fps)

---

## Next Steps

After completing the quickstart:

1. **Read the Spec**: `specs/001-todo-app/spec.md` - User requirements
2. **Review the Plan**: `specs/001-todo-app/plan.md` - Technical approach
3. **Study Data Model**: `specs/001-todo-app/data-model.md` - Entity definitions
4. **Check Contracts**: `specs/001-todo-app/contracts/` - API contracts
5. **Run Tasks**: `/speckit.tasks` - Generate implementation tasks

---

## Keyboard Shortcuts

| Action | Shortcut | Location |
|--------|----------|----------|
| Submit todo | `Enter` | Input field |
| Navigate todos | `Tab` | Anywhere in list |
| Toggle complete | `Space` or `Enter` | Checkbox/button focused |
| Delete todo | `Delete` or `Backspace` | Delete button focused |
| Undo delete | `Enter` | Undo button focused |

---

## Accessibility Testing

### Test with Keyboard

1. Unplug mouse
2. Use `Tab` to navigate through todos
3. Use `Enter`/`Space` to interact
4. Verify focus indicators are visible

### Test with Screen Reader

1. Enable NVDA (Windows) or VoiceOver (Mac)
2. Navigate through todo list
3. Verify announcements are clear

### Automated Check

Install axe DevTools extension:
1. Open DevTools
2. Go to "axe DevTools" tab
3. Click "Scan All of My Page"
4. Fix any violations

---

## Browser Compatibility

Tested on:
- ✅ Chrome 120+ (last 2 versions)
- ✅ Firefox 121+ (last 2 versions)
- ✅ Safari 17+ (last 2 versions)
- ✅ Edge 120+ (last 2 versions)

**Not supported**: Internet Explorer (use modern browser)

---

## Getting Help

- **Documentation**: See `specs/001-todo-app/` directory
- **Constitution**: `.specify/memory/constitution.md` - Project principles
- **Issues**: Create GitHub issue for bugs
- **Questions**: Ask in team chat or create discussion

---

## FAQ

**Q: Can I run this without npm?**
A: No, Node.js and npm are required for the build tooling.

**Q: Does this work offline?**
A: Yes, once loaded, the app works completely offline (data stored in localStorage).

**Q: Will my todos be lost if I clear browser cache?**
A: Yes, localStorage is cleared when you clear browser data. Export/backup not yet implemented.

**Q: Can I sync todos across devices?**
A: Not yet. This is planned for a future feature.

**Q: Why Vite instead of Create React App?**
A: Vite is faster, has better DX, and is actively maintained (CRA is deprecated).

**Q: Do I need to know TypeScript?**
A: Yes, the entire codebase is in TypeScript for type safety.

---

**Happy Coding! 🚀**

For detailed implementation guidance, see the generated tasks.md (run `/speckit.tasks`).

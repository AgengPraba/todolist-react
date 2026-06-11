---
inclusion: fileMatch
fileMatchPattern: "simple-todolist-app"
---

# Technical Stack & Architecture

## Overview

The simple todo list application is a client-side only frontend built with modern web technologies. This document defines the technical decisions, libraries, and architectural patterns used throughout the project.

## Technology Stack

### Core Framework
- **React 18+**: UI library for component-based architecture
- **TypeScript 5+**: Strict type safety and better IDE support
- **Vite**: Fast build tool and development server

### Build & Development
- **Node.js 18+**: Runtime environment
- **npm**: Package manager
- **ESBuild**: Fast TypeScript/JavaScript transpiler (via Vite)

### Testing
- **Vitest**: Fast unit test framework with Jest-compatible API
- **@vitest/browser**: Browser test runner for component testing
- **React Testing Library**: Component testing utilities
- **fast-check**: Property-based testing framework

### Styling
- **CSS3**: Native CSS for styling components
- **CSS Modules** (optional): For component-scoped styles

### Storage
- **Browser localStorage API**: Built-in browser storage for persistence
- **JSON.stringify/parse**: Serialization for localStorage

## Architecture Patterns

### Layered Architecture

```
┌─────────────────────────────────────────────────┐
│          Presentation Layer (React)             │
│  Components: App, TodoInputForm, TodoList, etc. │
└───────────────────────┬─────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────┐
│        Business Logic Layer (TodoStore)         │
│  State management, filtering, CRUD operations   │
└───────────────────────┬─────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────┐
│       Data Access Layer (TodoRepository)        │
│       localStorage persistence and retrieval    │
└─────────────────────────────────────────────────┘
```

### Design Patterns

#### 1. Observer Pattern (React State)
- React components observe TodoStore state changes
- State updates trigger automatic re-renders
- Unidirectional data flow from store to components

#### 2. Repository Pattern
- TodoRepository abstracts localStorage implementation
- Enables easy switching to IndexedDB or other storage
- Centralizes error handling for persistence operations

#### 3. Dependency Injection
- Components receive TodoStore as dependency
- Enables testing with mock implementations
- Loose coupling between layers

#### 4. Immutable State Updates
- Never mutate existing state objects
- Create new arrays/objects when updating
- Enables time-travel debugging and easier testing

## Code Organization

### File Structure
```
src/
├── components/          # React components
│   ├── App.tsx         # Root component
│   ├── TodoInputForm.tsx
│   ├── TodoList.tsx
│   ├── TodoItem.tsx
│   ├── FilterControls.tsx
│   └── ClearCompletedButton.tsx
│
├── store/              # State management & data access
│   ├── TodoStore.ts    # Business logic
│   └── TodoRepository.ts # Persistence layer
│
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces
│
├── styles/             # CSS styling
│   ├── App.css
│   ├── components/
│   │   ├── TodoItem.css
│   │   ├── TodoList.css
│   │   └── TodoInputForm.css
│   └── variables.css   # CSS variables
│
├── tests/              # Test files
│   ├── TodoStore.test.ts
│   ├── TodoRepository.test.ts
│   ├── components/
│   │   ├── TodoInputForm.test.tsx
│   │   ├── TodoItem.test.tsx
│   │   ├── TodoList.test.tsx
│   │   ├── FilterControls.test.tsx
│   │   └── ClearCompletedButton.test.tsx
│   └── properties/
│       └── todo-properties.test.ts
│
├── index.tsx           # React root entry point
└── main.css           # Global styles
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `TodoInputForm.tsx` |
| Functions/variables | camelCase | `getTodos()`, `todoList` |
| Constants | UPPER_SNAKE_CASE | `STORAGE_KEY`, `DEFAULT_FILTER` |
| Types/Interfaces | PascalCase | `Todo`, `Filter` |
| CSS classes | kebab-case | `.todo-item`, `.input-form` |
| Test files | `*.test.ts(x)` | `TodoStore.test.ts` |

## Data Flow

### Adding a Todo

```
User Types "Buy milk" and presses Enter
        ↓
TodoInputForm validates and calls store.addTodo()
        ↓
TodoStore.addTodo() creates new Todo with UUID
        ↓
TodoStore calls save() → TodoRepository.save()
        ↓
localStorage updated with new todos array
        ↓
React state updates → App component re-renders
        ↓
TodoList component re-renders with new todo
        ↓
UI displays "Buy milk" in the list
```

### Filtering Todos

```
User clicks "Active" filter button
        ↓
FilterControls calls store.setFilter("Active")
        ↓
TodoStore updates filter state
        ↓
getTodos() returns filtered list (only completed === false)
        ↓
React state updates → App component re-renders
        ↓
TodoList displays only active todos
```

### Toggling Completion

```
User clicks checkbox on "Buy milk" todo
        ↓
TodoItem calls store.toggleTodo(id)
        ↓
TodoStore finds todo, inverts completed status
        ↓
TodoStore calls save() → TodoRepository.save()
        ↓
localStorage updated
        ↓
React state updates → UI re-renders
        ↓
UI shows strikethrough styling for completed item
```

## Type System

### Core Types

```typescript
interface Todo {
  id: string;           // UUID
  description: string;  // Non-empty, trimmed string
  completed: boolean;   // true or false
}

type Filter = "All" | "Active" | "Completed";

interface TodoStoreState {
  todos: Todo[];
  filter: Filter;
}
```

### Component Props

```typescript
// TodoList component
interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

// TodoItem component
interface TodoItemProps {
  id: string;
  description: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

// FilterControls component
interface FilterControlsProps {
  currentFilter: Filter;
  onFilterChange: (filter: Filter) => void;
}
```

## Error Handling Strategy

### Storage Errors
```typescript
try {
  localStorage.setItem(key, data);
} catch (error) {
  if (error instanceof DOMException && error.name === 'QuotaExceededError') {
    console.warn('localStorage quota exceeded');
    // Continue in memory-only mode
  }
}
```

### Data Corruption
```typescript
try {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
} catch (error) {
  console.warn('Failed to parse stored todos, returning empty list');
  return [];
}
```

### Input Validation
```typescript
const isValidTodo = (description: string): boolean => {
  return typeof description === 'string' && description.trim().length > 0;
};
```

## Performance Considerations

### Optimization Strategies

1. **React.memo**: Memoize TodoItem to prevent unnecessary re-renders
   ```typescript
   export const TodoItem = React.memo(TodoItemComponent);
   ```

2. **useCallback**: Memoize event handlers to prevent child re-renders
   ```typescript
   const handleToggle = useCallback((id: string) => {
     store.toggleTodo(id);
   }, [store]);
   ```

3. **Efficient Filtering**: Filter in TodoStore, not in components

4. **Batch Updates**: Update state once per operation, not multiple times

### Performance Targets
- Initial load: < 100ms
- Add todo: < 50ms
- Filter change: < 50ms
- Toggle completion: < 50ms
- localStorage read: < 10ms
- localStorage write: < 10ms

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required APIs
- ES2020+ features (async/await, optional chaining)
- localStorage API
- crypto.randomUUID() or polyfill for UUID generation

## Security Considerations

1. **XSS Prevention**: React automatically escapes text content
2. **localStorage**: Data stored locally, accessible only to same origin
3. **Input Sanitization**: Trim whitespace, validate length
4. **No Backend**: No HTTP requests, no auth needed for MVP

## Testing Strategy

### Test Pyramid
```
         End-to-End Tests (1-2)
         /                    \
        / Integration Tests    \
       /        (3-5)           \
      /___________________________\
     /    Component Tests (8-10)   \
    /                               \
   /_____ Unit Tests (20+) _________\
```

### Test Categories
1. **Unit Tests** (TodoStore, TodoRepository)
2. **Component Tests** (TodoItem, TodoList, etc.)
3. **Property Tests** (All 14 correctness properties)
4. **Integration Tests** (Full app workflows)

### Coverage Goals
- Line coverage: 90%+
- Branch coverage: 85%+
- Function coverage: 90%+
- Statement coverage: 90%+

## Build Process

### Development Build
```bash
npm run dev
# Runs Vite dev server with hot module replacement
# Unminified, with source maps for debugging
```

### Production Build
```bash
npm run build
# Outputs optimized bundle to dist/
# Minified, tree-shaken, code split
# Source maps for error tracking
```

### Test Build
```bash
npm run test
# Runs Vitest with coverage reporting
```

## Dependencies

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

### Development Dependencies
```json
{
  "typescript": "^5.0.0",
  "vite": "^4.0.0",
  "@vitejs/plugin-react": "^3.0.0",
  "vitest": "^0.34.0",
  "@vitest/browser": "^0.34.0",
  "@testing-library/react": "^14.0.0",
  "fast-check": "^3.0.0"
}
```

## Version Management

- Versions follow Semantic Versioning (MAJOR.MINOR.PATCH)
- Breaking changes only in major versions
- Dependencies updated monthly, security patches applied immediately
- Minimum Node.js version: 18.0.0

## Documentation Standards

- JSDoc comments for all exported functions
- TypeScript interfaces fully documented
- Component props documented with examples
- Complex algorithms explained in comments
- README.md in root with setup instructions

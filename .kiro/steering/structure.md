---
inclusion: fileMatch
fileMatchPattern: "simple-todolist-app"
---

# Project Structure & Organization

## Complete Directory Tree

```
todolist-app/
├── .kiro/
│   ├── specs/
│   │   └── simple-todolist-app/
│   │       ├── .config.kiro              # Spec configuration
│   │       ├── requirements.md           # Requirements document
│   │       ├── design.md                 # Design document
│   │       └── tasks.md                  # Implementation tasks
│   └── steering/
│       ├── simple-todolist-implementation.md   # Implementation guide
│       ├── tech.md                       # Technical stack
│       ├── structure.md                  # This file
│       └── product.md                    # Product overview
│
├── src/
│   ├── components/
│   │   ├── App.tsx                       # Root component
│   │   ├── TodoInputForm.tsx             # Input form component
│   │   ├── TodoList.tsx                  # List container
│   │   ├── TodoItem.tsx                  # Single todo item
│   │   ├── FilterControls.tsx            # Filter button group
│   │   └── ClearCompletedButton.tsx      # Clear completed button
│   │
│   ├── store/
│   │   ├── TodoStore.ts                  # State management (business logic)
│   │   └── TodoRepository.ts             # Data persistence layer
│   │
│   ├── types/
│   │   └── index.ts                      # TypeScript interfaces & types
│   │
│   ├── styles/
│   │   ├── variables.css                 # CSS variables & theme
│   │   ├── App.css                       # App component styles
│   │   ├── components/
│   │   │   ├── TodoItem.css
│   │   │   ├── TodoList.css
│   │   │   ├── TodoInputForm.css
│   │   │   ├── FilterControls.css
│   │   │   └── ClearCompletedButton.css
│   │   └── reset.css                     # CSS reset/normalize
│   │
│   ├── tests/
│   │   ├── TodoStore.test.ts             # Unit tests for TodoStore
│   │   ├── TodoRepository.test.ts        # Unit tests for TodoRepository
│   │   ├── components/
│   │   │   ├── TodoInputForm.test.tsx    # Tests for input component
│   │   │   ├── TodoItem.test.tsx         # Tests for item component
│   │   │   ├── TodoList.test.tsx         # Tests for list component
│   │   │   ├── FilterControls.test.tsx   # Tests for filter component
│   │   │   └── ClearCompletedButton.test.tsx  # Tests for clear button
│   │   ├── properties/
│   │   │   ├── todo-properties.test.ts   # All 14 property tests
│   │   │   └── setup.ts                  # Shared test utilities
│   │   └── fixtures/
│   │       └── sample-todos.ts           # Test data & fixtures
│   │
│   ├── index.tsx                         # React root entry point
│   └── main.css                          # Global styles
│
├── public/
│   ├── index.html                        # HTML entry point
│   └── favicon.ico                       # App favicon
│
├── config/
│   ├── vite.config.ts                    # Vite configuration
│   ├── vitest.config.ts                  # Vitest configuration
│   └── tsconfig.json                     # TypeScript configuration
│
├── docs/
│   ├── API.md                            # API documentation
│   ├── TESTING.md                        # Testing guide
│   ├── CONTRIBUTING.md                   # Contribution guidelines
│   └── ARCHITECTURE.md                   # Architecture decisions
│
├── .gitignore                            # Git ignore rules
├── package.json                          # Dependencies & scripts
├── package-lock.json                     # Locked dependency versions
├── README.md                             # Project overview
└── LICENSE                               # MIT License
```

## File Organization Guide

### Source Files (`src/`)

#### Components (`src/components/`)
Each component file should:
- Export a React functional component
- Include PropTypes or TypeScript interfaces
- Include JSDoc comments
- Be self-contained (one component per file, except small related components)

**Component Template**:
```typescript
import React from 'react';
import '../styles/components/ComponentName.css';

interface ComponentNameProps {
  prop1: string;
  prop2: (value: string) => void;
}

/**
 * ComponentName - Brief description of what this component does
 * 
 * @param {ComponentNameProps} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  prop2,
}) => {
  return (
    <div className="component-name">
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

#### Store (`src/store/`)
- **TodoStore.ts**: Main state management class with business logic
- **TodoRepository.ts**: Data persistence abstraction layer

**Store Template**:
```typescript
import { Todo, Filter } from '../types';
import { TodoRepository } from './TodoRepository';

/**
 * TodoStore - Manages application state and business logic
 */
export class TodoStore {
  private todos: Todo[] = [];
  private filter: Filter = 'All';
  private repository: TodoRepository;

  constructor(repository?: TodoRepository) {
    this.repository = repository || new TodoRepository();
    this.load();
  }

  // Public methods for UI components to call
  getTodos(): Todo[] { }
  addTodo(description: string): void { }
  toggleTodo(id: string): void { }
  // ... more methods
}
```

#### Types (`src/types/`)
- Central location for all TypeScript interfaces
- One `index.ts` file exporting all types
- Clear documentation for each type

**Types Template**:
```typescript
/**
 * Todo item interface
 */
export interface Todo {
  id: string;        // UUID
  description: string; // Non-empty task description
  completed: boolean; // Completion status
}

/**
 * Filter type for displaying todos
 */
export type Filter = 'All' | 'Active' | 'Completed';

/**
 * Application state structure
 */
export interface TodoStoreState {
  todos: Todo[];
  filter: Filter;
}
```

#### Styles (`src/styles/`)
- `variables.css`: CSS custom properties for colors, spacing, fonts
- Component-specific CSS in `components/` subfolder
- Naming follows BEM (Block Element Modifier) convention

**CSS Organization**:
```css
/* variables.css */
:root {
  --color-primary: #2c3e50;
  --color-success: #27ae60;
  --color-border: #ecf0f1;
  --spacing-base: 8px;
}

/* components/TodoItem.css */
.todo-item {
  padding: var(--spacing-base);
  border: 1px solid var(--color-border);
}

.todo-item__checkbox {
  margin-right: var(--spacing-base);
}

.todo-item--completed {
  text-decoration: line-through;
  opacity: 0.6;
}
```

### Test Files (`src/tests/`)

#### Unit Tests
- One test file per implementation file
- Named `[FileName].test.ts(x)`
- Group related tests with `describe()`
- Use `it()` or `test()` for individual test cases

**Unit Test Template**:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { TodoStore } from '../store/TodoStore';

describe('TodoStore', () => {
  let store: TodoStore;

  beforeEach(() => {
    store = new TodoStore();
  });

  describe('addTodo', () => {
    it('should add a new todo item', () => {
      store.addTodo('Test todo');
      expect(store.getTodos()).toHaveLength(1);
    });

    it('should reject empty input', () => {
      store.addTodo('');
      expect(store.getTodos()).toHaveLength(0);
    });
  });
});
```

#### Property Tests
- All 14 properties in `properties/todo-properties.test.ts`
- Use fast-check for property generation
- Each property runs 100+ iterations
- Tagged with property number

**Property Test Template**:
```typescript
import fc from 'fast-check';
import { describe, it, expect } from 'vitest';

describe('Property: Adding a todo item grows the list by one', () => {
  it('should grow list by exactly one when adding valid todo', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        (description) => {
          const store = new TodoStore();
          const initialCount = store.getTodos().length;
          
          store.addTodo(description);
          
          return store.getTodos().length === initialCount + 1;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### Component Tests
- Test React components using React Testing Library
- Focus on user behavior, not implementation details
- Use semantic queries (getByRole, getByLabelText)
- Mock child components if testing in isolation

**Component Test Template**:
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import TodoInputForm from '../components/TodoInputForm';

describe('TodoInputForm', () => {
  it('should call onAdd when form is submitted', async () => {
    const mockOnAdd = vi.fn();
    render(<TodoInputForm onAdd={mockOnAdd} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'New todo');
    await userEvent.keyboard('{Enter}');
    
    expect(mockOnAdd).toHaveBeenCalledWith('New todo');
  });
});
```

### Configuration Files (`config/`)

#### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
```

#### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "strict": true,
    "resolveJsonModule": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Documentation Files (`docs/`)

- **API.md**: Public API documentation for TodoStore and TodoRepository
- **TESTING.md**: Guide to running and writing tests
- **CONTRIBUTING.md**: Guidelines for contributors
- **ARCHITECTURE.md**: High-level architecture and design decisions

## Import Organization

### Import Order in Files
1. External libraries (React, third-party packages)
2. Relative imports from parent directories (`../`)
3. Relative imports from sibling directories (`./`)
4. Type imports

```typescript
// External libraries
import React, { useState, useCallback } from 'react';
import { render } from '@testing-library/react';

// Relative imports - parent
import { TodoStore } from '../../store/TodoStore';
import { Todo, Filter } from '../../types';

// Relative imports - sibling
import './TodoItem.css';
import { utils } from './helpers';

// Type imports (TypeScript)
import type { ComponentProps } from 'react';
```

## Naming Conventions Applied

| Category | Convention | Example |
|----------|-----------|---------|
| Directories | kebab-case | `src/components`, `tests/properties` |
| Files | PascalCase (components), camelCase (utilities) | `TodoItem.tsx`, `todoUtils.ts` |
| Components | PascalCase | `export const TodoItem = () => {}` |
| Functions | camelCase | `getTodos()`, `addTodo()` |
| Constants | UPPER_SNAKE_CASE | `STORAGE_KEY`, `DEFAULT_FILTER` |
| Classes | PascalCase | `class TodoStore {}` |
| Interfaces | PascalCase | `interface TodoProps {}` |
| CSS classes | kebab-case | `.todo-item`, `.input-form` |
| CSS variables | kebab-case | `--color-primary`, `--spacing-base` |
| Private methods | _camelCase prefix | `_saveToStorage()` |

## Module Boundaries

### Strong Boundaries
- `store/` should NOT import from `components/`
- `types/` should NOT import from other modules
- `tests/` should NOT be imported by source code

### Allowed Dependencies
```
components/ → store/ → types/
components/ → styles/
components/ → types/
store/ → types/
```

## Scalability Considerations

### If Project Grows
1. **More features**: Create feature folders with their own components and logic
   ```
   src/features/todos/
   src/features/notes/
   ```

2. **More state management**: Consider Redux or Zustand
   ```
   src/store/slices/
   src/store/reducers/
   ```

3. **More utilities**: Create `utils/` folder
   ```
   src/utils/validation.ts
   src/utils/formatting.ts
   ```

4. **More pages/routes**: Add routing with React Router
   ```
   src/pages/
   src/routes/
   ```

## File Size Guidelines

- Component files: < 300 lines
- Store files: < 400 lines
- Style files: < 500 lines
- Test files: < 600 lines

If larger, consider splitting into smaller modules.

## Build Output Structure

After `npm run build`, the `dist/` folder contains:

```
dist/
├── index.html                    # HTML entry point
├── assets/
│   ├── index-[hash].js          # Main JavaScript bundle
│   ├── index-[hash].css         # Compiled CSS
│   ├── vendor-[hash].js         # Vendor bundle (React, etc.)
│   └── [other-hash].js          # Code-split chunks
└── favicon.ico                  # Favicon
```

## Development Workflow

1. Create feature branch from `main`
2. Implement feature following this structure
3. Add tests in `src/tests/`
4. Update relevant documentation
5. Create pull request
6. Run `npm run build && npm run test` before merge

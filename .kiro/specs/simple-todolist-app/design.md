# Design Document

## Overview

This document outlines the design for a simple frontend-only todo list application built for the browser. The application allows users to manage their tasks by adding new todo items, marking them as completed, deleting them, filtering by status, and persisting data across page refreshes using browser localStorage.

The application is a client-side only implementation with no backend server required. All state management, persistence, and UI rendering happen in the browser using standard web technologies (HTML, CSS, JavaScript).

## Architecture

### High-Level Architecture

The application follows a clean separation of concerns with the following components:

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface (UI)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Input Form │  │ Todo List   │  │ Filter/     │          │
│  │             │  │             │  │ Controls    │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   Application State                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    TodoStore                        │    │
│  │  - Maintains todo list state                        │    │
│  │  - Handles persistence (localStorage)               │    │
│  │  - Manages filtering                                │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   Data Layer                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              TodoRepository (localStorage)          │    │
│  │  - Read/write todo items to localStorage            │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Action** → UI Component triggers event (add, toggle, delete, filter)
2. **UI Component** → Calls appropriate method on TodoStore
3. **TodoStore** → Updates internal state, persists to localStorage
4. **LocalStorage** → Data persisted across page refreshes
5. **State Change** → UI re-renders to reflect new state

## Components and Interfaces

### UI Components

#### TodoInputForm
- **Purpose**: Handles user input for adding new todo items
- **State**:
  - `inputValue`: Current text in the input field
- **Events**:
  - `onAdd(todoDescription)`: Triggered when user submits a valid todo
- **Responsibilities**:
  - Validate input is not empty
  - Clear input after successful addition
  - Handle Enter key and Add button events

#### TodoList
- **Purpose**: Displays the collection of todo items
- **State**:
  - `todos`: Array of todo items to display
- **Events**:
  - `onToggle(id)`: Triggered when user toggles completion status
  - `onDelete(id)`: Triggered when user deletes a todo item
- **Responsibilities**:
  - Render all visible todo items based on current filter
  - Handle empty state display

#### TodoItem
- **Purpose**: Displays a single todo item
- **State**:
  - `id`: Unique identifier
  - `description`: Task description text
  - `completed`: Completion status
- **Events**:
  - `onToggle()`: Toggle completion status
  - `onDelete()`: Delete this todo item
- **Responsibilities**:
  - Display description with strikethrough when completed
  - Show checkbox with correct state
  - Display delete button

#### FilterControls
- **Purpose**: Allows users to filter todo items by status
- **State**:
  - `currentFilter`: One of "All", "Active", or "Completed"
- **Events**:
  - `onFilterChange(newFilter)`: Triggered when filter changes
- **Responsibilities**:
  - Display filter buttons (All, Active, Completed)
  - Highlight active filter

#### ClearCompletedButton
- **Purpose**: Allows bulk deletion of completed tasks
- **State**:
  - `show`: Whether to show the button (hidden when no completed items)
- **Events**:
  - `onClearCompleted()`: Triggered when button is clicked
- **Responsibilities**:
  - Show/hide based on completed item count
  - Trigger bulk deletion

### Application State (TodoStore)

#### Responsibilities
- Maintain in-memory todo list state
- Handle persistence to localStorage
- Manage filter state
- Provide methods for CRUD operations
- Calculate derived state (filtered lists, counts)

#### State Structure
```
{
  todos: Todo[],
  filter: "All" | "Active" | "Completed"
}
```

#### Methods
- `getTodos()`: Get all todos (filtered by current filter)
- `addTodo(description)`: Add a new todo item
- `toggleTodo(id)`: Toggle completion status of a todo
- `deleteTodo(id)`: Remove a todo item
- `clearCompleted()`: Remove all completed todo items
- `setFilter(filter)`: Change the current filter
- `save()`: Persist current state to localStorage
- `load()`: Load state from localStorage

### Data Layer (TodoRepository)

#### Responsibilities
- Read/write todo list data to browser localStorage
- Handle serialization/deserialization

#### Methods
- `save(todos)`: Save todo list to localStorage
- `load()`: Load todo list from localStorage, returns empty array if none exists

## Data Models

### Todo Item

```typescript
interface Todo {
  id: string;           // Unique identifier (UUID)
  description: string;  // Task description text
  completed: boolean;   // Completion status
}
```

#### Properties
- `id`: Generated UUID for unique identification
- `description`: Non-empty string containing the task description
- `completed`: Boolean indicating completion status

#### Invariants
- `id` must be unique across all todo items
- `description` must be a non-empty string
- `completed` must be either `true` or `false`

### Filter Values

```
Filter = "All" | "Active" | "Completed"
```

#### Values
- `"All"`: Display all todo items regardless of completion status
- `"Active"`: Display only pending (incomplete) todo items
- `"Completed"`: Display only completed todo items

## Visual Design System - Neobrutalism

The application adopts a **Neobrutalism** design aesthetic, characterized by bold geometric shapes, stark contrasts, and deliberate use of raw, unrefined visual elements.

### Color Palette

**Primary Colors:**
- **Bright Yellow (#FFFF00)**: Primary action buttons and highlights
- **Hot Pink (#FF1493)**: Secondary accents and urgent actions
- **Pure Black (#000000)**: Borders, text, and shadows
- **Pure White (#FFFFFF)**: Backgrounds and contrast

**Secondary Colors:**
- **Charcoal (#1A1A1A)**: Dark backgrounds and text alternatives
- **Light Gray (#F0F0F0)**: Secondary backgrounds

### Typography & Borders

**Borders:**
- **Thick Black Borders**: 3-4px solid black borders on all major containers
- **Sharp Corners**: Minimal to no border-radius (0-2px maximum)
- **Hard Edges**: Emphasize angular, unrefined aesthetic

**Typography:**
- **Bold, Heavy Fonts**: Sans-serif with 600+ font-weight
- **High Contrast**: Black text on white/yellow, white text on dark backgrounds
- **Large Scale**: Generous font sizes for visual impact

### Shadow System

**Hard Shadows (Neobrutalism Style):**
- **Offset Shadows**: 4-6px offset with 0px blur for sharp, hard shadows
- **Black Shadows**: Always use pure black (#000000) for shadows
- **No Blur**: Maintain hard, defined edges (0px blur-radius)
- **Heavy Drop**: 4-6px offset creates bold elevation effect

**Shadow Examples:**
```
box-shadow: 4px 4px 0px #000000;  /* Hard drop shadow */
box-shadow: -4px -4px 0px #000000; /* Offset shadow */
box-shadow: 4px 4px 0px #000000, 8px 8px 0px rgba(0,0,0,0.2); /* Layered hard shadows */
```

### Component Styling Guidelines

**Buttons:**
- 3-4px solid black borders
- Bright yellow or hot pink backgrounds
- Hard shadows (4-6px offset)
- Bold, uppercase text
- No hover animations; use hard shadow increase on click

**Input Fields:**
- 4px solid black borders
- White background with black text
- Hard shadows on focus (not subtle glow)
- Bold placeholder text

**Cards/Containers:**
- 4px solid black borders
- Hard shadows (4-6px offset)
- Sharp corners (0-2px radius maximum)
- Clear separation between elements

**Interactive Elements:**
- Bold visual feedback
- Hard shadows shift on click (elevation effect)
- Stark color changes rather than subtle transitions
- No gradients or soft effects

### Spacing & Layout

- **Generous Padding**: 16-24px for breathing room
- **Bold Gaps**: 12-20px between elements
- **Aligned Grid**: Elements snap to clear horizontal/vertical alignment
- **Intentional Whitespace**: Use white space as active design element

## Correctness Properties

The application implements the following correctness properties to ensure reliable behavior across all interactions. These properties define the expected outcomes for core functionality and are validated during implementation.

## Error Handling

### Input Validation Errors

**Scenario**: Empty or whitespace-only input

**Handling**:
- Display no error message (silent rejection)
- Maintain current todo list state
- Do not trigger persistence

### Persistence Errors

**Scenario**: localStorage write fails (storage quota exceeded, disabled, etc.)

**Handling**:
- Log error to console for debugging
- Continue application operation in memory-only mode
- Attempt to notify user with a subtle message

### Data Corruption Errors

**Scenario**: Corrupted or malformed data in localStorage

**Handling**:
- Catch parsing errors when loading from localStorage
- Fall back to empty todo list
- Log warning with details for debugging

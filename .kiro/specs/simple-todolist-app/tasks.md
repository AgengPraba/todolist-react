# Implementation Plan: Simple Todo List Application

## Overview

This implementation plan breaks down the simple frontend todo list application into discrete coding tasks. The application is built using TypeScript with React, following a component-based architecture with clear separation of concerns between UI components, state management, and data persistence.

## Tasks

- [x] 1. Set up project structure and core interfaces
  - Initialize TypeScript project with Vite
  - Install dependencies (React, Vitest, Testing Library)
  - Create directory structure following component pattern
  - Define core TypeScript interfaces for Todo and Filter types
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Implement data layer (TodoRepository)
  - [x] 2.1 Create TodoRepository class with localStorage persistence
    - Implement save() method to persist todos to localStorage
    - Implement load() method to retrieve todos from localStorage
    - Handle empty state and data corruption gracefully
    - _Requirements: 5.1, 5.2_

- [x] 3. Implement application state (TodoStore)
  - [x] 3.1 Create TodoStore class with state management
    - Implement getTodos() with filter support
    - Implement addTodo() with input validation
    - Implement toggleTodo(), deleteTodo(), clearCompleted()
    - Implement filter management (setFilter, getFilter)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 4.1, 7.1_
  
  - [ ]* 3.2 Write unit tests for TodoStore
    - Test addTodo() with valid and invalid inputs
    - Test toggle and delete operations
    - Test filter functionality
    - Test clearCompleted() operation
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 4.1, 7.1_

- [x] 4. Implement UI components (TodoItem, TodoList, TodoInputForm, FilterControls)
  - [x] 4.1 Create TodoItem functional component
    - Accept props for todo item with id, description, completed
    - Implement toggle and delete event handlers
    - Render checkbox, description with conditional styling
    - Display delete button
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 4.1_
  
  - [ ]* 4.2 Write unit tests for TodoItem component
    - Test rendering with completed and incomplete states
    - Test toggle and delete event handlers
    - Test strikethrough styling for completed items
    - _Requirements: 2.2, 2.3, 3.1, 3.2, 4.1_
  
  - [x] 4.3 Create TodoList component with todo rendering
    - Accept todos array and event handlers as props
    - Render TodoItem components for each todo
    - Handle empty state with message display
    - _Requirements: 2.1, 4.2_
  
  - [ ]* 4.4 Write unit tests for TodoList component
    - Test rendering list of todos
    - Test empty state display
    - Test event handler propagation
    - _Requirements: 2.1, 4.2_
  
  - [x] 4.5 Create TodoInputForm component
    - Implement controlled input field
    - Handle Enter key and Add button events
    - Validate input before triggering onAdd event
    - Clear input after successful addition
    - _Requirements: 1.1, 1.2, 1.4_
  
  - [ ]* 4.6 Write unit tests for TodoInputForm component
    - Test input validation
    - Test form submission and input clearing
    - Test keyboard (Enter) and button click handlers
    - _Requirements: 1.1, 1.2, 1.4_
  
  - [x] 4.7 Create FilterControls component
    - Display All, Active, Completed filter buttons
    - Highlight active filter state
    - Trigger onFilterChange event on selection
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 4.8 Write unit tests for FilterControls component
    - Test filter button rendering
    - Test filter selection and active state highlighting
    - Test onFilterChange event handler
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 5. Implement ClearCompletedButton component
  - [x] 5.1 Create ClearCompletedButton component
    - Accept show prop to control visibility
    - Display button only when completed items exist
    - Trigger onClearCompleted event on click
    - _Requirements: 7.1, 7.2_
  
  - [ ]* 5.2 Write unit tests for ClearCompletedButton component
    - Test visibility based on show prop
    - Test button click handler
    - _Requirements: 7.1, 7.2_

- [x] 6. Integrate components in main App component
  - [x] 6.1 Create App component with complete integration
    - Initialize TodoStore and load todos on component mount
    - Manage todos state using React hooks
    - Manage filter state and propagate to components
    - Wire all event handlers between components (add, toggle, delete, filter, clear)
    - Connect TodoStore mutations to React state updates
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 3.1, 3.2, 3.3, 4.1, 4.2, 5.1, 5.2, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2_
  
  - [ ]* 6.2 Write integration tests for App component
    - Test full workflow: add, filter, toggle, delete, clear completed
    - Test persistence across component reloads
    - Test filter changes affecting displayed todos
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 3.1, 3.2, 3.3, 4.1, 4.2, 5.1, 5.2, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2_

- [x] 7. Apply styling and layout
  - [x] 7.1 Implement CSS styling for all components
    - Create clean, functional styles for todo list
    - Style form input and buttons
    - Style filter controls
    - Apply strikethrough styling for completed items
    - Implement responsive layout
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1_

- [x] 8. Apply Neobrutalism design aesthetic
  - [x] 8.1 Update CSS with Neobrutalism styling
    - Implement 3-4px thick black borders on all containers and buttons
    - Apply hard shadows (4-6px offset, 0px blur) in pure black (#000000)
    - Use bright yellow (#FFFF00) for primary action buttons
    - Use hot pink (#FF1493) for secondary accents and delete actions
    - Implement sharp corners (0-2px border-radius maximum)
    - Bold, heavy typography (600+ font-weight)
    - Remove soft shadows and gradients, embrace raw aesthetic
    - Update color scheme: pure black text, pure white backgrounds
    - Add generous padding (16-24px) and bold gaps (12-20px)
    - Maintain responsive layout with Neobrutalism styling
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1_

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.



## Notes

- Tasks marked with `*` are optional test-related sub-tasks and can be skipped for faster MVP
- Unit tests validate specific examples and edge cases
- Integration tests validate complete user workflows
- All implementation tasks reference specific requirements for traceability
- Components follow functional component pattern with React hooks
- State management is centralized in TodoStore which integrates with React component state
- Task 8.1 implements the Neobrutalism design system defined in the Design Document

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["3.2"] },
    { "id": 1, "tasks": ["4.2", "4.4", "4.6", "4.8"] },
    { "id": 2, "tasks": ["5.2"] },
    { "id": 3, "tasks": ["5.1"] },
    { "id": 4, "tasks": ["6.1"] },
    { "id": 5, "tasks": ["6.2"] },
    { "id": 6, "tasks": ["7.1"] },
    { "id": 7, "tasks": ["8.1"] },
    { "id": 8, "tasks": ["9"] }
  ]
}
```
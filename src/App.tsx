import { useState, useEffect } from 'react'
import type { Todo, Filter } from './types/index'
import { TodoStore } from './store/TodoStore'
import { TodoInputForm } from './components/TodoInputForm'
import { TodoList } from './components/TodoList'
import { FilterControls } from './components/FilterControls'
import { ClearCompletedButton } from './components/ClearCompletedButton'
import './App.css'

/**
 * App component - Main application entry point
 * 
 * Manages the complete integration of:
 * - TodoStore initialization and state management
 * - React hooks for todos and filter state
 * - Event handler wiring between all components
 * - TodoStore mutations connected to React state updates
 * - Persistence of todos across page refreshes
 * 
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.1, 3.1, 3.2, 3.3, 4.1, 4.2, 5.1, 5.2, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2
 */
function App() {
  // Initialize TodoStore instance (singleton-like for this component)
  const [store] = useState(() => new TodoStore())

  // React state for todos - reflects the filtered view from store
  const [todos, setTodos] = useState<Todo[]>([])

  // React state for current filter
  const [filter, setFilter] = useState<Filter>('All')

  /**
   * Initialize TodoStore on component mount
   * Load todos from localStorage and update React state
   */
  useEffect(() => {
    // Initialize the store (loads from localStorage)
    store.initialize()

    // Load initial todos and set filter
    const initialTodos = store.getTodos()
    setTodos(initialTodos)
    setFilter(store.getFilter())
  }, [store])

  /**
   * Handle adding a new todo
   * 1. Add to store (validates and persists)
   * 2. Update React state with filtered view
   */
  const handleAddTodo = (description: string) => {
    const newTodo = store.addTodo(description)

    // Only update state if todo was successfully created (validation passed)
    if (newTodo) {
      // Force a re-render by updating todos state
      const updatedTodos = store.getTodos()
      setTodos([...updatedTodos])
    }
  }

  /**
   * Handle toggling a todo's completion status
   * 1. Toggle in store (persists change)
   * 2. Update React state with filtered view
   */
  const handleToggleTodo = (id: string) => {
    const updated = store.toggleTodo(id)

    // Update state if todo was found
    if (updated) {
      const updatedTodos = store.getTodos()
      setTodos([...updatedTodos])
    }
  }

  /**
   * Handle deleting a todo
   * 1. Delete from store (persists change)
   * 2. Update React state with filtered view
   */
  const handleDeleteTodo = (id: string) => {
    const deleted = store.deleteTodo(id)

    // Update state if todo was deleted
    if (deleted) {
      const updatedTodos = store.getTodos()
      setTodos([...updatedTodos])
    }
  }

  /**
   * Handle changing the filter
   * 1. Set filter in store
   * 2. Update React state with new filtered view
   */
  const handleFilterChange = (newFilter: Filter) => {
    store.setFilter(newFilter)
    setFilter(newFilter)
    const filteredTodos = store.getTodos()
    setTodos([...filteredTodos])
  }

  /**
   * Handle clearing all completed todos
   * 1. Clear completed in store (persists change)
   * 2. Update React state with filtered view
   */
  const handleClearCompleted = () => {
    const cleared = store.clearCompleted()

    // Update state if any todos were cleared
    if (cleared > 0) {
      const updatedTodos = store.getTodos()
      setTodos([...updatedTodos])
    }
  }

  // Determine if the "Clear Completed" button should be shown
  const completedCount = store.getCompletedCount()
  const showClearCompleted = completedCount > 0

  return (
    <div className="app">
      <h1>My Todo List</h1>

      {/* Input form for adding new todos */}
      <TodoInputForm onAdd={handleAddTodo} />

      {/* Filter controls for viewing different todo subsets */}
      <FilterControls currentFilter={filter} onFilterChange={handleFilterChange} />

      {/* Main todo list display */}
      <TodoList todos={todos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />

      {/* Button to clear all completed todos */}
      <ClearCompletedButton
        show={showClearCompleted}
        onClearCompleted={handleClearCompleted}
      />
    </div>
  )
}

export default App

import { v4 as uuidv4 } from 'uuid';
import type { Todo, Filter } from '../types/index';
import { TodoRepository } from '../repository/TodoRepository';

/**
 * TodoStore manages the application state for the todo list
 * Handles todo operations, filtering, and persistence integration
 */
export class TodoStore {
  private todos: Todo[] = [];
  private filter: Filter = 'All';
  private repository: TodoRepository;

  constructor() {
    this.repository = new TodoRepository();
  }

  /**
   * Initializes the store by loading todos from localStorage
   * Called during application startup
   */
  initialize(): void {
    this.todos = this.repository.load();
  }

  /**
   * Saves current todos to localStorage
   * Called after any mutation operation
   */
  private save(): void {
    this.repository.save(this.todos);
  }

  /**
   * Gets all todos, filtered by the current filter setting
   * 
   * @returns Array of todos matching the current filter
   */
  getTodos(): Todo[] {
    switch (this.filter) {
      case 'Active':
        return this.todos.filter(todo => !todo.completed);
      case 'Completed':
        return this.todos.filter(todo => todo.completed);
      case 'All':
      default:
        return this.todos;
    }
  }

  /**
   * Gets all todos without filtering
   * Useful for operations that need the complete list
   * Returns a copy to prevent external modifications
   * 
   * @returns Array of all todos
   */
  getAllTodos(): Todo[] {
    return [...this.todos];
  }

  /**
   * Adds a new todo item to the list
   * Validates input is not empty or whitespace-only
   * 
   * @param description - The description text for the new todo
   * @returns The created todo item, or null if validation failed
   */
  addTodo(description: string): Todo | null {
    // Validate input: must not be empty or whitespace-only
    if (!description || description.trim().length === 0) {
      return null;
    }

    const newTodo: Todo = {
      id: uuidv4(),
      description: description.trim(),
      completed: false,
    };

    this.todos.push(newTodo);
    this.save();

    return newTodo;
  }

  /**
   * Toggles the completion status of a todo item
   * 
   * @param id - The ID of the todo to toggle
   * @returns The updated todo item, or null if not found
   */
  toggleTodo(id: string): Todo | null {
    const todo = this.todos.find(t => t.id === id);

    if (!todo) {
      return null;
    }

    todo.completed = !todo.completed;
    this.save();

    return todo;
  }

  /**
   * Deletes a todo item from the list
   * 
   * @param id - The ID of the todo to delete
   * @returns True if the todo was deleted, false if not found
   */
  deleteTodo(id: string): boolean {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter(t => t.id !== id);

    if (this.todos.length < initialLength) {
      this.save();
      return true;
    }

    return false;
  }

  /**
   * Removes all completed todo items from the list
   * 
   * @returns The number of items removed
   */
  clearCompleted(): number {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter(t => !t.completed);
    const removed = initialLength - this.todos.length;

    if (removed > 0) {
      this.save();
    }

    return removed;
  }

  /**
   * Sets the current filter value
   * Affects which todos are returned by getTodos()
   * 
   * @param filter - The new filter value
   */
  setFilter(filter: Filter): void {
    this.filter = filter;
  }

  /**
   * Gets the current filter value
   * 
   * @returns The current filter
   */
  getFilter(): Filter {
    return this.filter;
  }

  /**
   * Gets the count of completed todos
   * 
   * @returns Number of completed todos
   */
  getCompletedCount(): number {
    return this.todos.filter(t => t.completed).length;
  }

  /**
   * Gets the count of active (incomplete) todos
   * 
   * @returns Number of active todos
   */
  getActiveCount(): number {
    return this.todos.filter(t => !t.completed).length;
  }
}

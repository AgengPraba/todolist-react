import type { Todo } from '../types/index';

/**
 * TodoRepository handles persistence of todo items to browser localStorage
 * Responsible for serialization/deserialization and error handling
 */
export class TodoRepository {
  private static readonly STORAGE_KEY = 'todolist_todos';

  /**
   * Saves a list of todos to localStorage
   * Handles serialization and gracefully manages storage errors
   * 
   * @param todos - Array of todo items to persist
   */
  save(todos: Todo[]): void {
    try {
      const serialized = JSON.stringify(todos);
      localStorage.setItem(TodoRepository.STORAGE_KEY, serialized);
    } catch (error) {
      // Log error for debugging but don't throw - allow app to continue in memory-only mode
      console.error('Failed to save todos to localStorage:', error);
    }
  }

  /**
   * Loads todos from localStorage
   * Handles data corruption gracefully by returning empty array on parse errors
   * 
   * @returns Array of loaded todos, or empty array if none exist or data is corrupted
   */
  load(): Todo[] {
    try {
      const stored = localStorage.getItem(TodoRepository.STORAGE_KEY);
      
      // Handle empty state - no data has been saved yet
      if (stored === null) {
        return [];
      }

      // Parse and validate the stored JSON
      const parsed = JSON.parse(stored);

      // Ensure we have an array
      if (!Array.isArray(parsed)) {
        console.warn('Corrupted todo data: expected array, got', typeof parsed);
        return [];
      }

      // Basic validation of todo structure
      const isValidTodo = (item: unknown): item is Todo => {
        if (typeof item !== 'object' || item === null) {
          return false;
        }
        const obj = item as Record<string, unknown>;
        return (
          typeof obj.id === 'string' &&
          typeof obj.description === 'string' &&
          typeof obj.completed === 'boolean'
        );
      };

      // Filter out any invalid items and warn about corruption
      const validTodos = parsed.filter((item: unknown) => {
        if (!isValidTodo(item)) {
          console.warn('Corrupted todo item, skipping:', item);
          return false;
        }
        return true;
      });

      return validTodos;
    } catch (error) {
      // Handle parsing errors and other issues
      if (error instanceof SyntaxError) {
        console.warn('Failed to parse todos from localStorage: invalid JSON', error);
      } else {
        console.error('Failed to load todos from localStorage:', error);
      }
      // Return empty array on any error to allow app to continue
      return [];
    }
  }
}

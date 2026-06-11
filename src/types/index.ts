/**
 * Core TypeScript interfaces for the Todo List application
 */

/**
 * Represents a single todo item
 */
export interface Todo {
  /** Unique identifier (UUID) */
  id: string;
  /** Task description text */
  description: string;
  /** Completion status */
  completed: boolean;
}

/**
 * Filter values for displaying todos
 */
export type Filter = 'All' | 'Active' | 'Completed';

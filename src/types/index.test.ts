import { describe, it, expect } from 'vitest';
import type { Todo, Filter } from './index';

describe('Type Definitions', () => {
  it('should allow creating a Todo object', () => {
    const todo: Todo = {
      id: '123',
      description: 'Test task',
      completed: false,
    };
    expect(todo).toBeDefined();
    expect(todo.id).toBe('123');
    expect(todo.description).toBe('Test task');
    expect(todo.completed).toBe(false);
  });

  it('should allow Filter type with valid values', () => {
    const filters: Filter[] = ['All', 'Active', 'Completed'];
    expect(filters).toHaveLength(3);
    expect(filters).toContain('All');
    expect(filters).toContain('Active');
    expect(filters).toContain('Completed');
  });

  it('should support completed todos', () => {
    const completedTodo: Todo = {
      id: '456',
      description: 'Completed task',
      completed: true,
    };
    expect(completedTodo.completed).toBe(true);
  });
});

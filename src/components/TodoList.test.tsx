import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodoList } from './TodoList';
import type { Todo } from '../types';

describe('TodoList', () => {
  describe('Unit Tests', () => {
    it('should render empty state message when todos array is empty', () => {
      const onToggle = vi.fn();
      const onDelete = vi.fn();

      render(
        <TodoList todos={[]} onToggle={onToggle} onDelete={onDelete} />
      );

      const emptyMessage = screen.getByText('No todos yet. Add one to get started!');
      expect(emptyMessage).toBeInTheDocument();
    });

    it('should render TodoItem components for each todo', () => {
      const todos: Todo[] = [
        {
          id: '1',
          description: 'First todo',
          completed: false,
        },
        {
          id: '2',
          description: 'Second todo',
          completed: true,
        },
      ];

      const onToggle = vi.fn();
      const onDelete = vi.fn();

      render(
        <TodoList todos={todos} onToggle={onToggle} onDelete={onDelete} />
      );

      expect(screen.getByText('First todo')).toBeInTheDocument();
      expect(screen.getByText('Second todo')).toBeInTheDocument();
    });

    it('should pass onToggle to TodoItem components', () => {
      const todos: Todo[] = [
        {
          id: '1',
          description: 'Test todo',
          completed: false,
        },
      ];

      const onToggle = vi.fn();
      const onDelete = vi.fn();

      render(
        <TodoList todos={todos} onToggle={onToggle} onDelete={onDelete} />
      );

      const checkbox = screen.getByRole('checkbox');
      checkbox.click();

      expect(onToggle).toHaveBeenCalledWith('1');
    });

    it('should pass onDelete to TodoItem components', () => {
      const todos: Todo[] = [
        {
          id: '1',
          description: 'Test todo',
          completed: false,
        },
      ];

      const onToggle = vi.fn();
      const onDelete = vi.fn();

      render(
        <TodoList todos={todos} onToggle={onToggle} onDelete={onDelete} />
      );

      const deleteButton = screen.getByRole('button', { name: /Delete/i });
      deleteButton.click();

      expect(onDelete).toHaveBeenCalledWith('1');
    });

    it('should display completed todos with strikethrough styling', () => {
      const todos: Todo[] = [
        {
          id: '1',
          description: 'Completed todo',
          completed: true,
        },
      ];

      const onToggle = vi.fn();
      const onDelete = vi.fn();

      render(
        <TodoList todos={todos} onToggle={onToggle} onDelete={onDelete} />
      );

      const description = screen.getByText('Completed todo');
      expect(description).toHaveClass('completed');
    });

    it('should not apply strikethrough styling to pending todos', () => {
      const todos: Todo[] = [
        {
          id: '1',
          description: 'Pending todo',
          completed: false,
        },
      ];

      const onToggle = vi.fn();
      const onDelete = vi.fn();

      render(
        <TodoList todos={todos} onToggle={onToggle} onDelete={onDelete} />
      );

      const description = screen.getByText('Pending todo');
      expect(description).not.toHaveClass('completed');
    });

    it('should render all todos in a list when multiple todos are present', () => {
      // **Validates: Requirements 2.1**
      const todos: Todo[] = [
        { id: '1', description: 'Buy groceries', completed: false },
        { id: '2', description: 'Walk the dog', completed: false },
        { id: '3', description: 'Complete project', completed: true },
      ];

      const onToggle = vi.fn();
      const onDelete = vi.fn();

      render(
        <TodoList todos={todos} onToggle={onToggle} onDelete={onDelete} />
      );

      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByText('Walk the dog')).toBeInTheDocument();
      expect(screen.getByText('Complete project')).toBeInTheDocument();
    });

    it('should display empty state message when list is empty', () => {
      // **Validates: Requirements 4.2**
      const onToggle = vi.fn();
      const onDelete = vi.fn();

      render(
        <TodoList todos={[]} onToggle={onToggle} onDelete={onDelete} />
      );

      expect(screen.getByText('No todos yet. Add one to get started!')).toBeInTheDocument();
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('should apply strikethrough styling to all completed todos', () => {
      // **Validates: Requirements 3.2, 3.3**
      const todos: Todo[] = [
        { id: '1', description: 'Completed task', completed: true },
        { id: '2', description: 'Pending task', completed: false },
      ];

      const onToggle = vi.fn();
      const onDelete = vi.fn();

      render(
        <TodoList todos={todos} onToggle={onToggle} onDelete={onDelete} />
      );

      const completedText = screen.getByText('Completed task');
      const pendingText = screen.getByText('Pending task');

      expect(completedText).toHaveClass('completed');
      expect(pendingText).not.toHaveClass('completed');
    });
  });
});

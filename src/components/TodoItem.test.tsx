import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './TodoItem';
import type { Todo } from '../types';

describe('TodoItem', () => {
  it('should render todo description text', () => {
    const todo: Todo = {
      id: '1',
      description: 'Test todo',
      completed: false,
    };

    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
    );

    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is not completed', () => {
    const todo: Todo = {
      id: '1',
      description: 'Test todo',
      completed: false,
    };

    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('should render checked checkbox when todo is completed', () => {
    const todo: Todo = {
      id: '1',
      description: 'Test todo',
      completed: true,
    };

    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('should call onToggle with correct id when checkbox is clicked', async () => {
    const todo: Todo = {
      id: 'test-id-123',
      description: 'Test todo',
      completed: false,
    };

    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
    );

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(onToggle).toHaveBeenCalledWith('test-id-123');
  });

  it('should call onDelete with correct id when delete button is clicked', async () => {
    const todo: Todo = {
      id: 'test-id-456',
      description: 'Test todo',
      completed: false,
    };

    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
    );

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    await userEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith('test-id-456');
  });

  it('should apply completed class to description when todo is completed', () => {
    const todo: Todo = {
      id: '1',
      description: 'Completed todo',
      completed: true,
    };

    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
    );

    const description = screen.getByText('Completed todo');
    expect(description).toHaveClass('completed');
  });

  it('should not apply completed class when todo is not completed', () => {
    const todo: Todo = {
      id: '1',
      description: 'Pending todo',
      completed: false,
    };

    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
    );

    const description = screen.getByText('Pending todo');
    expect(description).not.toHaveClass('completed');
  });
});

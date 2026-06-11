import type { Todo } from '../types';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * TodoItem component renders a single todo item with toggle and delete functionality
 */
export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Toggle completion for ${todo.description}`}
      />
      <span
        className={`todo-description ${todo.completed ? 'completed' : ''}`}
      >
        {todo.description}
      </span>
      <button
        className="todo-delete-btn"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete ${todo.description}`}
      >
        ×
      </button>
    </li>
  );
}

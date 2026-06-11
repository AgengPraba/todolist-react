import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TodoRepository } from './TodoRepository';
import type { Todo } from '../types/index';

describe('TodoRepository', () => {
  let repository: TodoRepository;

  beforeEach(() => {
    repository = new TodoRepository();
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('save()', () => {
    it('should persist todos to localStorage', () => {
      const todos: Todo[] = [
        { id: '1', description: 'Buy milk', completed: false },
        { id: '2', description: 'Do laundry', completed: true },
      ];

      repository.save(todos);

      const stored = localStorage.getItem('todolist_todos');
      expect(stored).toBeDefined();
      const parsed = JSON.parse(stored!);
      expect(parsed).toEqual(todos);
    });

    it('should save empty array', () => {
      repository.save([]);

      const stored = localStorage.getItem('todolist_todos');
      expect(stored).toBe('[]');
    });

    it('should overwrite previous todos when saving', () => {
      const todos1: Todo[] = [{ id: '1', description: 'Task 1', completed: false }];
      const todos2: Todo[] = [{ id: '2', description: 'Task 2', completed: true }];

      repository.save(todos1);
      repository.save(todos2);

      const stored = localStorage.getItem('todolist_todos');
      const parsed = JSON.parse(stored!);
      expect(parsed).toEqual(todos2);
      expect(parsed).not.toEqual(todos1);
    });

    it('should handle storage quota exceeded gracefully', () => {
      const todos: Todo[] = [
        { id: '1', description: 'Task', completed: false },
      ];

      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        repository.save(todos);
      }).not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save todos to localStorage:',
        expect.any(Error)
      );

      setItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('load()', () => {
    it('should load todos from localStorage', () => {
      const todos: Todo[] = [
        { id: '1', description: 'Buy milk', completed: false },
        { id: '2', description: 'Do laundry', completed: true },
      ];

      repository.save(todos);
      const loaded = repository.load();

      expect(loaded).toEqual(todos);
    });

    it('should return empty array when no todos are saved', () => {
      const loaded = repository.load();

      expect(loaded).toEqual([]);
    });

    it('should return empty array on empty string in localStorage', () => {
      localStorage.setItem('todolist_todos', '');
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const loaded = repository.load();

      expect(loaded).toEqual([]);
      consoleSpy.mockRestore();
    });

    it('should handle corrupted JSON data gracefully', () => {
      localStorage.setItem('todolist_todos', '{invalid json}');
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const loaded = repository.load();

      expect(loaded).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to parse todos from localStorage: invalid JSON',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should handle non-array data in localStorage', () => {
      localStorage.setItem('todolist_todos', JSON.stringify({ todos: [] }));
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const loaded = repository.load();

      expect(loaded).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Corrupted todo data: expected array, got',
        'object'
      );

      consoleSpy.mockRestore();
    });

    it('should filter out invalid todo items', () => {
      const corruptedData = [
        { id: '1', description: 'Valid todo', completed: false },
        { id: '2', description: 'Missing completed field' },
        { id: '3', description: 'Invalid completed', completed: 'yes' },
        { description: 'Missing id', completed: true },
        null,
        'not an object',
      ];

      localStorage.setItem('todolist_todos', JSON.stringify(corruptedData));
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const loaded = repository.load();

      expect(loaded).toHaveLength(1);
      expect(loaded[0]).toEqual({ id: '1', description: 'Valid todo', completed: false });
      expect(consoleSpy).toHaveBeenCalledTimes(5); // Called for each invalid item

      consoleSpy.mockRestore();
    });

    it('should preserve todo properties during save and load cycle', () => {
      const originalTodos: Todo[] = [
        { id: 'uuid-1', description: 'Buy groceries', completed: false },
        { id: 'uuid-2', description: 'Call dentist', completed: true },
        { id: 'uuid-3', description: 'Fix the bug', completed: false },
      ];

      repository.save(originalTodos);
      const loadedTodos = repository.load();

      expect(loadedTodos).toEqual(originalTodos);
      expect(loadedTodos).toHaveLength(3);
      loadedTodos.forEach((todo, index) => {
        expect(todo.id).toBe(originalTodos[index].id);
        expect(todo.description).toBe(originalTodos[index].description);
        expect(todo.completed).toBe(originalTodos[index].completed);
      });
    });
  });

  describe('integration', () => {
    it('should handle multiple save/load cycles', () => {
      const todos1: Todo[] = [{ id: '1', description: 'Task 1', completed: false }];
      const todos2: Todo[] = [
        { id: '1', description: 'Task 1', completed: true },
        { id: '2', description: 'Task 2', completed: false },
      ];

      repository.save(todos1);
      expect(repository.load()).toEqual(todos1);

      repository.save(todos2);
      expect(repository.load()).toEqual(todos2);
    });
  });
});

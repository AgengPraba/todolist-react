import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { TodoStore } from './TodoStore';
import type { Todo } from '../types/index';

describe('TodoStore', () => {
  let store: TodoStore;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Create a new store instance
    store = new TodoStore();
  });

  describe('TodoStore initialization', () => {
    it('should initialize with empty todos and "All" filter', () => {
      const store = new TodoStore();
      expect(store.getTodos()).toEqual([]);
      expect(store.getFilter()).toBe('All');
    });
  });

  describe('addTodo', () => {
    it('should add a todo with a valid description', () => {
      const todo = store.addTodo('Buy groceries');
      expect(todo).not.toBeNull();
      expect(todo?.description).toBe('Buy groceries');
      expect(todo?.completed).toBe(false);
      expect(todo?.id).toBeDefined();
    });

    it('should reject empty string', () => {
      const todo = store.addTodo('');
      expect(todo).toBeNull();
      expect(store.getTodos()).toHaveLength(0);
    });

    it('should reject whitespace-only string', () => {
      const todo = store.addTodo('   ');
      expect(todo).toBeNull();
      expect(store.getTodos()).toHaveLength(0);
    });

    it('should trim description before adding', () => {
      const todo = store.addTodo('  Buy groceries  ');
      expect(todo?.description).toBe('Buy groceries');
    });

    it('should persist todo to localStorage after adding', () => {
      store.addTodo('Test todo');
      const stored = localStorage.getItem('todolist_todos');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
    });

    it('should generate unique IDs for different todos', () => {
      const todo1 = store.addTodo('First todo');
      const todo2 = store.addTodo('Second todo');
      expect(todo1?.id).not.toBe(todo2?.id);
    });

    // Property test: Property 1 - Adding a todo grows list by one
    it('Property 1: Adding a valid todo grows the list by one', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (description) => {
          const store = new TodoStore();
          const initialLength = store.getTodos().length;
          const trimmed = description.trim();
          
          // Only test if description is not empty/whitespace after trimming
          if (trimmed.length === 0) {
            return true;
          }

          store.addTodo(description);
          const finalLength = store.getTodos().length;
          
          return finalLength === initialLength + 1;
        })
      );
    });

    // Property test: Property 2 - Empty and whitespace inputs rejected
    it('Property 2: Empty and whitespace-only inputs are rejected', () => {
      fc.assert(
        fc.property(fc.string({ maxLength: 100 }), (description) => {
          const store = new TodoStore();
          const result = store.addTodo(description);

          // If input is empty or whitespace-only, should be rejected
          if (description.trim().length === 0) {
            return result === null && store.getTodos().length === 0;
          }

          // If input is valid, should be added
          return result !== null && store.getTodos().length === 1;
        })
      );
    });
  });

  describe('getTodos with filtering', () => {
    beforeEach(() => {
      store.addTodo('Buy milk');
      store.addTodo('Walk dog');
      store.addTodo('Clean house');
      store.toggleTodo(store.getAllTodos()[0].id);
    });

    it('should return all todos when filter is "All"', () => {
      store.setFilter('All');
      expect(store.getTodos()).toHaveLength(3);
    });

    it('should return only active todos when filter is "Active"', () => {
      store.setFilter('Active');
      const active = store.getTodos();
      expect(active).toHaveLength(2);
      expect(active.every(t => !t.completed)).toBe(true);
    });

    it('should return only completed todos when filter is "Completed"', () => {
      store.setFilter('Completed');
      const completed = store.getTodos();
      expect(completed).toHaveLength(1);
      expect(completed.every(t => t.completed)).toBe(true);
    });

    // Property test: Property 4 - All filter shows all todos
    it('Property 4: Setting filter to "All" displays all todos', () => {
      fc.assert(
        fc.property(fc.array(fc.string({ minLength: 1 }), { minLength: 1 }), (descriptions) => {
          const store = new TodoStore();
          
          // Add all todos
          descriptions.forEach(desc => {
            store.addTodo(desc);
          });

          // Toggle some to completed (based on their index)
          store.getAllTodos().forEach((todo, index) => {
            if (index % 2 === 0) {
              store.toggleTodo(todo.id);
            }
          });

          store.setFilter('All');
          return store.getTodos().length === store.getAllTodos().length;
        })
      );
    });

    // Property test: Property 5 - Active filter shows only active todos
    it('Property 5: Setting filter to "Active" displays only active todos', () => {
      fc.assert(
        fc.property(fc.array(fc.string({ minLength: 1 }), { minLength: 1 }), (descriptions) => {
          const store = new TodoStore();

          descriptions.forEach(desc => {
            store.addTodo(desc);
          });

          // Toggle some to completed
          store.getAllTodos().forEach((todo, index) => {
            if (index % 2 === 0) {
              store.toggleTodo(todo.id);
            }
          });

          store.setFilter('Active');
          const filtered = store.getTodos();
          const expected = store.getAllTodos().filter(t => !t.completed).length;

          return filtered.length === expected && filtered.every(t => !t.completed);
        })
      );
    });

    // Property test: Property 6 - Completed filter shows only completed todos
    it('Property 6: Setting filter to "Completed" displays only completed todos', () => {
      fc.assert(
        fc.property(fc.array(fc.string({ minLength: 1 }), { minLength: 1 }), (descriptions) => {
          const store = new TodoStore();

          descriptions.forEach(desc => {
            store.addTodo(desc);
          });

          // Toggle some to completed
          store.getAllTodos().forEach((todo, index) => {
            if (index % 2 === 0) {
              store.toggleTodo(todo.id);
            }
          });

          store.setFilter('Completed');
          const filtered = store.getTodos();
          const expected = store.getAllTodos().filter(t => t.completed).length;

          return filtered.length === expected && filtered.every(t => t.completed);
        })
      );
    });
  });

  describe('toggleTodo', () => {
    it('should toggle todo from incomplete to complete', () => {
      const todo = store.addTodo('Test todo');
      if (!todo) throw new Error('Failed to add todo');

      store.toggleTodo(todo.id);
      const updated = store.getAllTodos().find(t => t.id === todo.id);
      expect(updated?.completed).toBe(true);
    });

    it('should toggle todo from complete to incomplete', () => {
      const todo = store.addTodo('Test todo');
      if (!todo) throw new Error('Failed to add todo');

      store.toggleTodo(todo.id);
      store.toggleTodo(todo.id);
      const updated = store.getAllTodos().find(t => t.id === todo.id);
      expect(updated?.completed).toBe(false);
    });

    it('should return null for non-existent todo', () => {
      const result = store.toggleTodo('non-existent-id');
      expect(result).toBeNull();
    });

    it('should persist changes to localStorage', () => {
      const todo = store.addTodo('Test todo');
      if (!todo) throw new Error('Failed to add todo');

      store.toggleTodo(todo.id);
      const stored = localStorage.getItem('todolist_todos');
      const parsed = JSON.parse(stored!);
      expect(parsed[0].completed).toBe(true);
    });

    // Property test: Property 7 - Toggling inverts completion status
    it('Property 7: Toggling a todo inverts its completion status', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (description) => {
          const store = new TodoStore();
          const todo = store.addTodo(description);
          if (!todo) return true;

          const initialStatus = todo.completed;
          store.toggleTodo(todo.id);
          const updated = store.getAllTodos().find(t => t.id === todo.id);

          return updated?.completed === !initialStatus;
        })
      );
    });
  });

  describe('deleteTodo', () => {
    it('should delete an existing todo', () => {
      const todo = store.addTodo('Delete me');
      if (!todo) throw new Error('Failed to add todo');

      const initialLength = store.getTodos().length;
      const deleted = store.deleteTodo(todo.id);

      expect(deleted).toBe(true);
      expect(store.getTodos()).toHaveLength(initialLength - 1);
      expect(store.getAllTodos().find(t => t.id === todo.id)).toBeUndefined();
    });

    it('should return false for non-existent todo', () => {
      const deleted = store.deleteTodo('non-existent-id');
      expect(deleted).toBe(false);
    });

    it('should persist deletion to localStorage', () => {
      const todo = store.addTodo('Delete me');
      if (!todo) throw new Error('Failed to add todo');

      store.deleteTodo(todo.id);
      const stored = localStorage.getItem('todolist_todos');
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(0);
    });

    // Property test: Property 9 - Deleting removes todo from list
    it('Property 9: Deleting a todo removes it from the list', () => {
      fc.assert(
        fc.property(fc.array(fc.string({ minLength: 1 }), { minLength: 1 }), (descriptions) => {
          const store = new TodoStore();

          const todos = descriptions
            .map(desc => store.addTodo(desc))
            .filter((t): t is Todo => t !== null);

          if (todos.length === 0) return true;

          const todoToDelete = todos[0];
          const initialLength = store.getAllTodos().length;

          store.deleteTodo(todoToDelete.id);

          return (
            store.getAllTodos().length === initialLength - 1 &&
            !store.getAllTodos().find(t => t.id === todoToDelete.id)
          );
        })
      );
    });
  });

  describe('clearCompleted', () => {
    beforeEach(() => {
      store.addTodo('Task 1');
      store.addTodo('Task 2');
      store.addTodo('Task 3');
      store.toggleTodo(store.getAllTodos()[0].id);
      store.toggleTodo(store.getAllTodos()[1].id);
    });

    it('should remove all completed todos', () => {
      const initialCompleted = store.getCompletedCount();
      expect(initialCompleted).toBe(2);

      const removed = store.clearCompleted();

      expect(removed).toBe(2);
      expect(store.getCompletedCount()).toBe(0);
      expect(store.getTodos()).toHaveLength(1);
    });

    it('should persist changes to localStorage', () => {
      store.clearCompleted();
      const stored = localStorage.getItem('todolist_todos');
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
    });

    it('should return 0 if no completed todos', () => {
      store.clearCompleted();
      const removed = store.clearCompleted();
      expect(removed).toBe(0);
    });

    // Property test: Property 13 - Clear completed removes all completed items
    it('Property 13: Clear completed removes all completed items', () => {
      fc.assert(
        fc.property(fc.array(fc.string({ minLength: 1 }), { minLength: 1 }), (descriptions) => {
          const store = new TodoStore();

          descriptions.forEach(desc => {
            store.addTodo(desc);
          });

          // Mark some as completed
          store.getAllTodos().forEach((todo, index) => {
            if (index % 2 === 0) {
              store.toggleTodo(todo.id);
            }
          });

          store.clearCompleted();

          // After clearing, should have no completed todos
          return store.getAllTodos().every(t => !t.completed);
        })
      );
    });
  });

  describe('filter management', () => {
    it('should start with "All" filter', () => {
      expect(store.getFilter()).toBe('All');
    });

    it('should set filter to "Active"', () => {
      store.setFilter('Active');
      expect(store.getFilter()).toBe('Active');
    });

    it('should set filter to "Completed"', () => {
      store.setFilter('Completed');
      expect(store.getFilter()).toBe('Completed');
    });

    it('should change filter back to "All"', () => {
      store.setFilter('Active');
      store.setFilter('All');
      expect(store.getFilter()).toBe('All');
    });
  });

  describe('getAllTodos', () => {
    it('should return all todos regardless of filter', () => {
      store.addTodo('Task 1');
      store.addTodo('Task 2');
      store.toggleTodo(store.getAllTodos()[0].id);

      store.setFilter('Active');
      expect(store.getTodos()).toHaveLength(1);
      expect(store.getAllTodos()).toHaveLength(2);
    });
  });

  describe('getCompletedCount', () => {
    it('should return count of completed todos', () => {
      store.addTodo('Task 1');
      store.addTodo('Task 2');
      store.addTodo('Task 3');

      store.toggleTodo(store.getAllTodos()[0].id);
      store.toggleTodo(store.getAllTodos()[2].id);

      expect(store.getCompletedCount()).toBe(2);
    });

    it('should return 0 if no todos completed', () => {
      store.addTodo('Task 1');
      store.addTodo('Task 2');
      expect(store.getCompletedCount()).toBe(0);
    });
  });

  describe('getActiveCount', () => {
    it('should return count of active todos', () => {
      store.addTodo('Task 1');
      store.addTodo('Task 2');
      store.addTodo('Task 3');

      store.toggleTodo(store.getAllTodos()[0].id);

      expect(store.getActiveCount()).toBe(2);
    });

    it('should return 0 if all todos completed', () => {
      store.addTodo('Task 1');
      store.addTodo('Task 2');

      store.getAllTodos().forEach(todo => {
        store.toggleTodo(todo.id);
      });

      expect(store.getActiveCount()).toBe(0);
    });
  });

  describe('load', () => {
    it('should load todos from localStorage on initialization', () => {
      // Add some todos
      store.addTodo('Test 1');
      store.addTodo('Test 2');

      // Create a new store and load
      const newStore = new TodoStore();
      expect(newStore.getAllTodos()).toHaveLength(0); // Haven't loaded yet

      newStore.initialize();
      expect(newStore.getAllTodos()).toHaveLength(2);
    });

    it('should handle empty localStorage gracefully', () => {
      const newStore = new TodoStore();
      newStore.initialize();
      expect(newStore.getAllTodos()).toHaveLength(0);
    });
  });

  describe('integration tests', () => {
    it('should handle multiple operations in sequence', () => {
      // Add todos
      const todo1 = store.addTodo('First task');
      const todo2 = store.addTodo('Second task');
      store.addTodo('Third task');

      expect(store.getAllTodos()).toHaveLength(3);

      // Toggle one
      if (todo1) store.toggleTodo(todo1.id);

      expect(store.getCompletedCount()).toBe(1);
      expect(store.getActiveCount()).toBe(2);

      // Filter to active
      store.setFilter('Active');
      expect(store.getTodos()).toHaveLength(2);

      // Delete one
      if (todo2) store.deleteTodo(todo2.id);

      expect(store.getAllTodos()).toHaveLength(2);
      expect(store.getTodos()).toHaveLength(1);

      // Clear completed
      const removed = store.clearCompleted();
      expect(removed).toBe(1);
      expect(store.getAllTodos()).toHaveLength(1);
    });

    it('should persist and restore state across store instances', () => {
      // Add todos in first store
      store.addTodo('Task 1');
      store.addTodo('Task 2');
      store.toggleTodo(store.getAllTodos()[0].id);

      // Create new store and load
      const newStore = new TodoStore();
      newStore.initialize();

      expect(newStore.getAllTodos()).toHaveLength(2);
      expect(newStore.getCompletedCount()).toBe(1);
      expect(newStore.getActiveCount()).toBe(1);
    });
  });
});

import type { Todo } from '@/types/todo';

// In-memory storage for demo purposes
// In production, use a real database (PostgreSQL, MongoDB, etc.)
export class TodoStore {
  private todos: Todo[] = [
    {
      id: 1,
      title: 'Learn SWR basics',
      completed: true,
      createdAt: new Date('2026-02-28T10:00:00Z').toISOString(),
      updatedAt: new Date('2026-02-28T10:00:00Z').toISOString(),
    },
    {
      id: 2,
      title: 'Master React Query',
      completed: false,
      createdAt: new Date('2026-02-28T11:00:00Z').toISOString(),
      updatedAt: new Date('2026-02-28T11:00:00Z').toISOString(),
    },
    {
      id: 3,
      title: 'Implement cache strategies',
      completed: false,
      createdAt: new Date('2026-02-28T12:00:00Z').toISOString(),
      updatedAt: new Date('2026-02-28T12:00:00Z').toISOString(),
    },
    {
      id: 4,
      title: 'Build production app',
      completed: false,
      createdAt: new Date('2026-03-01T09:00:00Z').toISOString(),
      updatedAt: new Date('2026-03-01T09:00:00Z').toISOString(),
    },
    {
      id: 5,
      title: 'Test error handling',
      completed: false,
      createdAt: new Date('2026-03-01T10:00:00Z').toISOString(),
      updatedAt: new Date('2026-03-01T10:00:00Z').toISOString(),
    },
  ];

  private nextId = 6;

  getAll(): Todo[] {
    return [...this.todos];
  }

  getById(id: number): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  create(title: string, completed = false): Todo {
    const newTodo: Todo = {
      id: this.nextId++,
      title: title.trim(),
      completed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.todos.unshift(newTodo);
    return newTodo;
  }

  update(
    id: number,
    updates: { title?: string; completed?: boolean },
  ): Todo | null {
    const index = this.todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      return null;
    }

    this.todos[index] = {
      ...this.todos[index],
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.completed !== undefined && { completed: updates.completed }),
      updatedAt: new Date().toISOString(),
    };

    return this.todos[index];
  }

  delete(id: number): boolean {
    const index = this.todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      return false;
    }

    this.todos.splice(index, 1);
    return true;
  }
}

// Singleton instance
export const todoStore = new TodoStore();

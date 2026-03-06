import type {
  Todo,
  PaginatedTodos,
  CreateTodoDto,
  UpdateTodoDto,
} from '@/types/todo';

export const todosApi = {
  fetchTodos: async (
    page: number,
    pageSize: number,
    completedFilter?: boolean,
    search?: string,
  ): Promise<PaginatedTodos> => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(completedFilter !== undefined && {
        completed: completedFilter.toString(),
      }),
      ...(search && { search }),
    });

    const res = await fetch(`/api/todos?${params}`);
    if (!res.ok) throw new Error('Failed to fetch todos');
    return res.json();
  },

  fetchTodo: async (id: number): Promise<Todo> => {
    const res = await fetch(`/api/todos/${id}`);
    if (!res.ok) throw new Error('Failed to fetch todo');
    return res.json();
  },

  createTodo: async (data: CreateTodoDto): Promise<Todo> => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create todo');
    return res.json();
  },

  updateTodo: async (id: number, data: UpdateTodoDto): Promise<Todo> => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update todo');
    return res.json();
  },

  deleteTodo: async (id: number): Promise<void> => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete todo');
  },
};

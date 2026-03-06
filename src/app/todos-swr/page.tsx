'use client';

import { useState } from 'react';
import type { UpdateTodoDto } from '@/types/todo';
import { useTodos } from './hooks/useTodos';
import {
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
} from './hooks/useTodoMutations';
import { TodoForm } from '@/components/todos/TodoForm';
import { TodoFilters } from '@/components/todos/TodoFilters';
import { TodoList } from '@/components/todos/TodoList';
import { Pagination } from '@/components/todos/Pagination';

export default function TodosSWRPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [completedFilter, setCompletedFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [search, setSearch] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const { todos, isLoading, isError, mutate } = useTodos(
    page,
    pageSize,
    completedFilter,
    search,
  );
  const { createTodo, isCreating, error: createError } = useCreateTodo();
  const { updateTodo, isUpdating } = useUpdateTodo();
  const { deleteTodo, isDeleting } = useDeleteTodo();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      await createTodo({ title: newTodoTitle });
      setNewTodoTitle('');

      mutate();
    } catch (err) {
      console.error('Failed to create todo:', err);
    }
  };

  const handleUpdate = async (id: number, data: UpdateTodoDto) => {
    try {
      await updateTodo({ id, data });

      mutate();
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);

      mutate();
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterChange = (filter: boolean | undefined) => {
    setCompletedFilter(filter);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-50 mb-2">SWR Todos</h1>
        </div>

        <TodoForm
          value={newTodoTitle}
          onChange={setNewTodoTitle}
          onSubmit={handleCreate}
          isCreating={isCreating}
          error={createError}
        />

        <TodoFilters
          search={search}
          onSearchChange={handleSearchChange}
          completedFilter={completedFilter}
          onFilterChange={handleFilterChange}
        />

        <TodoList
          todos={todos}
          isLoading={isLoading}
          isError={isError}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onRetry={() => mutate()}
          search={search}
          completedFilter={completedFilter}
        />

        {todos && (
          <Pagination
            todos={todos}
            page={page}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        )}

        {(isUpdating || isDeleting) && (
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              {isUpdating && 'Updating...'}
              {isDeleting && 'Deleting...'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

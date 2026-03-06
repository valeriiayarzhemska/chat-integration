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

export default function TodosReactQueryPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [completedFilter, setCompletedFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [search, setSearch] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const {
    data: todos,
    isLoading,
    error,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useTodos(page, pageSize, completedFilter, search);

  const createMutation = useCreateTodo();
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      await createMutation.mutateAsync({ title: newTodoTitle });
      setNewTodoTitle('');
      setPage(1); // Go to first page to see new todo
    } catch {
      // Error handling done in mutation
    }
  };

  const handleUpdate = async (id: number, data: UpdateTodoDto) => {
    try {
      await updateMutation.mutateAsync({ id, data });
    } catch {
      // Error handling done in mutation
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch {
      // Error handling done in mutation
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
          <h1 className="text-4xl font-bold text-gray-50 mb-2">
            React Query Todos
          </h1>
        </div>

        <TodoForm
          value={newTodoTitle}
          onChange={setNewTodoTitle}
          onSubmit={handleCreate}
          isCreating={createMutation.isPending}
          error={createMutation.error}
        />

        <TodoFilters
          search={search}
          onSearchChange={handleSearchChange}
          completedFilter={completedFilter}
          onFilterChange={handleFilterChange}
        />

        {isFetching && !isLoading && (
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-green-600 border-t-transparent"></div>
              Updating...
            </span>
          </div>
        )}

        <TodoList
          todos={todos}
          isLoading={isLoading}
          isError={error instanceof Error ? error : undefined}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onRetry={() => refetch()}
          search={search}
          completedFilter={completedFilter}
        />

        {todos && (
          <Pagination
            todos={todos}
            page={page}
            onPageChange={setPage}
            isLoading={isPlaceholderData}
          />
        )}

        {(updateMutation.isPending || deleteMutation.isPending) && (
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
              {updateMutation.isPending && 'Updating...'}
              {deleteMutation.isPending && 'Deleting...'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateTodoDto, PaginatedTodos, Todo } from '@/types/todo';
import { todosApi } from '../api/todosApi';
import { todoKeys } from '../lib/queryKeys';

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.createTodo,

    // OPTIMISTIC UPDATE
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(todoKeys.lists());

      // Optimistically update to the new value
      // Note: This is simplified - in production, update specific query keys

      return { previousTodos };
    },

    // ERROR HANDLING with rollback
    onError: (err, newTodo, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.lists(), context.previousTodos);
      }
      console.error('Create todo error:', err);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTodoDto }) =>
      todosApi.updateTodo(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });

      const previousTodos = queryClient.getQueryData(todoKeys.lists());

      queryClient.setQueriesData<PaginatedTodos>(
        { queryKey: todoKeys.lists() },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((todo: Todo) =>
              todo.id === id ? { ...todo, ...data } : todo,
            ),
          };
        },
      );

      return { previousTodos };
    },

    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.lists(), context.previousTodos);
      }
      console.error('Update todo error:', err);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.deleteTodo,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });

      const previousTodos = queryClient.getQueryData(todoKeys.lists());

      queryClient.setQueriesData<PaginatedTodos>(
        { queryKey: todoKeys.lists() },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((todo: Todo) => todo.id !== id),
            total: old.total - 1,
          };
        },
      );

      return { previousTodos };
    },

    onError: (err, id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.lists(), context.previousTodos);
      }
      console.error('Delete todo error:', err);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}

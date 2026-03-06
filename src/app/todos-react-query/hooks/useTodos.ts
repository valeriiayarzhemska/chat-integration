import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { todosApi } from '../api/todosApi';
import { todoKeys } from '../lib/queryKeys';

export function useTodos(
  page: number,
  pageSize: number,
  completedFilter?: boolean,
  search?: string,
) {
  return useQuery({
    queryKey: todoKeys.list(page, pageSize, completedFilter, search),
    queryFn: () => todosApi.fetchTodos(page, pageSize, completedFilter, search),

    // PERFORMANCE TUNING
    placeholderData: keepPreviousData, // Keep previous data while fetching new page
    staleTime: 30 * 1000, // Data is fresh for 30 seconds
    gcTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

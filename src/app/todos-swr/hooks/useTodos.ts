import useSWR from 'swr';
import type { PaginatedTodos } from '@/types/todo';
import { fetcher } from '../lib/fetcher';
import { todoCacheKeys } from '../lib/cacheKeys';

export function useTodos(
  page: number,
  pageSize: number,
  completedFilter?: boolean,
  search?: string,
) {
  const cacheKey = todoCacheKeys.list({
    page,
    pageSize,
    completed: completedFilter,
    search,
  });

  const { data, error, isLoading, mutate } = useSWR<PaginatedTodos>(
    cacheKey,
    fetcher,
    {
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      revalidateIfStale: true,
      keepPreviousData: true, // Keep previous data while fetching new data
    },
  );

  return {
    todos: data,
    isLoading,
    isError: error,
    mutate,
  };
}

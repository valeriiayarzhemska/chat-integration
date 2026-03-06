/**
 * Query Keys Factory
 * Centralized query keys for consistency and type safety
 * React Query best practice: hierarchical key structure
 */
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (
    page: number,
    pageSize: number,
    completed?: boolean,
    search?: string,
  ) => [...todoKeys.lists(), { page, pageSize, completed, search }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
};

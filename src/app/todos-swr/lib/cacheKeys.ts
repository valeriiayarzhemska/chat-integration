interface TodosListParams {
  page: number;
  pageSize: number;
  completed?: boolean;
  search?: string;
}

export const todoCacheKeys = {
  all: () => ['/api/todos'] as const,

  lists: () => [...todoCacheKeys.all(), 'list'] as const,

  list: (params: TodosListParams) => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.completed !== undefined && {
        completed: params.completed.toString(),
      }),
      ...(params.search && { search: params.search }),
    });

    return `/api/todos?${queryParams}`;
  },

  detail: (id: number) => `/api/todos/${id}` as const,

  allListsPattern: () => (key: string) =>
    typeof key === 'string' && key.startsWith('/api/todos?'),
};

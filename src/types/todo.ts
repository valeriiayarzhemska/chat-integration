export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoDto {
  title: string;
  completed?: boolean;
}

export interface UpdateTodoDto {
  title?: string;
  completed?: boolean;
}

export interface PaginatedTodos {
  data: Todo[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TodosQueryParams {
  page?: number;
  pageSize?: number;
  completed?: boolean;
  search?: string;
}

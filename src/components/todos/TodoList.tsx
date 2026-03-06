import type { UpdateTodoDto, PaginatedTodos } from '@/types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos?: PaginatedTodos;
  isLoading: boolean;
  isError?: Error;
  onUpdate: (id: number, data: UpdateTodoDto) => void;
  onDelete: (id: number) => void;
  onRetry: () => void;
  search: string;
  completedFilter?: boolean;
}

/**
 * Todo list component with loading, error, and empty states
 * Renders the list of todos with pagination info
 */
export function TodoList({
  todos,
  isLoading,
  isError,
  onUpdate,
  onDelete,
  onRetry,
  search,
  completedFilter,
}: TodoListProps) {
  // Error state
  if (isError) {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-medium">Error loading todos</p>
        <p className="text-red-600 text-sm mt-1">
          {isError instanceof Error ? isError.message : 'Something went wrong'}
        </p>
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading todos...</p>
      </div>
    );
  }

  // Empty state
  if (!todos || todos.data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-500 text-lg">No todos found</p>
        <p className="text-gray-400 text-sm mt-2">
          {search || completedFilter !== undefined
            ? 'Try adjusting your filters'
            : 'Create your first todo above'}
        </p>
      </div>
    );
  }

  // Todo list
  return (
    <div className="space-y-3 mb-6">
      {todos.data.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

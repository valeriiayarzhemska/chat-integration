import type { PaginatedTodos } from '@/types/todo';

interface PaginationProps {
  todos: PaginatedTodos;
  page: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function Pagination({
  todos,
  page,
  onPageChange,
  isLoading,
}: PaginationProps) {
  if (todos.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between bg-gray-900 rounded-lg shadow-md p-4">
      <div className="text-sm text-gray-300">
        Page {todos.page} of {todos.totalPages} ({todos.total} total)
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || isLoading}
          className="px-4 py-2 bg-gray-900 text-gray-300 rounded-lg hover:bg-gray-800 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= todos.totalPages || isLoading}
          className="px-4 py-2 bg-gray-900 text-gray-300 rounded-lg hover:bg-gray-800 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

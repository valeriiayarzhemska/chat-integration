interface TodoFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  completedFilter?: boolean;
  onFilterChange: (filter: boolean | undefined) => void;
}

export function TodoFilters({
  search,
  onSearchChange,
  completedFilter,
  onFilterChange,
}: TodoFiltersProps) {
  return (
    <div className="mb-6 bg-gray-900 rounded-lg shadow-md p-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search todos..."
            className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-gray-300"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange(undefined)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              completedFilter === undefined
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>

          <button
            onClick={() => onFilterChange(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              completedFilter === false
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active
          </button>

          <button
            onClick={() => onFilterChange(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              completedFilter === true
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
    </div>
  );
}

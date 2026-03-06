import { FormEvent } from 'react';

interface TodoFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isCreating: boolean;
  error?: Error | null;
}

export function TodoForm({
  value,
  onChange,
  onSubmit,
  isCreating,
  error,
}: TodoFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 bg-gray-900 rounded-lg shadow-md p-6"
    >
      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-900 text-gray-300"
          disabled={isCreating}
        />

        <button
          type="submit"
          disabled={isCreating || !value.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isCreating ? 'Adding...' : 'Add Todo'}
        </button>

      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          Failed to create todo: {error?.message || 'Please try again.'}
        </p>
      )}
    </form>
  );
}

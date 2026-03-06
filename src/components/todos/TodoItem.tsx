import { useState } from 'react';
import type { Todo, UpdateTodoDto } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, data: UpdateTodoDto) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      onUpdate(todo.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg shadow-sm border border-gray-700 hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={(e) => onUpdate(todo.id, { completed: e.target.checked })}
        className="w-5 h-5 rounded border-gray-700 text-blue-600 focus:ring-blue-500"
      />

      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') {
              setEditTitle(todo.title);
              setIsEditing(false);
            }
          }}
          className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-gray-300"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-300'}`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-950 rounded transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>

        <button
          onClick={() => onDelete(todo.id)}
          className="px-3 py-1 text-sm text-gray-50 hover:bg-red-800 rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef, type FormEvent } from 'react';
import type { Priority, Task } from '../../types';
import { PRIORITY_LABELS } from '../../utils/constants';

interface TaskFormProps {
  onSubmit: (data: { title: string; notes: string; priority: Priority }) => void;
  onCancel?: () => void;
  initial?: Partial<Task>;
  autoFocus?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function TaskForm({ onSubmit, onCancel, initial, autoFocus, inputRef }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'none');
  const [expanded, setExpanded] = useState(!!initial?.notes);
  const internalRef = useRef<HTMLInputElement>(null);
  const ref = (inputRef as React.RefObject<HTMLInputElement>) ?? internalRef;

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus, ref]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), notes, priority });
    setTitle('');
    setNotes('');
    setPriority('none');
    setExpanded(false);
  };

  const priorityOptions: Priority[] = ['none', 'low', 'medium', 'high'];
  const priorityColors: Record<Priority, string> = {
    none: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          ref={ref}
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Add a task…"
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
          onKeyDown={e => {
            if (e.key === 'Escape') onCancel?.();
          }}
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {initial ? 'Save' : 'Add'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {priorityOptions.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`text-xs px-2 py-0.5 rounded-full border-2 transition-colors ${priorityColors[p]} ${
                priority === p ? 'border-current' : 'border-transparent'
              }`}
            >
              {PRIORITY_LABELS[p]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="ml-auto text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {expanded ? '− notes' : '+ notes'}
        </button>
      </div>

      {expanded && (
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Optional notes…"
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm resize-none"
        />
      )}
    </form>
  );
}

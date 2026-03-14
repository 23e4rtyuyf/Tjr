import { useState, useEffect, useRef, type FormEvent, type KeyboardEvent } from 'react';
import type { Priority, Task } from '../../types';
import { PRIORITY_LABELS } from '../../utils/constants';

interface TaskFormData {
  title: string;
  notes: string;
  priority: Priority;
  estimatedPomodoros: number;
  tags: string[];
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
  initial?: Partial<Task>;
  autoFocus?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  suggestedTags?: string[];
}

export function TaskForm({ onSubmit, onCancel, initial, autoFocus, inputRef, suggestedTags = [] }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'none');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(initial?.estimatedPomodoros ?? 0);
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [expanded, setExpanded] = useState(!!initial?.notes);
  const internalRef = useRef<HTMLInputElement>(null);
  const ref = (inputRef as React.RefObject<HTMLInputElement>) ?? internalRef;

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus, ref]);

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags(prev => [...prev, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    // Commit any in-progress tag input
    const finalTags = tagInput.trim()
      ? [...new Set([...tags, tagInput.trim().toLowerCase()])]
      : tags;
    onSubmit({ title: title.trim(), notes, priority, estimatedPomodoros, tags: finalTags });
    setTitle('');
    setNotes('');
    setPriority('none');
    setEstimatedPomodoros(0);
    setTags([]);
    setTagInput('');
    setExpanded(false);
  };

  const unusedSuggestions = suggestedTags.filter(t => !tags.includes(t));

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
          placeholder="Add a task..."
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

      <div className="flex items-center gap-2 flex-wrap">
        {/* Priority buttons */}
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

        {/* Estimate stepper */}
        <div className="flex items-center gap-1 ml-1">
          {estimatedPomodoros === 0 ? (
            <button
              type="button"
              onClick={() => setEstimatedPomodoros(1)}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Set session estimate"
            >
              + estimate
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setEstimatedPomodoros(v => Math.max(0, v - 1))}
                className="w-5 h-5 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs"
              >
                −
              </button>
              <span className="text-xs text-gray-700 dark:text-gray-300 w-16 text-center">
                {estimatedPomodoros} session{estimatedPomodoros !== 1 ? 's' : ''}
              </span>
              <button
                type="button"
                onClick={() => setEstimatedPomodoros(v => v + 1)}
                className="w-5 h-5 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs"
              >
                +
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="ml-auto text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {expanded ? '- notes' : '+ notes'}
        </button>
      </div>

      {/* Tag input */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-1 min-h-[28px] px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-red-400">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-1.5 py-0.5 rounded"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-blue-400 hover:text-blue-700 dark:hover:text-blue-200 leading-none"
                aria-label={`Remove tag ${tag}`}
              >
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length === 0 ? 'Add tags...' : ''}
            className="flex-1 min-w-[80px] text-xs bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none"
          />
        </div>
        {unusedSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {unusedSuggestions.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="text-xs px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {expanded && (
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Optional notes..."
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm resize-none"
        />
      )}
    </form>
  );
}

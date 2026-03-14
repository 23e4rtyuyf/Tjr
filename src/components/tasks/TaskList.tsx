import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';
import { TaskFilters, TagFilterBar, type FilterMode, type SortMode } from './TaskFilters';
import type { Priority } from '../../types';

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2, none: 3 };

interface TaskListProps {
  newTaskInputRef: React.RefObject<HTMLInputElement | null>;
}

export function TaskList({ newTaskInputRef }: TaskListProps) {
  const { state, dispatch } = useAppContext();
  const [filter, setFilter] = useState<FilterMode>('all');
  const [sort, setSort] = useState<SortMode>('none');
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Derive all unique tags across all tasks
  const allTags = Array.from(
    new Set(state.tasks.flatMap(t => t.tags))
  ).sort();

  const toggleTag = (tag: string) => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filtered = state.tasks
    .filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .filter(t => {
      if (activeTags.length === 0) return true;
      return activeTags.some(tag => t.tags.includes(tag));
    })
    .slice()
    .sort((a, b) => {
      if (sort === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sort === 'pomodoros') return b.completedPomodoros - a.completedPomodoros;
      return 0;
    });

  const handleAdd = (data: { title: string; notes: string; priority: Priority; estimatedPomodoros: number; tags: string[] }) => {
    dispatch({ type: 'ADD_TASK', payload: { ...data, completed: false } });
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="space-y-2">
        <TaskForm onSubmit={handleAdd} inputRef={newTaskInputRef} autoFocus suggestedTags={allTags} />
        <TaskFilters filter={filter} onChange={setFilter} sort={sort} onSortChange={setSort} />
        <TagFilterBar allTags={allTags} activeTags={activeTags} onToggle={toggleTag} />
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-12">
            {activeTags.length > 0
              ? 'No tasks match the selected tags.'
              : filter === 'active'
              ? 'No active tasks.'
              : filter === 'completed'
              ? 'No completed tasks yet.'
              : 'No tasks yet — add one above!'}
          </div>
        ) : (
          filtered.map(task => <TaskItem key={task.id} task={task} allTags={allTags} />)
        )}
      </div>
    </div>
  );
}

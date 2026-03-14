import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';
import { TaskFilters, type FilterMode } from './TaskFilters';
import type { Priority } from '../../types';

interface TaskListProps {
  newTaskInputRef: React.RefObject<HTMLInputElement | null>;
}

export function TaskList({ newTaskInputRef }: TaskListProps) {
  const { state, dispatch } = useAppContext();
  const [filter, setFilter] = useState<FilterMode>('all');

  const filtered = state.tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleAdd = (data: { title: string; notes: string; priority: Priority }) => {
    dispatch({ type: 'ADD_TASK', payload: { ...data, completed: false } });
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="space-y-3">
        <TaskForm onSubmit={handleAdd} inputRef={newTaskInputRef} />
        <TaskFilters filter={filter} onChange={setFilter} />
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-12">
            {filter === 'completed' ? 'No completed tasks yet.' : 'No tasks yet — add one above!'}
          </div>
        ) : (
          filtered.map(task => <TaskItem key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}

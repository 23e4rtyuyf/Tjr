import { useAppContext } from '../../context/AppContext';

export function ActiveTaskBadge() {
  const { state, dispatch } = useAppContext();
  const { timer, tasks } = state;

  const activeTask = tasks.find(t => t.id === timer.activeTaskId);

  if (!activeTask) {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
        No task selected — pick one from the list
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 max-w-xs">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
      <span className="text-sm text-gray-700 dark:text-gray-200 truncate flex-1">
        {activeTask.title}
      </span>
      <button
        onClick={() => dispatch({ type: 'SET_ACTIVE_TASK', payload: { id: null } })}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-1 flex-shrink-0"
        title="Unlink task"
      >
        ×
      </button>
    </div>
  );
}

import { useAppContext } from '../../context/AppContext';
import { formatMinutes } from '../../utils/formatTime';

export function StatsBar() {
  const { state } = useAppContext();
  const { dailyStats } = state;
  const completedTaskCount = state.tasks.filter(t => t.completed).length;

  return (
    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
      <span title="Total focus time today">
        {formatMinutes(dailyStats.totalFocusSeconds)} focused today
      </span>
      <span className="text-gray-300 dark:text-gray-600">·</span>
      <span title="Tasks completed">
        {completedTaskCount} task{completedTaskCount !== 1 ? 's' : ''} completed
      </span>
    </div>
  );
}

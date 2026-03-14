export type FilterMode = 'all' | 'active' | 'completed';
export type SortMode = 'none' | 'priority' | 'pomodoros';

export function TaskFilters({
  filter,
  onChange,
  sort,
  onSortChange,
}: {
  filter: FilterMode;
  onChange: (f: FilterMode) => void;
  sort: SortMode;
  onSortChange: (s: SortMode) => void;
}) {
  const tabs: { key: FilterMode; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Done' },
  ];

  const sortOptions: { key: SortMode; label: string }[] = [
    { key: 'none', label: 'Order' },
    { key: 'priority', label: 'Priority' },
    { key: 'pomodoros', label: '🍅' },
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`flex-1 text-xs font-medium py-1 rounded-md transition-colors ${
              filter === t.key
                ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
        {sortOptions.map(s => (
          <button
            key={s.key}
            onClick={() => onSortChange(s.key)}
            className={`text-xs font-medium px-2 py-1 rounded-md transition-colors ${
              sort === s.key
                ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

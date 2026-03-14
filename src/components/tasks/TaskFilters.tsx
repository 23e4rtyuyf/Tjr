export type FilterMode = 'all' | 'active' | 'completed';

export function TaskFilters({
  filter,
  onChange,
}: {
  filter: FilterMode;
  onChange: (f: FilterMode) => void;
}) {
  const tabs: { key: FilterMode; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Done' },
  ];

  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
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
  );
}

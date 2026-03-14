export type FilterMode = 'all' | 'active' | 'completed';
export type SortMode = 'none' | 'priority' | 'pomodoros';

export function TagFilterBar({
  allTags,
  activeTags,
  onToggle,
}: {
  allTags: string[];
  activeTags: string[];
  onToggle: (tag: string) => void;
}) {
  if (allTags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {allTags.map(tag => {
        const active = activeTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
              active
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-300'
            }`}
          >
            {tag}
          </button>
        );
      })}
      {activeTags.length > 0 && (
        <button
          onClick={() => activeTags.forEach(t => onToggle(t))}
          className="text-xs px-2 py-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}

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
    { key: 'pomodoros', label: 'Sessions' },
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

import { StatsBar } from '../stats/StatsBar';

export function Header({ onToggleShortcuts }: { onToggleShortcuts: () => void }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <span className="text-xl">🍅</span>
        <span className="font-bold text-gray-800 dark:text-gray-100 text-lg">Pomodoro</span>
      </div>
      <StatsBar />
      <button
        onClick={onToggleShortcuts}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        title="Keyboard shortcuts (?)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </header>
  );
}

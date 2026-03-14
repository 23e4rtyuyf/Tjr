import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function todayDate(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatFocusTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function WeeklyStats({ onClose }: { onClose: () => void }) {
  const { state } = useAppContext();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Build the last 7 dates (oldest first)
  const today = todayDate();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d;
  });
  const dayKeys = days.map(dateKey);
  const todayKey = dateKey(today);

  // Aggregate minutes per day from sessionHistory
  const minutesByDay = dayKeys.map(key =>
    state.sessionHistory
      .filter(r => r.date === key)
      .reduce((sum, r) => sum + r.durationSeconds / 60, 0)
  );

  const sessionsByDay = dayKeys.map(key =>
    state.sessionHistory.filter(r => r.date === key).length
  );

  // Summary stats
  const totalMinutes = minutesByDay.reduce((s, m) => s + m, 0);
  const totalSessions = sessionsByDay.reduce((s, n) => s + n, 0);
  const maxMinutes = Math.max(...minutesByDay, 1); // avoid division by zero
  const bestDayIdx = minutesByDay.indexOf(Math.max(...minutesByDay));
  const bestDayLabel =
    minutesByDay[bestDayIdx] > 0
      ? dayKeys[bestDayIdx] === todayKey
        ? 'Today'
        : DAY_LABELS[days[bestDayIdx].getDay()]
      : '—';

  // SVG bar chart constants
  const SVG_W = 280;
  const SVG_H = 100;
  const BAR_W = 24;
  const MAX_BAR_H = 64;
  const LABEL_Y = SVG_H - 4;
  const spacing = (SVG_W - BAR_W) / 6; // distance between bar left edges

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-sm h-full flex flex-col shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Weekly Overview</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Focus time', value: formatFocusTime(totalMinutes) },
              { label: 'Sessions', value: String(totalSessions) },
              { label: 'Best day', value: bestDayLabel },
            ].map(card => (
              <div
                key={card.label}
                className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-xl py-3 px-2"
              >
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {card.value}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 text-center leading-tight">
                  {card.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
              Last 7 days
            </p>
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              width="100%"
              aria-label="Weekly focus time bar chart"
            >
              {days.map((day, i) => {
                const x = i * spacing;
                const barH = minutesByDay[i] > 0
                  ? Math.max(4, (minutesByDay[i] / maxMinutes) * MAX_BAR_H)
                  : 0;
                const barY = SVG_H - 16 - barH;
                const isToday = dayKeys[i] === todayKey;
                const label = isToday ? 'Today' : DAY_LABELS[day.getDay()];
                const minutes = Math.round(minutesByDay[i]);

                return (
                  <g key={dayKeys[i]}>
                    {/* Bar */}
                    <rect
                      x={x + (BAR_W / 2) - (BAR_W / 2)}
                      y={barH > 0 ? barY : SVG_H - 16 - 2}
                      width={BAR_W}
                      height={barH > 0 ? barH : 2}
                      rx={3}
                      className={
                        barH === 0
                          ? 'fill-gray-100 dark:fill-gray-700'
                          : isToday
                          ? 'fill-red-500'
                          : 'fill-gray-300 dark:fill-gray-500'
                      }
                    />
                    {/* Minutes label above bar */}
                    {minutes > 0 && (
                      <text
                        x={x + BAR_W / 2}
                        y={barY - 3}
                        textAnchor="middle"
                        fontSize="8"
                        className="fill-gray-500 dark:fill-gray-400"
                      >
                        {minutes}m
                      </text>
                    )}
                    {/* Day label */}
                    <text
                      x={x + BAR_W / 2}
                      y={LABEL_Y}
                      textAnchor="middle"
                      fontSize="8"
                      fontWeight={isToday ? '600' : '400'}
                      className={
                        isToday
                          ? 'fill-red-500'
                          : 'fill-gray-400 dark:fill-gray-500'
                      }
                    >
                      {label === 'Today' ? 'Today' : label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Per-day breakdown */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              Breakdown
            </p>
            <div className="space-y-1">
              {days.map((day, i) => {
                const isToday = dayKeys[i] === todayKey;
                const label = isToday ? 'Today' : `${DAY_LABELS[day.getDay()]} ${day.getDate()}`;
                const minutes = Math.round(minutesByDay[i]);
                const sessions = sessionsByDay[i];
                if (minutes === 0) return null;
                return (
                  <div
                    key={dayKeys[i]}
                    className="flex items-center justify-between text-sm px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <span className={`text-gray-700 dark:text-gray-300 ${isToday ? 'font-medium' : ''}`}>
                      {label}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs">
                      {formatFocusTime(minutes)} &middot; {sessions} session{sessions !== 1 ? 's' : ''}
                    </span>
                  </div>
                );
              })}
              {totalSessions === 0 && (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                  No sessions this week yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

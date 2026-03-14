import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { SessionRecord } from '../../types';

function formatHHMM(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(seconds: number): string {
  const m = Math.round(seconds / 60);
  return `${m}m`;
}

function formatDateHeading(dateStr: string): string {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const date = new Date(y, mo - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

function groupByDate(records: SessionRecord[]): { date: string; records: SessionRecord[] }[] {
  const map = new Map<string, SessionRecord[]>();
  for (const r of [...records].reverse()) {
    if (!map.has(r.date)) map.set(r.date, []);
    map.get(r.date)!.push(r);
  }
  return Array.from(map.entries()).map(([date, recs]) => ({ date, records: recs }));
}

export function HistoryPanel({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useAppContext();
  const groups = groupByDate(state.sessionHistory);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

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
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Session History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {groups.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center pt-12">
              No sessions recorded yet.
              <br />
              Complete a pomodoro to start tracking.
            </p>
          ) : (
            groups.map(group => {
              const totalMin = Math.round(
                group.records.reduce((s, r) => s + r.durationSeconds, 0) / 60
              );
              return (
                <div key={group.date}>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {formatDateHeading(group.date)}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {totalMin}m focused
                    </span>
                  </div>
                  <div className="space-y-1">
                    {group.records.map(r => (
                      <div
                        key={r.id}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                      >
                        <span className="text-base">🍅</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 dark:text-gray-100 truncate">
                            {r.taskTitle ?? <span className="text-gray-400 italic">No task</span>}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {formatHHMM(r.startedAt)} – {formatHHMM(r.completedAt)}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                          {formatDuration(r.durationSeconds)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {groups.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                if (confirm('Clear all session history?')) {
                  dispatch({ type: 'CLEAR_HISTORY' });
                }
              }}
              className="text-xs text-red-500 hover:text-red-700 underline underline-offset-2"
            >
              Clear history
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

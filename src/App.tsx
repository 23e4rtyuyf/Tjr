import { useState, useRef } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/layout/Header';
import { ShortcutsModal } from './components/layout/ShortcutsModal';
import { HistoryPanel } from './components/stats/HistoryPanel';
import { WeeklyStats } from './components/stats/WeeklyStats';
import { TimerDisplay } from './components/timer/TimerDisplay';
import { TimerControls } from './components/timer/TimerControls';
import { ActiveTaskBadge } from './components/timer/ActiveTaskBadge';
import { TimerSettings } from './components/timer/TimerSettings';
import { TaskList } from './components/tasks/TaskList';
import { useTimer } from './hooks/useTimer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function AppContent() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showWeeklyStats, setShowWeeklyStats] = useState(false);
  const newTaskInputRef = useRef<HTMLInputElement>(null);

  useTimer();
  useKeyboardShortcuts({
    onToggleShortcuts: () => setShowShortcuts(v => !v),
    onNewTask: () => newTaskInputRef.current?.focus(),
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header
        onToggleShortcuts={() => setShowShortcuts(v => !v)}
        onToggleHistory={() => setShowHistory(v => !v)}
        onToggleWeeklyStats={() => setShowWeeklyStats(v => !v)}
      />

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Timer panel */}
        <aside className="md:w-80 lg:w-96 flex-shrink-0 flex flex-col items-center gap-6 p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <TimerDisplay />
          <TimerControls />
          <ActiveTaskBadge />
          <div className="w-full mt-auto">
            <TimerSettings />
          </div>
        </aside>

        {/* Task list panel */}
        <section className="flex-1 flex flex-col p-6 overflow-hidden">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">Tasks</h2>
          <div className="flex-1 overflow-hidden">
            <TaskList newTaskInputRef={newTaskInputRef} />
          </div>
        </section>
      </main>

      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
      {showHistory && <HistoryPanel onClose={() => setShowHistory(false)} />}
      {showWeeklyStats && <WeeklyStats onClose={() => setShowWeeklyStats(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

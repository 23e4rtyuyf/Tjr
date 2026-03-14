import { useAppContext } from '../../context/AppContext';

export function TimerControls() {
  const { state, dispatch } = useAppContext();
  const { timer } = state;

  const handleToggle = () => {
    if (timer.status === 'running') {
      dispatch({ type: 'TIMER_PAUSE' });
    } else {
      dispatch({ type: 'TIMER_START' });
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => dispatch({ type: 'TIMER_RESET' })}
        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
        title="Reset (R)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      <button
        onClick={handleToggle}
        className="px-8 py-3 rounded-xl font-semibold text-white transition-all active:scale-95 shadow-md"
        style={{
          backgroundColor:
            timer.phase === 'work' ? '#ef4444' : timer.phase === 'shortBreak' ? '#22c55e' : '#3b82f6',
        }}
        title="Start / Pause (Space)"
      >
        {timer.status === 'running' ? 'Pause' : 'Start'}
      </button>

      <button
        onClick={() => dispatch({ type: 'TIMER_SKIP_PHASE' })}
        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
        title="Skip phase (S)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

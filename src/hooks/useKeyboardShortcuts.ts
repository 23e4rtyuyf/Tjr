import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

interface Options {
  onToggleShortcuts: () => void;
  onNewTask: () => void;
}

export function useKeyboardShortcuts({ onToggleShortcuts, onNewTask }: Options) {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.key === 'Escape') return; // handled by modal itself

      if (inInput) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (state.timer.status === 'running') {
            dispatch({ type: 'TIMER_PAUSE' });
          } else {
            dispatch({ type: 'TIMER_START' });
          }
          break;
        case 'r':
        case 'R':
          dispatch({ type: 'TIMER_RESET' });
          break;
        case 's':
        case 'S':
          dispatch({ type: 'TIMER_SKIP_PHASE' });
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          onNewTask();
          break;
        case '?':
          onToggleShortcuts();
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.timer.status, dispatch, onToggleShortcuts, onNewTask]);
}

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, AppAction, Task } from '../types';
import { DEFAULT_SETTINGS, STORAGE_KEY } from '../utils/constants';
import { todayKey } from '../utils/dateHelpers';

function buildInitialState(): AppState {
  const today = todayKey();
  return {
    tasks: [],
    timer: {
      phase: 'work',
      status: 'idle',
      secondsRemaining: DEFAULT_SETTINGS.workDuration,
      pomodorosCompletedThisRound: 0,
      activeTaskId: null,
    },
    settings: DEFAULT_SETTINGS,
    dailyStats: {
      date: today,
      totalFocusSeconds: 0,
      tasksCompleted: 0,
    },
  };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildInitialState();
    const saved: AppState = JSON.parse(raw);
    const today = todayKey();
    // Roll over daily stats if date changed
    if (saved.dailyStats.date !== today) {
      saved.dailyStats = { date: today, totalFocusSeconds: 0, tasksCompleted: 0 };
    }
    // Always reset timer to idle on reload
    saved.timer.status = 'idle';
    return saved;
  } catch {
    return buildInitialState();
  }
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TASK': {
      const task: Task = {
        ...action.payload,
        id: crypto.randomUUID(),
        completedPomodoros: 0,
        createdAt: Date.now(),
        completedAt: null,
      };
      return { ...state, tasks: [task, ...state.tasks] };
    }

    case 'UPDATE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
    }

    case 'DELETE_TASK': {
      const newActiveTaskId =
        state.timer.activeTaskId === action.payload.id ? null : state.timer.activeTaskId;
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload.id),
        timer: { ...state.timer, activeTaskId: newActiveTaskId },
      };
    }

    case 'TOGGLE_TASK_COMPLETE': {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (!task) return state;
      const nowCompleted = !task.completed;
      const statsAdjust = nowCompleted ? 1 : -1;
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id
            ? { ...t, completed: nowCompleted, completedAt: nowCompleted ? Date.now() : null }
            : t
        ),
        dailyStats: {
          ...state.dailyStats,
          tasksCompleted: Math.max(0, state.dailyStats.tasksCompleted + statsAdjust),
        },
      };
    }

    case 'SET_ACTIVE_TASK': {
      return { ...state, timer: { ...state.timer, activeTaskId: action.payload.id } };
    }

    case 'TIMER_START': {
      return { ...state, timer: { ...state.timer, status: 'running' } };
    }

    case 'TIMER_PAUSE': {
      return { ...state, timer: { ...state.timer, status: 'paused' } };
    }

    case 'TIMER_RESET': {
      const duration = phaseDuration(state.timer.phase, state.settings);
      return { ...state, timer: { ...state.timer, status: 'idle', secondsRemaining: duration } };
    }

    case 'TIMER_TICK': {
      if (state.timer.secondsRemaining <= 0) return state;
      return {
        ...state,
        timer: { ...state.timer, secondsRemaining: state.timer.secondsRemaining - 1 },
      };
    }

    case 'TIMER_PHASE_COMPLETE': {
      const wasWork = state.timer.phase === 'work';
      const newRoundCount = wasWork
        ? state.timer.pomodorosCompletedThisRound + 1
        : state.timer.pomodorosCompletedThisRound;

      // Increment pomodoro count on active task
      let tasks = state.tasks;
      if (wasWork && state.timer.activeTaskId) {
        tasks = state.tasks.map(t =>
          t.id === state.timer.activeTaskId
            ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
            : t
        );
      }

      // Determine next phase
      let nextPhase: AppState['timer']['phase'];
      if (wasWork) {
        nextPhase =
          newRoundCount % state.settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
      } else {
        nextPhase = 'work';
      }

      // Update daily stats
      const dailyStats = wasWork
        ? {
            ...state.dailyStats,
            totalFocusSeconds: state.dailyStats.totalFocusSeconds + state.settings.workDuration,
          }
        : state.dailyStats;

      const nextStatus =
        (wasWork && state.settings.autoStartBreaks) ||
        (!wasWork && state.settings.autoStartWork)
          ? 'running'
          : 'idle';

      return {
        ...state,
        tasks,
        dailyStats,
        timer: {
          ...state.timer,
          phase: nextPhase,
          status: nextStatus,
          secondsRemaining: phaseDuration(nextPhase, state.settings),
          pomodorosCompletedThisRound: wasWork ? newRoundCount : 0,
        },
      };
    }

    case 'TIMER_SKIP_PHASE': {
      return reducer(state, { type: 'TIMER_PHASE_COMPLETE' });
    }

    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.payload };
      // Recalculate remaining time only if timer is idle
      const secondsRemaining =
        state.timer.status === 'idle'
          ? phaseDuration(state.timer.phase, newSettings)
          : state.timer.secondsRemaining;
      return {
        ...state,
        settings: newSettings,
        timer: { ...state.timer, secondsRemaining },
      };
    }

    case 'CLEAR_ALL': {
      return buildInitialState();
    }

    default:
      return state;
  }
}

function phaseDuration(
  phase: AppState['timer']['phase'],
  settings: AppState['settings']
): number {
  if (phase === 'work') return settings.workDuration;
  if (phase === 'shortBreak') return settings.shortBreakDuration;
  return settings.longBreakDuration;
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage quota exceeded — silently ignore
    }
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}

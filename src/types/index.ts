export type Priority = 'none' | 'low' | 'medium' | 'high';

export type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface Task {
  id: string;
  title: string;
  notes: string;
  priority: Priority;
  completed: boolean;
  completedPomodoros: number;
  createdAt: number;
  completedAt: number | null;
}

export interface TimerSettings {
  workDuration: number;       // seconds, default 1500 (25 min)
  shortBreakDuration: number; // seconds, default 300 (5 min)
  longBreakDuration: number;  // seconds, default 900 (15 min)
  longBreakInterval: number;  // pomodoros before long break, default 4
  autoStartBreaks: boolean;
  autoStartWork: boolean;
}

export interface TimerState {
  phase: TimerPhase;
  status: TimerStatus;
  secondsRemaining: number;
  pomodorosCompletedThisRound: number;
  activeTaskId: string | null;
}

export interface DailyStats {
  date: string; // 'YYYY-MM-DD'
  totalFocusSeconds: number;
  tasksCompleted: number;
}

export interface AppState {
  tasks: Task[];
  timer: TimerState;
  settings: TimerSettings;
  dailyStats: DailyStats;
}

export type AppAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'completedPomodoros' | 'createdAt' | 'completedAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: string } & Partial<Task> }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'TOGGLE_TASK_COMPLETE'; payload: { id: string } }
  | { type: 'SET_ACTIVE_TASK'; payload: { id: string | null } }
  | { type: 'TIMER_TICK' }
  | { type: 'TIMER_START' }
  | { type: 'TIMER_PAUSE' }
  | { type: 'TIMER_RESET' }
  | { type: 'TIMER_SKIP_PHASE' }
  | { type: 'TIMER_PHASE_COMPLETE' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<TimerSettings> }
  | { type: 'CLEAR_ALL' };

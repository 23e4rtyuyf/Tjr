export type Priority = 'none' | 'low' | 'medium' | 'high';

export type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

export type TimerStatus = 'idle' | 'running' | 'paused';

export type Recurrence = 'none' | 'daily' | 'weekly';

export interface Task {
  id: string;
  title: string;
  notes: string;
  priority: Priority;
  completed: boolean;
  completedPomodoros: number;
  estimatedPomodoros: number; // 0 = no estimate
  tags: string[];
  createdAt: number;
  completedAt: number | null;
  recurrence: Recurrence;
  nextResetAt: number | null;   // ms timestamp when the task will auto-reset
  skipNextReset: boolean;       // if true, skip one cycle instead of resetting
  resetCount: number;           // cumulative auto-reset count
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

export interface SessionRecord {
  id: string;
  taskId: string | null;
  taskTitle: string | null; // snapshot — preserved even if task is later deleted
  date: string;             // 'YYYY-MM-DD'
  startedAt: number;        // ms timestamp
  completedAt: number;      // ms timestamp
  durationSeconds: number;
}

export interface AppState {
  tasks: Task[];
  timer: TimerState;
  settings: TimerSettings;
  dailyStats: DailyStats;
  sessionHistory: SessionRecord[];
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
  | { type: 'CLEAR_ALL' }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'CHECK_RECURRING_RESETS' }
  | { type: 'SKIP_NEXT_RESET'; payload: { id: string } };

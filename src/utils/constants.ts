import type { TimerSettings } from '../types';

export const STORAGE_KEY = 'tjr_pomodoro_state';

export const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartWork: false,
};

export const PHASE_LABELS = {
  work: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
} as const;

export const PRIORITY_LABELS = {
  none: 'None',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
} as const;

export const SHORTCUTS = [
  { key: 'Space', description: 'Start / pause timer' },
  { key: 'R', description: 'Reset timer' },
  { key: 'S', description: 'Skip current phase' },
  { key: 'N', description: 'New task' },
  { key: '?', description: 'Toggle shortcuts' },
  { key: 'Esc', description: 'Close modal / cancel edit' },
] as const;

import { useAppContext } from '../../context/AppContext';
import { formatTime } from '../../utils/formatTime';
import { PHASE_LABELS } from '../../utils/constants';

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerDisplay() {
  const { state } = useAppContext();
  const { timer, settings } = state;

  const totalDuration =
    timer.phase === 'work'
      ? settings.workDuration
      : timer.phase === 'shortBreak'
      ? settings.shortBreakDuration
      : settings.longBreakDuration;

  const progress = timer.secondsRemaining / totalDuration;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const phaseColors = {
    work: '#ef4444',
    shortBreak: '#22c55e',
    longBreak: '#3b82f6',
  };

  const color = phaseColors[timer.phase];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-56 h-56">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-mono font-bold text-gray-800 dark:text-gray-100 tabular-nums">
            {formatTime(timer.secondsRemaining)}
          </span>
        </div>
      </div>
      <span
        className="text-sm font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
        style={{ backgroundColor: color + '20', color }}
      >
        {PHASE_LABELS[timer.phase]}
      </span>
    </div>
  );
}

import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

export function TimerSettings() {
  const { state, dispatch } = useAppContext();
  const { settings } = state;
  const [open, setOpen] = useState(false);

  const update = (key: string, minutes: number) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { [key]: Math.max(1, minutes) * 60 },
    });
  };

  const updateInt = (key: string, value: number) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: Math.max(1, value) } });
  };

  const updateBool = (key: string, value: boolean) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
  };

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline underline-offset-2 transition-colors"
      >
        {open ? 'Hide settings' : 'Settings'}
      </button>

      {open && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl space-y-3 text-sm">
          <Row
            label="Focus"
            value={Math.round(settings.workDuration / 60)}
            onChange={v => update('workDuration', v)}
            unit="min"
          />
          <Row
            label="Short break"
            value={Math.round(settings.shortBreakDuration / 60)}
            onChange={v => update('shortBreakDuration', v)}
            unit="min"
          />
          <Row
            label="Long break"
            value={Math.round(settings.longBreakDuration / 60)}
            onChange={v => update('longBreakDuration', v)}
            unit="min"
          />
          <Row
            label="Long break after"
            value={settings.longBreakInterval}
            onChange={v => updateInt('longBreakInterval', v)}
            unit="🍅"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoStartBreaks}
              onChange={e => updateBool('autoStartBreaks', e.target.checked)}
              className="rounded"
            />
            <span className="text-gray-700 dark:text-gray-300">Auto-start breaks</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoStartWork}
              onChange={e => updateBool('autoStartWork', e.target.checked)}
              className="rounded"
            />
            <span className="text-gray-700 dark:text-gray-300">Auto-start work sessions</span>
          </label>
          <button
            onClick={() => {
              if (confirm('Clear all tasks and reset stats?')) {
                dispatch({ type: 'CLEAR_ALL' });
              }
            }}
            className="text-red-500 hover:text-red-700 underline underline-offset-2 text-xs"
          >
            Clear all data
          </button>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(value - 1)}
          className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          −
        </button>
        <span className="w-8 text-center font-mono text-gray-800 dark:text-gray-100">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          +
        </button>
        <span className="ml-1 text-gray-500 w-8">{unit}</span>
      </div>
    </div>
  );
}

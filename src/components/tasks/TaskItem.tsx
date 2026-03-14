import { useState } from 'react';
import type { Task, Priority } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { TaskForm } from './TaskForm';
import { PRIORITY_LABELS } from '../../utils/constants';

const priorityColors: Record<Priority, string> = {
  none: '',
  low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

export function TaskItem({ task }: { task: Task }) {
  const { state, dispatch } = useAppContext();
  const [editing, setEditing] = useState(false);
  const isActive = state.timer.activeTaskId === task.id;

  if (editing) {
    return (
      <div className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700">
        <TaskForm
          initial={task}
          onSubmit={data => {
            dispatch({ type: 'UPDATE_TASK', payload: { id: task.id, ...data } });
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
          autoFocus
        />
      </div>
    );
  }

  return (
    <div
      className={`group flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
        isActive
          ? 'bg-red-50 dark:bg-red-900/20 ring-1 ring-red-200 dark:ring-red-800'
          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
      } ${task.completed ? 'opacity-60' : ''}`}
    >
      {/* Checkbox */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_TASK_COMPLETE', payload: { id: task.id } })}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          task.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 dark:border-gray-500 hover:border-green-400'
        }`}
        title="Mark complete"
      >
        {task.completed && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm text-gray-800 dark:text-gray-100 leading-snug ${
            task.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
          }`}
        >
          {task.title}
        </p>
        {task.notes && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{task.notes}</p>
        )}
        <div className="flex items-center gap-1.5 mt-1">
          {task.priority !== 'none' && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
              {PRIORITY_LABELS[task.priority]}
            </span>
          )}
          {task.completedPomodoros > 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              🍅 {task.completedPomodoros}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() =>
            dispatch({
              type: 'SET_ACTIVE_TASK',
              payload: { id: isActive ? null : task.id },
            })
          }
          className={`p-1.5 rounded-lg transition-colors ${
            isActive
              ? 'text-red-500 bg-red-100 dark:bg-red-900/30'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
          title={isActive ? 'Unlink from timer' : 'Link to timer'}
        >
          🍅
        </button>
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          title="Edit task"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete "${task.title}"?`)) {
              dispatch({ type: 'DELETE_TASK', payload: { id: task.id } });
            }
          }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Delete task"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

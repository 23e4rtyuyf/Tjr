import { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatTime } from '../utils/formatTime';

function beep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // AudioContext not available
  }
}

export function useTimer() {
  const { state, dispatch } = useAppContext();
  const { timer } = state;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseCompleteRef = useRef(false);

  useEffect(() => {
    if (timer.status === 'running') {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TIMER_TICK' });
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timer.status, dispatch]);

  // Detect phase completion
  useEffect(() => {
    if (timer.status === 'running' && timer.secondsRemaining === 0 && !phaseCompleteRef.current) {
      phaseCompleteRef.current = true;
      beep();
      dispatch({ type: 'TIMER_PHASE_COMPLETE' });
    }
    if (timer.secondsRemaining > 0) {
      phaseCompleteRef.current = false;
    }
  }, [timer.secondsRemaining, timer.status, dispatch]);

  // Update document title
  useEffect(() => {
    document.title =
      timer.status !== 'idle'
        ? `${formatTime(timer.secondsRemaining)} — Pomodoro`
        : 'Pomodoro';
    return () => {
      document.title = 'Pomodoro';
    };
  }, [timer.secondsRemaining, timer.status]);
}

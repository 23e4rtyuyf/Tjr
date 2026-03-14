import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export function useRecurringResets() {
  const { dispatch } = useAppContext();

  useEffect(() => {
    dispatch({ type: 'CHECK_RECURRING_RESETS' });
    const id = setInterval(() => dispatch({ type: 'CHECK_RECURRING_RESETS' }), 60_000);
    return () => clearInterval(id);
  }, [dispatch]);
}

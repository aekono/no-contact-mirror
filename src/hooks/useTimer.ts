import { useEffect, useState, useMemo } from 'react';
import { UseTimerReturn } from '../types';

export function useTimer(lastContactISO: string | null): UseTimerReturn {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    if (!lastContactISO) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const last = new Date(lastContactISO).getTime();
    const diffMs = Math.max(0, now.getTime() - last);
    
    // Return 0 days until a full 24 hours have passed (86400000 ms)
    if (diffMs < 86400000) {
      const totalSeconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const seconds = totalSeconds % 60;
      return { days: 0, hours, minutes: mins, seconds };
    }
    
    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = minutes % 60;
    const seconds = totalSeconds % 60;

    return { days, hours, minutes: mins, seconds };
  }, [lastContactISO, now]);
}

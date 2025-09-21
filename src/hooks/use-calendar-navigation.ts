import dayjs from 'dayjs';
import { useCallback, useState } from 'react';

export const useCalendarNavigation = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const goToPreviousDay = useCallback(() => {
    setCurrentDate(currentDate.subtract(1, 'day'));
  }, [currentDate]);

  const goToNextDay = useCallback(() => {
    setCurrentDate(currentDate.add(1, 'day'));
  }, [currentDate]);

  const goToToday = useCallback(() => {
    setCurrentDate(dayjs());
  }, []);

  return {
    currentDate,
    goToPreviousDay,
    goToNextDay,
    goToToday,
  };
};

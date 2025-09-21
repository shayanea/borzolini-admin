import { useCallback, useState } from 'react';

export const useCalendarVeterinarians = () => {
  const [selectedVeterinarians, setSelectedVeterinarians] = useState<string[]>([]);

  const toggleVeterinarian = useCallback((vetId: string) => {
    setSelectedVeterinarians(prev =>
      prev.includes(vetId) ? prev.filter(id => id !== vetId) : [...prev, vetId]
    );
  }, []);

  const toggleAllVeterinarians = useCallback(
    (veterinarians: Array<{ id: string }>) => {
      setSelectedVeterinarians(
        selectedVeterinarians.length === veterinarians.length ? [] : veterinarians.map(v => v.id)
      );
    },
    [selectedVeterinarians.length]
  );

  const addNewCalendar = useCallback(() => {
    console.log('Add new calendar clicked');
  }, []);

  return {
    selectedVeterinarians,
    toggleVeterinarian,
    toggleAllVeterinarians,
    addNewCalendar,
  };
};

import { Button, Typography } from 'antd';

import type { VeterinarianSelectionProps } from '@/types/calendar';
import { useCallback } from 'react';

const { Text } = Typography;

const VeterinarianSelection = ({
  veterinarians,
  selectedVeterinarians,
  onToggleVeterinarian,
  onToggleAll,
  onAddNew,
}: VeterinarianSelectionProps) => {
  const allSelected = selectedVeterinarians.length === veterinarians.length;

  const handleVeterinarianToggle = useCallback(
    (vetId: string) => {
      onToggleVeterinarian(vetId);
    },
    [onToggleVeterinarian]
  );

  const createVetToggleHandler = useCallback(
    (vetId: string) => {
      return () => handleVeterinarianToggle(vetId);
    },
    [handleVeterinarianToggle]
  );

  return (
    <div className='mb-6'>
      <div className='flex items-center space-x-4 mb-4'>
        <Text strong>My Calendars:</Text>
        <div className='flex items-center space-x-2'>
          <input type='checkbox' checked={allSelected} onChange={onToggleAll} className='mr-2' />
          <Text>All</Text>
        </div>
        <Button type='link' className='!p-0 !h-auto text-primary-orange' onClick={onAddNew}>
          + Add new
        </Button>
      </div>

      <div className='flex items-center space-x-4'>
        <Text strong>Vet Calendars:</Text>
        <div className='flex items-center space-x-4'>
          {veterinarians.map(vet => (
            <div key={vet.id} className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={selectedVeterinarians.includes(vet.id)}
                onChange={createVetToggleHandler(vet.id)}
                className='mr-2'
              />
              <Text>{vet.name}</Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VeterinarianSelection;

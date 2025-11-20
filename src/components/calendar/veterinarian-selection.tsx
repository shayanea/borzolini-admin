import { Typography } from 'antd';
import type { VeterinarianSelectionProps } from '@/types/calendar';
import { useCallback } from 'react';

const { Text } = Typography;

const VeterinarianSelection = ({
  veterinarians,
  selectedVeterinarians,
  onToggleVeterinarian,
}: VeterinarianSelectionProps) => {
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
      <div className='flex items-center space-x-4'>
        <Text strong>Calendars:</Text>
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

export { VeterinarianSelection };
export default VeterinarianSelection;

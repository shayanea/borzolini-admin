import type { CalendarAppointment, Veterinarian } from '@/types/calendar';

interface CalendarGridProps {
  timeSlots: number[];
  veterinarians: Veterinarian[];
  appointments: CalendarAppointment[];
  onAppointmentClick: (appointment: CalendarAppointment) => void;
}

const CalendarGrid = ({
  timeSlots,
  veterinarians,
  appointments,
  onAppointmentClick,
}: CalendarGridProps) => {
  const getAppointmentsForTimeAndVet = (time: number, vetId: string) => {
    return appointments.filter(apt => {
      const startHour = parseInt(apt.startTime.split(':')[0]);
      const vet = veterinarians.find(v => v.id === vetId);
      return startHour === time && vet?.name === apt.veterinarian;
    });
  };

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour} ${period}`;
  };

  return (
    <div className='calendar-grid border border-gray-200 rounded-lg overflow-hidden'>
      {/* Header row with veterinarian names */}
      <div
        className='grid bg-gray-50 border-b border-gray-200'
        style={{
          gridTemplateColumns: `100px repeat(${veterinarians.length}, minmax(200px, 1fr))`,
        }}
      >
        <div className='p-3 font-semibold text-gray-700 border-r border-gray-200'>Time</div>
        {veterinarians.map(vet => (
          <div
            key={vet.id}
            className='p-3 font-semibold text-gray-700 border-r border-gray-200 last:border-r-0 text-center'
          >
            <div className='flex items-center justify-center space-x-2'>
              <div className='w-8 h-8 bg-primary-navy text-white rounded-full flex items-center justify-center text-sm font-semibold'>
                {vet.initials}
              </div>
              <span className='text-sm'>{vet.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Time slots and appointments */}
      {timeSlots.map(time => (
        <div
          key={time}
          className='grid border-b border-gray-200 last:border-b-0'
          style={{
            gridTemplateColumns: `100px repeat(${veterinarians.length}, minmax(200px, 1fr))`,
          }}
        >
          {/* Time column */}
          <div className='p-3 text-sm text-gray-600 border-r border-gray-200 bg-gray-50 font-medium'>
            {formatTime(time)}
          </div>

          {/* Veterinarian columns */}
          {veterinarians.map(vet => {
            const timeAppointments = getAppointmentsForTimeAndVet(time, vet.id);

            return (
              <div
                key={vet.id}
                className='p-2 border-r border-gray-200 last:border-r-0 min-h-[60px] relative'
              >
                {timeAppointments.map(apt => (
                  <div
                    key={apt.id}
                    onClick={() => onAppointmentClick(apt)}
                    className='mb-1 p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity'
                    style={{ backgroundColor: apt.color }}
                    title={`${apt.clientName} - ${apt.petName} (${apt.petType})`}
                  >
                    <div className='font-medium text-white truncate'>{apt.clientName}</div>
                    <div className='text-white/90 truncate'>
                      {apt.petName} ({apt.petType})
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export { CalendarGrid };
export default CalendarGrid;

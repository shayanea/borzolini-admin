import React from 'react';
import { Avatar, Typography } from 'antd';
import type { CalendarGridProps } from '@/types/calendar';

const { Text } = Typography;

const CalendarGrid: React.FC<CalendarGridProps> = ({
  veterinarians,
  timeSlots,
  getAppointmentsForTimeAndVet,
}) => {
  return (
    <div className='overflow-x-auto'>
      <div className='min-w-[1200px]'>
        {/* Header Row */}
        <div className='grid grid-cols-7 gap-0 border-b border-gray-200'>
          <div className='p-3 bg-gray-50 font-medium text-gray-600'>Time</div>
          {veterinarians.map(vet => (
            <div key={vet.id} className='p-3 bg-gray-50 font-medium text-gray-600 text-center'>
              <div className='flex flex-col items-center space-y-1'>
                <Avatar size={32} className='bg-primary-navy text-white font-medium'>
                  {vet.initials}
                </Avatar>
                <Text className='text-xs'>{vet.name.split(' ').slice(-1)[0]}</Text>
              </div>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        {timeSlots.map(time => (
          <div key={time} className='grid grid-cols-7 gap-0 border-b border-gray-200 min-h-[60px]'>
            {/* Time Column */}
            <div className='p-3 bg-gray-50 text-sm text-gray-600 font-medium border-r border-gray-200'>
              {time === 8
                ? '8:00 AM'
                : time === 12
                  ? '12:00 PM'
                  : `${time}:00 ${time < 12 ? 'AM' : 'PM'}`}
            </div>

            {/* Veterinarian Columns */}
            {veterinarians.map(vet => {
              const appointments = getAppointmentsForTimeAndVet(time, vet.id);
              return (
                <div key={vet.id} className='p-2 border-r border-gray-200 relative'>
                  {appointments.map(apt => (
                    <div
                      key={apt.id}
                      className={`${apt.color} calendar-appointment mb-1 cursor-pointer hover:opacity-90 transition-opacity`}
                    >
                      <div className='font-medium text-sm'>{apt.clientName}</div>
                      {apt.petName && (
                        <div className='text-xs opacity-90'>
                          {apt.petName} ({apt.petType})
                        </div>
                      )}
                      <div className='text-xs opacity-90'>
                        {apt.startTime} - {apt.endTime}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;

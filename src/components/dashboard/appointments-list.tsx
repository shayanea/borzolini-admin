import { Clock, MoreVertical, Phone } from 'lucide-react';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface Appointment {
  id: string;
  time: string;
  pet: string;
  petType: string;
  owner: string;
  ownerPhone: string;
  status: 'completed' | 'in-progress' | 'scheduled' | 'cancelled';
  type: string;
  vetName?: string;
}

interface AppointmentsListProps {
  appointments?: Appointment[];
  onViewDetails?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments = [
    {
      id: '1',
      time: '09:00 AM',
      pet: 'Luna',
      petType: 'German Shepherd',
      owner: 'John Doe',
      ownerPhone: '+1 (555) 123-4567',
      status: 'completed',
      type: 'Checkup',
      vetName: 'Dr. Smith',
    },
    {
      id: '2',
      time: '10:30 AM',
      pet: 'Fariborz',
      petType: 'British Shorthair',
      owner: 'Shayan A.',
      ownerPhone: '+1 (555) 987-6543',
      status: 'in-progress',
      type: 'Vaccine',
      vetName: 'Dr. Sarah',
    },
    {
      id: '3',
      time: '02:30 PM',
      pet: 'Max',
      petType: 'Labrador',
      owner: 'Sarah Smith',
      ownerPhone: '+1 (555) 456-7890',
      status: 'scheduled',
      type: 'Consultation',
      vetName: 'Dr. Mike',
    },
  ],
  onViewDetails = () => {},
  onReschedule = () => {},
  onCancel = () => {},
}) => {
  const { t } = useTranslation('components');

  const statusConfig = {
    completed: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      label: t('dashboard.appointmentsList.status.completed'),
      icon: '✓',
    },
    'in-progress': {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      label: t('dashboard.appointmentsList.status.inProgress'),
      icon: '⏱',
    },
    scheduled: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      label: t('dashboard.appointmentsList.status.scheduled'),
      icon: '📅',
    },
    cancelled: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: t('dashboard.appointmentsList.status.cancelled'),
      icon: '✕',
    },
  };

  return (
    <div className='bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm'>
      {/* Header */}
      <div className='px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-transparent'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='font-bold text-lg text-slate-900'>
              {t('dashboard.appointmentsList.todaysSchedule')}
            </h2>
            <p className='text-xs text-slate-500 mt-1'>
              {t('dashboard.appointmentsList.appointmentsCount', { count: appointments.length })}
            </p>
          </div>
          <button className='px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors'>
            {t('dashboard.appointmentsList.newAppointment')}
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className='divide-y divide-slate-100'>
        {appointments.map(apt => {
          const status = statusConfig[apt.status];
          return (
            <div key={apt.id} className='px-6 py-4 hover:bg-slate-50 transition-colors group'>
              <div className='flex items-center gap-4'>
                {/* Time Section */}
                <div className='flex-shrink-0 text-center min-w-fit'>
                  <div className='flex items-center gap-1 justify-center text-slate-900 font-bold'>
                    <Clock size={16} />
                    {apt.time}
                  </div>
                  <div
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                  >
                    {status.icon} {status.label}
                  </div>
                </div>

                {/* Divider */}
                <div className='w-px h-16 bg-slate-200' />

                {/* Pet & Owner Info */}
                <div className='flex-1'>
                  <div className='flex items-start justify-between mb-2'>
                    <div>
                      <h3 className='font-bold text-slate-900'>
                        {apt.pet}{' '}
                        <span className='text-xs font-normal text-slate-500'>({apt.petType})</span>
                      </h3>
                      <p className='text-sm text-slate-600 mt-1'>
                        {t('dashboard.appointmentsList.owner', { name: apt.owner })}
                      </p>
                    </div>
                    <span className='inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg'>
                      {apt.type}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className='flex items-center gap-4 mt-3 text-xs text-slate-500'>
                    <div className='flex items-center gap-1'>
                      <Phone size={14} />
                      {apt.ownerPhone}
                    </div>
                    {apt.vetName && (
                      <div className='flex items-center gap-1'>
                        <span className='text-emerald-600 font-medium'>🔹 {apt.vetName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <button
                    onClick={() => onViewDetails(apt.id)}
                    className='px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors'
                  >
                    {t('dashboard.appointmentsList.view')}
                  </button>
                  <button
                    onClick={() => onReschedule(apt.id)}
                    className='px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors'
                  >
                    {t('dashboard.appointmentsList.reschedule')}
                  </button>
                  <div className='relative group/menu'>
                    <button className='p-2 hover:bg-slate-100 rounded-lg transition-colors'>
                      <MoreVertical size={16} className='text-slate-500' />
                    </button>
                    <div className='absolute right-0 mt-1 w-40 bg-white rounded-lg border border-slate-200 shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10'>
                      <button className='w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg font-medium'>
                        {t('dashboard.appointmentsList.edit')}
                      </button>
                      <button className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg font-medium'>
                        {t('dashboard.appointmentsList.cancel')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {appointments.length === 0 && (
        <div className='px-6 py-12 text-center'>
          <p className='text-slate-500'>{t('dashboard.appointmentsList.noAppointmentsToday')}</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;

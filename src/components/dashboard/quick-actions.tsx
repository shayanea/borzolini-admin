import {
    ArrowRightOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    MedicineBoxOutlined,
    MessageOutlined,
    StopOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Modal, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { AppointmentsService } from '@/services/appointments';
import { AppointmentStatus } from '@/types';

interface ActionConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const QuickActions = () => {
  const { t } = useTranslation('components');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch next pending appointment
  const { data: nextPendingData, isLoading: isLoadingPending } = useQuery({
    queryKey: ['appointments', 'next-pending'],
    queryFn: () => AppointmentsService.getAll({ 
      status: 'pending', 
      sort_by: 'scheduled_date', 
      sort_order: 'asc', 
      limit: 1 
    }),
  });
  const nextPending = nextPendingData?.appointments?.[0];

  // Fetch current active appointment (in_progress)
  // We prioritize 'in_progress'. If none, we could look for 'confirmed' overlapping now, 
  // but for simplicity 'Mark Complete' usually implies it's already running.
  const { data: currentActiveData, isLoading: isLoadingActive } = useQuery({
    queryKey: ['appointments', 'current-active'],
    queryFn: () => AppointmentsService.getAll({ 
      status: 'in_progress', 
      limit: 1 
    }),
  });
  const currentActive = currentActiveData?.appointments?.[0];

  // Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      AppointmentsService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      const actionMap: Record<string, string> = {
        'confirmed': t('dashboard.quickActions.confirmedSuccess'),
        'completed': t('dashboard.quickActions.completedSuccess'),
      };
      message.success(actionMap[variables.status] || 'Status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
    onError: () => {
      message.error(t('dashboard.quickActions.error'));
    },
  });

  const handleAcceptNextPending = () => {
    if (!nextPending) {
      message.info(t('dashboard.quickActions.noPending'));
      return;
    }
    updateStatusMutation.mutate({ id: nextPending.id, status: 'confirmed' });
  };

  const handleMarkCurrentComplete = () => {
    if (!currentActive) {
      message.info(t('dashboard.quickActions.noActive'));
      return;
    }
    updateStatusMutation.mutate({ id: currentActive.id, status: 'completed' });
  };

  const handleBlockTime = () => {
    // Navigate to calendar to block time manually as it requires specific inputs
    navigate(`${ROUTES.CALENDAR}?action=create`);
    message.info(t('dashboard.quickActions.blockTimeInfo'));
  };

  const handleSendSMS = () => {
    Modal.info({
      title: t('dashboard.quickActions.sendSmsTitle'),
      content: t('dashboard.quickActions.sendSmsContent'), // "Select a patient to send SMS..."
      okText: t('common.ok'),
    });
  };

  const handleViewSchedule = () => {
    navigate(ROUTES.CALENDAR);
  };

  const handleEmergencyWalkIn = () => {
    navigate(ROUTES.PETS, { state: { action: 'create', type: 'emergency' } });
  };

  const actions: ActionConfig[] = [
    {
      icon: <CheckCircleOutlined className='text-2xl' />,
      title: t('dashboard.quickActions.acceptNext'),
      description: nextPending 
        ? `${t('common.patient')}: ${nextPending.pet?.name || 'Unknown'}`
        : t('dashboard.quickActions.noPendingTasks'),
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      iconColor: '#10B981',
      onClick: handleAcceptNextPending,
      disabled: !nextPending || updateStatusMutation.isPending,
      loading: isLoadingPending || (updateStatusMutation.isPending && !currentActive),
    },
    {
      icon: <ClockCircleOutlined className='text-2xl' />,
      title: t('dashboard.quickActions.markComplete'),
      description: currentActive 
        ? `${t('common.patient')}: ${currentActive.pet?.name || 'Unknown'}`
        : t('dashboard.quickActions.noActiveAppointment'),
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      iconColor: '#3B82F6',
      onClick: handleMarkCurrentComplete,
      disabled: !currentActive || updateStatusMutation.isPending,
      loading: isLoadingActive || (updateStatusMutation.isPending && !!currentActive),
    },
    {
      icon: <StopOutlined className='text-2xl' />,
      title: t('dashboard.quickActions.blockTime'),
      description: t('dashboard.quickActions.preventBookings'),
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      iconColor: '#F59E0B',
      onClick: handleBlockTime,
    },
    {
      icon: <MessageOutlined className='text-2xl' />,
      title: t('dashboard.quickActions.sendSms'),
      description: t('dashboard.quickActions.communicatePatient'),
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      iconColor: '#8B5CF6',
      onClick: handleSendSMS,
    },
    {
      icon: <CalendarOutlined className='text-2xl' />,
      title: t('dashboard.quickActions.viewSchedule'),
      description: t('dashboard.quickActions.todayOverview'),
      gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
      iconColor: '#EC4899',
      onClick: handleViewSchedule,
    },
    {
      icon: <MedicineBoxOutlined className='text-2xl' />,
      title: t('dashboard.quickActions.emergency'),
      description: t('dashboard.quickActions.walkInReg'),
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      iconColor: '#EF4444',
      onClick: handleEmergencyWalkIn,
    },
  ];

  return (
    <Card 
      title={
        <span className='text-lg font-semibold text-slate-800'>
          {t('dashboard.quickActions.title')}
        </span>
      }
      className='border-0 shadow-lg hover:shadow-xl transition-shadow duration-300'
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      <Space direction='vertical' className='w-full' size='middle'>
        {actions.map((action, index) => (
          <div
            key={index}
            className={`group relative p-5 rounded-xl transition-all duration-300 overflow-hidden ${
              action.disabled 
                ? 'opacity-60 cursor-not-allowed bg-slate-50' 
                : 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5'
            }`}
            onClick={!action.disabled ? action.onClick : undefined}
            style={{
              background: action.disabled 
                ? '#f8fafc' 
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
            }}
          >
            {/* Decorative gradient overlay on hover */}
            {!action.disabled && (
              <div 
                className='absolute inset-0 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-300'
                style={{ background: action.gradient }}
              />
            )}
            
            <div className='relative flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 text-white ${
                    !action.disabled ? 'group-hover:scale-110 group-hover:shadow-lg' : ''
                  }`}
                  style={{ 
                    backgroundColor: action.disabled ? '#cbd5e1' : action.iconColor,
                  }}
                >
                  {action.icon}
                </div>
                
                {/* Content */}
                <div className='flex-1'>
                  <div className={`font-semibold text-base mb-1 transition-colors ${
                    action.disabled ? 'text-slate-400' : 'text-slate-800 group-hover:text-slate-900'
                  }`}>
                    {action.title}
                  </div>
                  <div className={`text-sm transition-colors ${
                    action.disabled ? 'text-slate-400' : 'text-slate-500 group-hover:text-slate-600'
                  }`}>
                    {action.description}
                  </div>
                </div>
              </div>
              
              {/* Arrow indicator */}
              {!action.disabled && (
                <div className='text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300'>
                  <ArrowRightOutlined className='text-lg' />
                </div>
              )}
            </div>
          </div>
        ))}
      </Space>
    </Card>
  );
};

export { QuickActions };
export default QuickActions;

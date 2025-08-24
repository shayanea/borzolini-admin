export const METRIC_COLORS = {
  REVENUE: '#059669',
  APPOINTMENTS: '#3b82f6',
  NEW_PATIENTS: '#fca311',
  SATISFACTION: '#8b5cf6',
} as const;

export const DEFAULT_METRICS = [
  {
    key: 'revenue',
    title: 'Total Revenue',
    value: 45680,
    prefix: '$',
    color: METRIC_COLORS.REVENUE,
    progress: 75,
  },
  {
    key: 'appointments',
    title: 'Appointments',
    value: 89,
    color: METRIC_COLORS.APPOINTMENTS,
    progress: 60,
  },
  {
    key: 'new_patients',
    title: 'New Patients',
    value: 23,
    color: METRIC_COLORS.NEW_PATIENTS,
    progress: 45,
  },
  {
    key: 'satisfaction',
    title: 'Satisfaction',
    value: 4.8,
    suffix: '/5',
    color: METRIC_COLORS.SATISFACTION,
    progress: 96,
  },
] as const;

export const REPORT_CATEGORIES = [
  {
    title: 'Financial Reports',
    reports: [
      {
        title: 'Monthly Revenue Report',
        description: 'Detailed financial breakdown',
        onClick: () => console.log('Monthly Revenue Report clicked'),
      },
      {
        title: 'Payment Analytics',
        description: 'Payment methods and trends',
        onClick: () => console.log('Payment Analytics clicked'),
      },
    ],
  },
  {
    title: 'Operational Reports',
    reports: [
      {
        title: 'Appointment Analytics',
        description: 'Scheduling and capacity analysis',
        onClick: () => console.log('Appointment Analytics clicked'),
      },
      {
        title: 'Staff Performance',
        description: 'Productivity and efficiency metrics',
        onClick: () => console.log('Staff Performance clicked'),
      },
    ],
  },
] as const;

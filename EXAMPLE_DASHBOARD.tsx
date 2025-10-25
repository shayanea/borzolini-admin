/**
 * Example Dashboard Page using Modern UI Components
 * 
 * This file shows how to use the new modern dashboard components together.
 * You can use this as a template for creating your actual dashboard page.
 * 
 * Path: src/pages/dashboard/example-dashboard.tsx
 */

import React from 'react';
import { DashboardCards, AppointmentsList } from '@/components/dashboard';

const ExampleDashboard: React.FC = () => {
  // Example data for dashboard
  const dashboardMetrics = [
    {
      title: "Today's Appointments",
      value: '3',
      subtitle: 'Next: 2:30 PM',
      icon: '📅',
      color: 'blue' as const,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Active Patients',
      value: '12',
      subtitle: 'Waiting to see vet',
      icon: '🐾',
      color: 'emerald' as const,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Pending Tasks',
      value: '5',
      subtitle: '1 high priority',
      icon: '✓',
      color: 'orange' as const,
      trend: { value: 15, isPositive: false },
    },
    {
      title: 'Revenue (Month)',
      value: '$12.5K',
      subtitle: 'vs $10.2K last month',
      icon: '💰',
      color: 'purple' as const,
      trend: { value: 22, isPositive: true },
    },
  ];

  const appointmentsData = [
    {
      id: '1',
      time: '09:00 AM',
      pet: 'Luna',
      petType: 'German Shepherd',
      owner: 'John Doe',
      ownerPhone: '+1 (555) 123-4567',
      status: 'completed' as const,
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
      status: 'in-progress' as const,
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
      status: 'scheduled' as const,
      type: 'Consultation',
      vetName: 'Dr. Mike',
    },
  ];

  const handleViewDetails = (id: string): void => {
    console.log('View details for appointment:', id);
    // Navigate to appointment details page
  };

  const handleReschedule = (id: string): void => {
    console.log('Reschedule appointment:', id);
    // Open reschedule modal
  };

  const handleCancel = (id: string): void => {
    console.log('Cancel appointment:', id);
    // Show cancel confirmation
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">Get a quick overview of your clinic's daily operations</p>
      </div>

      {/* Dashboard Metrics */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Key Metrics</h2>
        <DashboardCards cards={dashboardMetrics} />
      </section>

      {/* Appointments Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Schedule</h2>
        <AppointmentsList
          appointments={appointmentsData}
          onViewDetails={handleViewDetails}
          onReschedule={handleReschedule}
          onCancel={handleCancel}
        />
      </section>

      {/* Additional Stats (Optional) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Patient Satisfaction</h3>
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">4.8</p>
          <p className="text-sm text-slate-500 mt-2">Based on 125 reviews</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Booking Rate</h3>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">87%</p>
          <p className="text-sm text-slate-500 mt-2">Vs 82% last month</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Avg. Visit Duration</h3>
            <span className="text-2xl">⏱</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">45 min</p>
          <p className="text-sm text-slate-500 mt-2">Optimal care time</p>
        </div>
      </section>
    </div>
  );
};

export default ExampleDashboard;

/**
 * HOW TO USE THIS COMPONENT:
 * 
 * 1. Import in your page:
 *    import ExampleDashboard from '@/pages/dashboard/example-dashboard';
 * 
 * 2. Use with Modern Layout:
 *    import { ModernAdminLayout } from '@/components/layout';
 *    
 *    <ModernAdminLayout>
 *      <ExampleDashboard />
 *    </ModernAdminLayout>
 * 
 * 3. Customize data:
 *    - Replace dashboardMetrics with your real data
 *    - Replace appointmentsData with API calls
 *    - Connect event handlers to real functions
 * 
 * 4. Add more sections as needed:
 *    - Charts and graphs
 *    - Recent transactions
 *    - Patient feedback
 *    - Staff performance
 * 
 * STYLING TIPS:
 * 
 * - Use Tailwind classes for all styling
 * - Color options: blue, emerald, orange, purple, pink, indigo
 * - Spacing: p-4 (padding), m-4 (margin), gap-4 (flex gap)
 * - Responsive: md: (medium), lg: (large) breakpoints
 * - Rounded: rounded-lg (small), rounded-2xl (large)
 * - Shadows: shadow-sm (subtle), shadow-lg (prominent)
 * - Gradients: from-X-YZ to-X-YZ with bg-gradient-to-br
 */

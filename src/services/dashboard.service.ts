import type {
  DashboardFilters,
  DashboardStats,
  RecentActivityItem,
  TopPerformingClinic,
} from '@/types';

import { AppointmentsService } from './appointments.service';
import { ClinicsService } from './clinics.service';
// import { apiService } from './api';
import { UsersService } from './users.service';

export class DashboardService {
  // Get comprehensive dashboard statistics
  static async getDashboardStats(filters: DashboardFilters = {}): Promise<DashboardStats> {
    try {
      // Fetch data in parallel for better performance
      const [usersResponse, clinicsResponse, appointmentsStats] = await Promise.all([
        UsersService.getUsers({ limit: 1000, ...filters }),
        ClinicsService.getClinics({ limit: 1000, ...filters }),
        AppointmentsService.getStats(),
      ]);

      // Calculate totals
      const totalUsers = usersResponse.total;
      const totalClinics = clinicsResponse.total;
      const totalAppointments = appointmentsStats.total;

      // Filter users by role with proper typing
      const veterinarians = usersResponse.data.filter((user: any) => user.role === 'veterinarian');
      const patients = usersResponse.data.filter((user: any) => user.role === 'patient');

      // Calculate growth rate (mock for now - would need historical data)
      const growthRate = 12.5; // This would come from historical comparison

      // Calculate revenue (mock for now - would need payment integration)
      const revenueThisMonth = 45680; // This would come from payment system

      // Get recent activity
      const recentActivity = await this.getRecentActivity();

      // Get top performing clinics
      const topPerformingClinics = await this.getTopPerformingClinics();

      return {
        totalUsers,
        totalAppointments,
        totalVeterinarians: veterinarians.length,
        totalPatients: patients.length,
        totalClinics,
        appointmentsToday: appointmentsStats.today,
        pendingAppointments: appointmentsStats.pending + appointmentsStats.confirmed,
        completedAppointments: appointmentsStats.completed,
        cancelledAppointments: appointmentsStats.cancelled,
        urgentAppointments: 0, // Not available in current stats
        revenueThisMonth,
        growthRate,
        newUsersThisWeek: await this.getNewUsersCount(7),
        newClinicsThisMonth: await this.getNewClinicsCount(30),
        averageAppointmentDuration: 45, // Mock - would calculate from actual data
        topPerformingClinics,
        recentActivity,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Get recent activity for dashboard
  private static async getRecentActivity(): Promise<RecentActivityItem[]> {
    try {
      // This would typically come from a dedicated activity log endpoint
      // For now, we'll simulate with recent users and appointments
      const [recentUsers, recentAppointments] = await Promise.all([
        UsersService.getUsers({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }),
        AppointmentsService.getAll({ limit: 10 }),
      ]);

      const activities: RecentActivityItem[] = [];

      // Add recent user registrations
      recentUsers.data.slice(0, 5).forEach((user: any) => {
        activities.push({
          id: `user_${user.id}`,
          type: 'user_registration',
          description: `New ${user.role} registered`,
          timestamp: user.createdAt,
          userName: `${user.firstName} ${user.lastName}`,
        });
      });

      // Add recent appointments
      recentAppointments.appointments.slice(0, 5).forEach((appointment: any) => {
        activities.push({
          id: `appointment_${appointment.id}`,
          type: 'appointment_created',
          description: `New appointment scheduled`,
          timestamp: appointment.created_at,
          userName: appointment.owner_id, // Using owner_id as patient name for now
          clinicName: appointment.clinic_id, // Using clinic_id as clinic name for now
        });
      });

      // Sort by timestamp and return latest 10
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  // Get top performing clinics
  private static async getTopPerformingClinics(): Promise<TopPerformingClinic[]> {
    try {
      const clinics = await ClinicsService.getClinics({
        limit: 10,
        sortBy: 'rating',
        sortOrder: 'desc',
      });

      return clinics.data.slice(0, 5).map((clinic: any) => ({
        id: clinic.id,
        name: clinic.name,
        totalAppointments: 0, // Would need to fetch from appointments service
        rating: clinic.rating || 0,
        revenue: 0, // Would need payment integration
      }));
    } catch (error) {
      console.error('Error fetching top performing clinics:', error);
      return [];
    }
  }

  // Get count of new users in specified days
  private static async getNewUsersCount(days: number): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const users = await UsersService.getUsers({
        limit: 1000,
        dateRange: [cutoffDate.toISOString(), new Date().toISOString()],
      });

      return users.data.length;
    } catch (error) {
      console.error('Error fetching new users count:', error);
      return 0;
    }
  }

  // Get count of new clinics in specified days
  private static async getNewClinicsCount(days: number): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const clinics = await ClinicsService.getClinics({
        limit: 1000,
      });

      return clinics.data.length;
    } catch (error) {
      console.error('Error fetching new clinics count:', error);
      return 0;
    }
  }

  // Get dashboard charts data
  static async getDashboardCharts(filters: DashboardFilters = {}) {
    try {
      const [appointmentsStats, userStats] = await Promise.all([
        AppointmentsService.getStats(),
        UsersService.getUsers({ limit: 1000, ...filters }),
      ]);

      // Prepare chart data
      const appointmentStatusChart = Object.entries(appointmentsStats).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        color: this.getStatusColor(status),
      }));

      // Mock appointment type chart since it's not available in current stats
      const appointmentTypeChart = [
        { name: 'Consultation', value: 45, color: '#1890ff' },
        { name: 'Vaccination', value: 30, color: '#52c41a' },
        { name: 'Surgery', value: 15, color: '#fa8c16' },
        { name: 'Emergency', value: 10, color: '#ff4d4f' },
      ];

      const userRoleChart = userStats.data.reduce((acc: Record<string, number>, user: any) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      const userRoleChartData = Object.entries(userRoleChart).map(([role, count]) => ({
        name: role.charAt(0).toUpperCase() + role.slice(1),
        value: count,
        color: this.getRoleColor(role),
      }));

      return {
        appointmentStatusChart,
        appointmentTypeChart,
        userRoleChart: userRoleChartData,
      };
    } catch (error) {
      console.error('Error fetching dashboard charts:', error);
      throw error;
    }
  }

  // Helper methods for chart colors
  private static getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      total: '#1890ff',
      pending: '#faad14',
      confirmed: '#52c41a',
      in_progress: '#faad14',
      completed: '#52c41a',
      cancelled: '#ff4d4f',
      no_show: '#ff7875',
      today: '#13c2c2',
      thisWeek: '#722ed1',
      thisMonth: '#eb2f96',
    };
    return colors[status] || '#d9d9d9';
  }

  private static getRoleColor(role: string): string {
    const colors: Record<string, string> = {
      admin: '#ff4d4f',
      veterinarian: '#1890ff',
      staff: '#52c41a',
      patient: '#faad14',
    };
    return colors[role] || '#d9d9d9';
  }
}

export default DashboardService;

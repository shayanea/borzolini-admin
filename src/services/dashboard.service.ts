import type {
  Appointment,
  DashboardFilters,
  DashboardStats,
  RecentActivityItem,
  TopPerformingClinic,
  User,
} from '@/types';

import { AppointmentsService } from './appointments.service';
import { ClinicsService } from './clinics.service';
// import { apiService } from './api';
import { UsersService } from './users.service';

export class DashboardService {
  // Get comprehensive dashboard statistics
  static async getDashboardStats(filters: DashboardFilters = {}): Promise<DashboardStats> {
    try {
      console.log('DashboardService: Starting to fetch dashboard stats with filters:', filters);

      // Fetch data in parallel for better performance
      const [usersResponse, clinicsResponse, appointmentsStats] = await Promise.all([
        UsersService.getUsers({ limit: 1000, ...filters }).catch(error => {
          // Handle authentication errors gracefully
          if (error.response?.status === 401) {
            return { data: [], total: 0 };
          }
          throw error;
        }),
        ClinicsService.getClinics({ limit: 1000, ...filters }).catch(error => {
          // Handle authentication errors gracefully
          if (error.response?.status === 401) {
            return { clinics: [], total: 0, page: 1, limit: 10, totalPages: 0 };
          }
          throw error;
        }),
        AppointmentsService.getStats().catch(error => {
          // Handle authentication errors gracefully
          if (error.response?.status === 401) {
            return {
              total: 0,
              today: 0,
              pending: 0,
              confirmed: 0,
              completed: 0,
              cancelled: 0,
            };
          }
          throw error;
        }),
      ]);

      console.log('DashboardService: Raw API responses:', {
        usersResponse,
        clinicsResponse,
        appointmentsStats,
      });

      // Validate responses and provide fallbacks
      if (!usersResponse || !usersResponse.data || !Array.isArray(usersResponse.data)) {
        console.warn('DashboardService: Invalid users response structure:', usersResponse);
        // Return empty data instead of throwing error
        return this.getEmptyDashboardStats();
      }

      if (!clinicsResponse || !clinicsResponse.clinics || !Array.isArray(clinicsResponse.clinics)) {
        console.warn('DashboardService: Invalid clinics response structure:', clinicsResponse);
        // Return empty data instead of throwing error
        return this.getEmptyDashboardStats();
      }

      if (!appointmentsStats) {
        console.warn('DashboardService: Invalid appointments stats structure:', appointmentsStats);
        // Return empty data instead of throwing error
        return this.getEmptyDashboardStats();
      }

      // Calculate totals with safe fallbacks
      const totalUsers = usersResponse.total || usersResponse.data.length || 0;
      const totalClinics = clinicsResponse.total || clinicsResponse.clinics.length || 0;
      const totalAppointments = appointmentsStats.total || 0;

      console.log('DashboardService: Calculated totals:', {
        totalUsers,
        totalClinics,
        totalAppointments,
      });

      // Filter users by role with proper null checking
      const veterinarians =
        usersResponse.data.filter((user: User) => user?.role === 'veterinarian') || [];
      const patients = usersResponse.data.filter((user: User) => user?.role === 'patient') || [];

      console.log('DashboardService: Filtered users:', {
        veterinarians: veterinarians.length,
        patients: patients.length,
      });

      // Calculate growth rate (mock for now - would need historical data)
      const growthRate = 12.5; // This would come from historical comparison

      // Calculate revenue (mock for now - would need payment integration)
      const revenueThisMonth = 45680; // This would come from payment system

      // Get recent activity
      const recentActivity = await this.getRecentActivity();

      // Get top performing clinics
      const topPerformingClinics = await this.getTopPerformingClinics();

      const result = {
        totalUsers,
        totalAppointments,
        totalVeterinarians: veterinarians.length,
        totalPatients: patients.length,
        totalClinics,
        appointmentsToday: appointmentsStats.today || 0,
        pendingAppointments: (appointmentsStats.pending || 0) + (appointmentsStats.confirmed || 0),
        completedAppointments: appointmentsStats.completed || 0,
        cancelledAppointments: appointmentsStats.cancelled || 0,
        urgentAppointments: 0, // Not available in current stats
        revenueThisMonth,
        growthRate,
        newUsersThisWeek: await this.getNewUsersCount(7),
        newClinicsThisMonth: await this.getNewClinicsCount(30),
        averageAppointmentDuration: 45, // Mock - would calculate from actual data
        topPerformingClinics,
        recentActivity,
      };
      console.log('DashboardService: Dashboard stats calculated successfully:', result);
      return result;
    } catch (error: any) {
      console.error('DashboardService: Error fetching dashboard stats:', error);

      // If it's an authentication error, return empty stats instead of throwing
      if (error.response?.status === 401) {
        console.warn('DashboardService: Authentication failed, returning empty dashboard data');
        return this.getEmptyDashboardStats();
      }

      throw error;
    }
  }

  // Get empty dashboard stats for unauthenticated users or errors
  private static getEmptyDashboardStats(): DashboardStats {
    return {
      totalUsers: 0,
      totalAppointments: 0,
      totalVeterinarians: 0,
      totalPatients: 0,
      totalClinics: 0,
      appointmentsToday: 0,
      pendingAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
      urgentAppointments: 0,
      revenueThisMonth: 0,
      growthRate: 0,
      newUsersThisWeek: 0,
      newClinicsThisMonth: 0,
      averageAppointmentDuration: 0,
      topPerformingClinics: [],
      recentActivity: [],
    };
  }

  // Get recent activity for dashboard
  private static async getRecentActivity(): Promise<RecentActivityItem[]> {
    try {
      // This would typically come from a dedicated activity log endpoint
      // For now, we'll simulate with recent users and appointments
      const [recentUsers, recentAppointments] = await Promise.all([
        UsersService.getUsers({ limit: 10, sortBy: 'createdAt', sortOrder: 'DESC' }).catch(() => ({
          data: [],
        })),
        AppointmentsService.getAll({ limit: 10 }).catch(() => ({ appointments: [] })),
      ]);

      const activities: RecentActivityItem[] = [];

      // Add recent user registrations with null checking
      if (recentUsers?.data && Array.isArray(recentUsers.data)) {
        recentUsers.data.slice(0, 5).forEach((user: User) => {
          const isValid =
            user?.id && user?.role && user?.firstName && user?.lastName && user?.createdAt;
          if (isValid) {
            activities.push({
              id: `user_${user.id}`,
              type: 'user_registration',
              description: `New ${user.role} registered`,
              timestamp: user.createdAt || '',
              userName: `${user.firstName} ${user.lastName}`,
            });
          }
        });
      }

      // Add recent appointments with null checking
      if (recentAppointments?.appointments && Array.isArray(recentAppointments.appointments)) {
        recentAppointments.appointments.slice(0, 5).forEach((appointment: Appointment) => {
          if (appointment?.id && appointment?.created_at) {
            activities.push({
              id: `appointment_${appointment.id}`,
              type: 'appointment_created',
              description: `New appointment scheduled`,
              timestamp: appointment.created_at,
              userName: appointment.owner_id || 'Unknown', // Using owner_id as patient name for now
              clinicName: appointment.clinic_id || 'Unknown', // Using clinic_id as clinic name for now
            });
          }
        });
      }

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
        sortOrder: 'DESC',
      }).catch(() => ({ clinics: [], total: 0, page: 1, limit: 10, totalPages: 0 }));

      if (!clinics?.clinics || !Array.isArray(clinics.clinics)) {
        console.warn('Invalid clinics response structure:', clinics);
        return [];
      }

      return clinics.clinics.slice(0, 5).map((clinic: any) => ({
        id: clinic.id || 'unknown',
        name: clinic.name || 'Unknown Clinic',
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
      }).catch(() => ({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 }));

      if (!users?.data || !Array.isArray(users.data)) {
        console.warn('Invalid users response structure in getNewUsersCount:', users);
        return 0;
      }

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
      }).catch(() => ({ clinics: [], total: 0, page: 1, limit: 10, totalPages: 0 }));

      if (!clinics?.clinics || !Array.isArray(clinics.clinics)) {
        console.warn('Invalid clinics response structure in getNewClinicsCount:', clinics);
        return 0;
      }

      return clinics.clinics.length;
    } catch (error) {
      console.error('Error fetching new clinics count:', error);
      return 0;
    }
  }

  // Get dashboard charts data
  static async getDashboardCharts(filters: DashboardFilters = {}) {
    try {
      const [appointmentsStats, userStats] = await Promise.all([
        AppointmentsService.getStats().catch(() => ({
          total: 0,
          today: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
        })),
        UsersService.getUsers({ limit: 1000, ...filters }).catch(() => ({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 })),
      ]);

      // Validate responses
      if (!appointmentsStats) {
        throw new Error('Invalid appointments stats received');
      }

      if (!userStats?.data || !Array.isArray(userStats.data)) {
        throw new Error('Invalid user stats received');
      }

      // Prepare chart data
      const appointmentStatusChart = Object.entries(appointmentsStats).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count || 0,
        color: this.getStatusColor(status),
      }));

      // Mock appointment type chart since it's not available in current stats
      const appointmentTypeChart = [
        { name: 'Consultation', value: 45, color: '#1890ff' },
        { name: 'Vaccination', value: 30, color: '#52c41a' },
        { name: 'Surgery', value: 15, color: '#fa8c16' },
        { name: 'Emergency', value: 10, color: '#ff4d4f' },
      ];

      const userRoleChart = userStats.data.reduce((acc: Record<string, number>, user: User) => {
        if (user?.role) {
          acc[user.role] = (acc[user.role] || 0) + 1;
        }
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

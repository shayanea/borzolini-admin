// import { apiService } from './api';
import { UsersService } from './users.service';
import { ClinicsService } from './clinics.service';
import { AppointmentsService } from './appointments.service';

export interface DashboardStats {
  totalUsers: number;
  totalAppointments: number;
  totalVeterinarians: number;
  totalPatients: number;
  totalClinics: number;
  appointmentsToday: number;
  pendingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  urgentAppointments: number;
  revenueThisMonth: number;
  growthRate: number;
  newUsersThisWeek: number;
  newClinicsThisMonth: number;
  averageAppointmentDuration: number;
  topPerformingClinics: Array<{
    id: string;
    name: string;
    totalAppointments: number;
    rating: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'user_registration' | 'clinic_registration' | 'appointment_created' | 'appointment_completed';
    description: string;
    timestamp: string;
    userId?: string;
    userName?: string;
    clinicId?: string;
    clinicName?: string;
    appointmentId?: string;
  }>;
}

export interface DashboardFilters {
  dateRange?: [string, string];
  clinicId?: string;
  includeInactive?: boolean;
}

export class DashboardService {
  // Get comprehensive dashboard statistics
  static async getDashboardStats(filters: DashboardFilters = {}): Promise<DashboardStats> {
    try {
      // Fetch data in parallel for better performance
      const [
        usersResponse,
        clinicsResponse,
        appointmentsStats,
        // todayAppointments,
        // upcomingAppointments
      ] = await Promise.all([
        UsersService.getUsers({ limit: 1000, ...filters }),
        ClinicsService.getClinics({ limit: 1000, ...filters }),
        AppointmentsService.getAppointmentStats(filters.clinicId, filters.dateRange),
        AppointmentsService.getTodayAppointments(filters.clinicId),
        AppointmentsService.getUpcomingAppointments(filters.clinicId, 7)
      ]);

      // Calculate totals
      const totalUsers = usersResponse.total;
      const totalClinics = clinicsResponse.total;
      const totalAppointments = appointmentsStats.total;
      
      // Filter users by role
      const veterinarians = usersResponse.data.filter(user => user.role === 'veterinarian');
      const patients = usersResponse.data.filter(user => user.role === 'patient');
      
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
        pendingAppointments: appointmentsStats.byStatus['scheduled'] + appointmentsStats.byStatus['confirmed'],
        completedAppointments: appointmentsStats.completed,
        cancelledAppointments: appointmentsStats.cancelled,
        urgentAppointments: appointmentsStats.urgent,
        revenueThisMonth,
        growthRate,
        newUsersThisWeek: await this.getNewUsersCount(7),
        newClinicsThisMonth: await this.getNewClinicsCount(30),
        averageAppointmentDuration: 45, // Mock - would calculate from actual data
        topPerformingClinics,
        recentActivity
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Get recent activity for dashboard
  private static async getRecentActivity(): Promise<DashboardStats['recentActivity']> {
    try {
      // This would typically come from a dedicated activity log endpoint
      // For now, we'll simulate with recent users and appointments
      const [recentUsers, recentAppointments] = await Promise.all([
        UsersService.getUsers({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }),
        AppointmentsService.getAppointments({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' })
      ]);

      const activities: DashboardStats['recentActivity'] = [];

      // Add recent user registrations
      recentUsers.data.slice(0, 5).forEach(user => {
        activities.push({
          id: `user_${user.id}`,
          type: 'user_registration',
          description: `New ${user.role} registered`,
          timestamp: user.createdAt,
          userId: user.id,
          userName: `${user.firstName} ${user.lastName}`
        });
      });

      // Add recent appointments
      recentAppointments.data.slice(0, 5).forEach(appointment => {
        activities.push({
          id: `appointment_${appointment.id}`,
          type: 'appointment_created',
          description: `New appointment scheduled`,
          timestamp: appointment.createdAt,
          appointmentId: appointment.id,
          userName: appointment.patientName,
          clinicName: appointment.clinicName
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
  private static async getTopPerformingClinics(): Promise<DashboardStats['topPerformingClinics']> {
    try {
      const clinics = await ClinicsService.getClinics({ limit: 10, sortBy: 'rating', sortOrder: 'desc' });
      
      return clinics.data.slice(0, 5).map(clinic => ({
        id: clinic.id,
        name: clinic.name,
        totalAppointments: 0, // Would need to fetch from appointments service
        rating: clinic.rating,
        revenue: 0 // Would need payment integration
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
        dateRange: [cutoffDate.toISOString(), new Date().toISOString()]
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
        limit: 1000
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
        AppointmentsService.getAppointmentStats(filters.clinicId, filters.dateRange),
        UsersService.getUsers({ limit: 1000, ...filters })
      ]);

      // Prepare chart data
      const appointmentStatusChart = Object.entries(appointmentsStats.byStatus).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        color: this.getStatusColor(status)
      }));

      const appointmentTypeChart = Object.entries(appointmentsStats.byType).map(([type, count]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: count,
        color: this.getTypeColor(type)
      }));

      const userRoleChart = userStats.data.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const userRoleChartData = Object.entries(userRoleChart).map(([role, count]) => ({
        name: role.charAt(0).toUpperCase() + role.slice(1),
        value: count,
        color: this.getRoleColor(role)
      }));

      return {
        appointmentStatusChart,
        appointmentTypeChart,
        userRoleChart: userRoleChartData
      };
    } catch (error) {
      console.error('Error fetching dashboard charts:', error);
      throw error;
    }
  }

  // Helper methods for chart colors
  private static getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'scheduled': '#1890ff',
      'confirmed': '#52c41a',
      'in-progress': '#faad14',
      'completed': '#52c41a',
      'cancelled': '#ff4d4f',
      'no-show': '#ff7875'
    };
    return colors[status] || '#d9d9d9';
  }

  private static getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'consultation': '#1890ff',
      'vaccination': '#52c41a',
      'surgery': '#fa8c16',
      'emergency': '#ff4d4f',
      'follow-up': '#722ed1',
      'checkup': '#13c2c2'
    };
    return colors[type] || '#d9d9d9';
  }

  private static getRoleColor(role: string): string {
    const colors: Record<string, string> = {
      'admin': '#ff4d4f',
      'veterinarian': '#1890ff',
      'staff': '#52c41a',
      'patient': '#faad14'
    };
    return colors[role] || '#d9d9d9';
  }
}

export default DashboardService;

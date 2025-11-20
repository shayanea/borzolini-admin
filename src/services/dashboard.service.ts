import type { DashboardFilters, DashboardStats } from '@/types';

import { apiService } from './api/index';

export class DashboardService {
  // Get comprehensive dashboard statistics from centralized endpoint
  static async getDashboardStats(filters: DashboardFilters = {}): Promise<DashboardStats> {
    try {
      // For clinic_admin users, use clinic-specific endpoint
      let url: string;

      if (filters.clinicId) {
        // Correct clinic-specific stats endpoint (no query params supported)
        url = `/dashboard/clinic/${filters.clinicId}`;

        console.log('🏥 DashboardService: Using clinic stats endpoint', {
          url,
          clinicId: filters.clinicId,
        });
      } else {
        // Use general dashboard endpoint with optional dateRange
        const params = new URLSearchParams();
        if (filters.dateRange) {
          params.append('dateRange', JSON.stringify(filters.dateRange));
        }

        const queryString = params.toString();
        url = `/dashboard/stats${queryString ? `?${queryString}` : ''}`;

        console.log('📊 DashboardService: Using general dashboard endpoint', {
          url,
          filters,
        });
      }

      const response = await apiService.get<{ data?: any } | any>(url);

      // Handle different possible response formats
      let dashboardData: any;
      if (typeof response === 'object' && response !== null && 'data' in response && response.data) {
        dashboardData = response.data;
      } else if (response && typeof response === 'object') {
        // Direct response format
        dashboardData = response;
      } else {
        console.warn('DashboardService: No data received from dashboard endpoint');
        return this.getEmptyDashboardStats();
      }

      // Transform the API response to match frontend interface
      return this.transformApiResponse(dashboardData);
    } catch (error: any) {
      console.error('DashboardService: Error fetching dashboard stats:', error);

      // If it's an authentication error, return empty stats
      if (error.response?.status === 401) {
        console.warn('DashboardService: Authentication failed, returning empty dashboard data');
        return this.getEmptyDashboardStats();
      }

      // If the centralized endpoint fails, fallback to original implementation
      console.warn(
        'DashboardService: Centralized endpoint failed, falling back to distributed calls'
      );
      return this.getEmptyDashboardStats();
    }
  }

  // Transform API response to match frontend interface
  private static transformApiResponse(apiResponse: any): DashboardStats {
    const {
      totalUsers = 0,
      totalAppointments = 0,
      totalVeterinarians = 0,
      totalPatients = 0,
      totalClinics = 0,
      appointmentsToday = 0,
      pendingAppointments = 0,
      completedAppointments = 0,
      cancelledAppointments = 0,
      urgentAppointments = 0,
      revenueThisMonth = 0,
      growthRate = 0,
      newUsersThisWeek = 0,
      newClinicsThisMonth = 0,
      averageAppointmentDuration = 0,
      topPerformingClinics = [],
      recentActivity = [],
      petCases = undefined,
    } = apiResponse || {};

    return {
      totalUsers,
      totalAppointments,
      totalVeterinarians,
      totalPatients,
      totalClinics,
      appointmentsToday,
      pendingAppointments,
      completedAppointments,
      cancelledAppointments,
      urgentAppointments,
      revenueThisMonth,
      growthRate,
      newUsersThisWeek,
      newClinicsThisMonth,
      averageAppointmentDuration,
      topPerformingClinics,
      recentActivity,
      petCases,
    };
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
      petCases: undefined,
    };
  }

  // Get dashboard charts data from centralized endpoint
  static async getDashboardCharts(filters: DashboardFilters = {}) {
    try {
      // For clinic_admin users, use clinic-specific endpoint
      let url: string;

      if (filters.clinicId) {
        // Correct clinic-specific charts endpoint uses query parameter
        const params = new URLSearchParams();
        params.append('clinicId', filters.clinicId);
        if (filters.dateRange) {
          params.append('dateRange', JSON.stringify(filters.dateRange));
        }
        const queryString = params.toString();
        url = `/dashboard/charts${queryString ? `?${queryString}` : ''}`;

        console.log('🏥 DashboardService: Using clinic charts endpoint', {
          url,
          clinicId: filters.clinicId,
        });
      } else {
        // Use general dashboard endpoint
        const params = new URLSearchParams();
        if (filters.dateRange) {
          params.append('dateRange', JSON.stringify(filters.dateRange));
        }

        const queryString = params.toString();
        url = `/dashboard/charts${queryString ? `?${queryString}` : ''}`;

        console.log('📊 DashboardService: Using general charts endpoint', {
          url,
          filters,
        });
      }

      const response = await apiService.get<{ data?: any } | any>(url);

      // Handle different possible response formats
      let chartsData: any;
      if (typeof response === 'object' && response !== null && 'data' in response && response.data) {
        chartsData = response.data;
      } else if (response && typeof response === 'object') {
        // Direct response format
        chartsData = response;
      } else {
        console.warn('DashboardService: No charts data received from dashboard endpoint');
        return this.getEmptyDashboardCharts();
      }

      // Transform the API response to match frontend interface
      return this.transformChartsApiResponse(chartsData);
    } catch (error: any) {
      console.error('DashboardService: Error fetching dashboard charts:', error);

      // If it's an authentication error, return empty charts
      if (error.response?.status === 401) {
        console.warn('DashboardService: Authentication failed, returning empty dashboard charts');
        return this.getEmptyDashboardCharts();
      }

      // If the centralized endpoint fails, fallback to original implementation
      console.warn(
        'DashboardService: Centralized charts endpoint failed, falling back to distributed calls'
      );
      return this.getEmptyDashboardCharts();
    }
  }

  // Transform charts API response to match frontend interface
  private static transformChartsApiResponse(apiResponse: any) {
    return {
      appointmentStatusChart: apiResponse.appointmentStatusChart || [],
      appointmentTypeChart: apiResponse.appointmentTypeChart || [],
      userRoleChart: apiResponse.userRoleChart || [],
      clinicPerformanceChart: apiResponse.clinicPerformanceChart || [],
    };
  }

  // Get empty dashboard charts for error states
  private static getEmptyDashboardCharts() {
    return {
      appointmentStatusChart: [],
      appointmentTypeChart: [],
      userRoleChart: [],
      clinicPerformanceChart: [],
    };
  }
}

export default DashboardService;

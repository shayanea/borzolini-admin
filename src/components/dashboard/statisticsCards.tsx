import React from 'react';
import { Row, Col, Card, Statistic, Typography, Progress } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  HomeOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { DashboardStats } from '@/types';

const { Text } = Typography;

interface StatisticsCardsProps {
  stats: DashboardStats;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats }) => {
  return (
    <>
      {/* Main Statistics Row */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card hover:shadow-admin-lg transition-shadow">
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined className="text-primary-navy" />}
              valueStyle={{ color: '#14213d' }}
            />
            <div className="flex items-center justify-between mt-2">
              <Text className="text-sm text-text-light">
                +{stats.newUsersThisWeek} this week
              </Text>
              <Progress
                percent={Math.min((stats.newUsersThisWeek / Math.max(stats.totalUsers, 1)) * 100, 100)}
                showInfo={false}
                strokeColor="#14213d"
                size="small"
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card hover:shadow-admin-lg transition-shadow">
            <Statistic
              title="Today's Appointments"
              value={stats.appointmentsToday}
              prefix={<CalendarOutlined className="text-primary-orange" />}
              valueStyle={{ color: '#fca311' }}
            />
            <div className="flex items-center justify-between mt-2">
              <Text className="text-sm text-text-light">
                {stats.pendingAppointments} pending
              </Text>
              <Progress
                percent={Math.min((stats.appointmentsToday / Math.max(stats.totalAppointments, 1)) * 100, 100)}
                showInfo={false}
                strokeColor="#fca311"
                size="small"
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card hover:shadow-admin-lg transition-shadow">
            <Statistic
              title="Veterinarians"
              value={stats.totalVeterinarians}
              prefix={<TeamOutlined className="text-health-excellent" />}
              valueStyle={{ color: '#059669' }}
            />
            <div className="flex items-center justify-between mt-2">
              <Text className="text-sm text-text-light">
                {stats.totalClinics} clinics
              </Text>
              <Progress
                percent={Math.min((stats.totalVeterinarians / Math.max(stats.totalUsers, 1)) * 100, 100)}
                showInfo={false}
                strokeColor="#059669"
                size="small"
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card hover:shadow-admin-lg transition-shadow">
            <Statistic
              title="Monthly Revenue"
              value={stats.revenueThisMonth}
              prefix={<DollarOutlined className="text-health-good" />}
              suffix="USD"
              valueStyle={{ color: '#fca311' }}
            />
            <div className="flex items-center mt-2">
              <RiseOutlined className="text-health-excellent mr-1" />
              <Text className="text-health-excellent text-sm">
                +{stats.growthRate}% from last month
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Stats Row */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card hover:shadow-admin-lg transition-shadow">
            <Statistic
              title="Total Clinics"
              value={stats.totalClinics}
              prefix={<HomeOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3b82f6' }}
            />
            <div className="flex items-center justify-between mt-2">
              <Text className="text-sm text-text-light">
                +{stats.newClinicsThisMonth} this month
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card hover:shadow-admin-lg transition-shadow">
            <Statistic
              title="Urgent Cases"
              value={stats.urgentAppointments}
              prefix={<ExclamationCircleOutlined className="text-red-500" />}
              valueStyle={{ color: '#ef4444' }}
            />
            <div className="flex items-center justify-between mt-2">
              <Text className="text-sm text-text-light">
                {stats.appointmentsToday} today
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card hover:shadow-admin-lg transition-shadow">
            <Statistic
              title="Completed Today"
              value={stats.completedAppointments}
              prefix={<ClockCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#10b981' }}
            />
            <div className="flex items-center justify-between mt-2">
              <Text className="text-sm text-text-light">
                {stats.averageAppointmentDuration} min avg
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card hover:shadow-admin-lg transition-shadow">
            <Statistic
              title="Total Patients"
              value={stats.totalPatients}
              prefix={<UserOutlined className="text-purple-500" />}
              valueStyle={{ color: '#8b5cf6' }}
            />
            <div className="flex items-center justify-between mt-2">
              <Text className="text-sm text-text-light">
                Active patients
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StatisticsCards;

import React from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Progress, List, Avatar } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { DashboardStats } from '@/types';

const { Title, Text } = Typography;

// Mock data - replace with actual API calls
const mockStats: DashboardStats = {
  totalUsers: 1247,
  totalAppointments: 89,
  totalVeterinarians: 12,
  totalPatients: 1156,
  appointmentsToday: 23,
  pendingAppointments: 7,
  revenueThisMonth: 45680,
  growthRate: 12.5,
};

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <Title level={2} className="!mb-2">
          Dashboard
        </Title>
        <Text className="text-text-light">
          Welcome back! Here's what's happening with your clinic today.
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card hover:shadow-admin-lg transition-shadow">
            <Statistic
              title="Total Users"
              value={mockStats.totalUsers}
              prefix={<UserOutlined className="text-primary-navy" />}
              valueStyle={{ color: '#14213d' }}
            />
            <Progress
              percent={75}
              showInfo={false}
              strokeColor="#14213d"
              className="mt-2"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card hover:shadow-admin-lg transition-shadow">
            <Statistic
              title="Today's Appointments"
              value={mockStats.appointmentsToday}
              prefix={<CalendarOutlined className="text-primary-orange" />}
              valueStyle={{ color: '#fca311' }}
            />
            <Progress
              percent={60}
              showInfo={false}
              strokeColor="#fca311"
              className="mt-2"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card hover:shadow-admin-lg transition-shadow">
            <Statistic
              title="Veterinarians"
              value={mockStats.totalVeterinarians}
              prefix={<TeamOutlined className="text-health-excellent" />}
              valueStyle={{ color: '#059669' }}
            />
            <Progress
              percent={90}
              showInfo={false}
              strokeColor="#059669"
              className="mt-2"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card hover:shadow-admin-lg transition-shadow">
            <Statistic
              title="Monthly Revenue"
              value={mockStats.revenueThisMonth}
              prefix={<DollarOutlined className="text-health-good" />}
              suffix="USD"
              valueStyle={{ color: '#fca311' }}
            />
            <div className="flex items-center mt-2">
              <RiseOutlined className="text-health-excellent mr-1" />
              <Text className="text-health-excellent text-sm">
                +{mockStats.growthRate}% from last month
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions and Recent Activity */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title="Recent Appointments"
            className="admin-card"
            extra={
              <Text className="text-primary-navy cursor-pointer hover:underline">
                View All
              </Text>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  name: 'Diego Rossi',
                  pet: 'Bella (Dog)',
                  time: '7:30 - 8:20 AM',
                  veterinarian: 'Dr. Alfhard Botwright',
                  status: 'confirmed',
                },
                {
                  name: 'Isabella Bianchi',
                  pet: 'Oscar (Turtle)',
                  time: '7:30 - 8:50 AM',
                  veterinarian: 'Dr. Faramund Eks',
                  status: 'confirmed',
                },
                {
                  name: 'Stefan Müller',
                  pet: 'No pet listed',
                  time: '9:00 - 10:00 AM',
                  veterinarian: 'Dr. Alfhard Botwright',
                  status: 'scheduled',
                },
                {
                  name: 'Sofia Fernandez',
                  pet: 'Rocky (Dog)',
                  time: '9:00 - 10:00 AM',
                  veterinarian: 'Dr. Faramund Eks',
                  status: 'confirmed',
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: item.status === 'confirmed' ? '#059669' : '#fca311',
                        }}
                        icon={<ClockCircleOutlined />}
                      />
                    }
                    title={
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.name}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    }
                    description={
                      <div className="space-y-1">
                        <div className="text-sm text-text-light">
                          {item.pet} • {item.time}
                        </div>
                        <div className="text-sm text-primary-navy font-medium">
                          {item.veterinarian}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Quick Actions"
            className="admin-card"
          >
            <Space direction="vertical" className="w-full" size="middle">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-navy cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-navy rounded-lg flex items-center justify-center">
                    <CalendarOutlined className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">New Appointment</div>
                    <div className="text-sm text-text-light">Schedule a new visit</div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-navy cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-orange rounded-lg flex items-center justify-center">
                    <UserOutlined className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">Add Patient</div>
                    <div className="text-sm text-text-light">Register new patient</div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-navy cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-health-excellent rounded-lg flex items-center justify-center">
                    <TeamOutlined className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">Manage Staff</div>
                    <div className="text-sm text-text-light">Update team members</div>
                  </div>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

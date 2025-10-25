import {
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  RiseOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import type { DashboardStats } from '@/types';

const { Text } = Typography;

interface StatisticsCardsProps {
  stats: DashboardStats;
}

const StatisticsCards = ({ stats }: StatisticsCardsProps) => {
  const { t } = useTranslation('components');

  return (
    <div className='space-y-6'>
      {/* Main Statistics Row */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className='admin-card hover:shadow-admin-lg transition-all duration-200 border-0 shadow-sm'>
            <div className='text-center'>
              <div className='flex justify-center mb-3'>
                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <UserOutlined className='text-xl text-blue-600' />
                </div>
              </div>
              <Statistic
                title={
                  <span className='text-sm font-medium text-text-primary'>
                    {t('dashboard.stats.totalUsers')}
                  </span>
                }
                value={stats.totalUsers}
                valueStyle={{
                  color: '#023e8a',
                  fontSize: '2rem',
                  fontWeight: '600',
                  lineHeight: '1.2',
                }}
              />
              <div className='mt-2'>
                <Text className='text-sm text-text-light'>
                  +{stats.newUsersThisWeek} {t('dashboard.stats.newUsersThisWeek')}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className='admin-card hover:shadow-admin-lg transition-all duration-200 border-0 shadow-sm'>
            <div className='text-center'>
              <div className='flex justify-center mb-3'>
                <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
                  <CalendarOutlined className='text-xl text-orange-600' />
                </div>
              </div>
              <Statistic
                title={
                  <span className='text-sm font-medium text-text-primary'>
                    {t('dashboard.stats.appointmentsToday')}
                  </span>
                }
                value={stats.appointmentsToday}
                valueStyle={{
                  color: '#fca311',
                  fontSize: '2rem',
                  fontWeight: '600',
                  lineHeight: '1.2',
                }}
              />
              <div className='mt-2'>
                <Text className='text-sm text-text-light'>
                  {stats.pendingAppointments} {t('dashboard.stats.pendingAppointments')}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className='admin-card hover:shadow-admin-lg transition-all duration-200 border-0 shadow-sm'>
            <div className='text-center'>
              <div className='flex justify-center mb-3'>
                <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                  <TeamOutlined className='text-xl text-green-600' />
                </div>
              </div>
              <Statistic
                title={
                  <span className='text-sm font-medium text-text-primary'>
                    {t('dashboard.stats.veterinarians')}
                  </span>
                }
                value={stats.totalVeterinarians}
                valueStyle={{
                  color: '#059669',
                  fontSize: '2rem',
                  fontWeight: '600',
                  lineHeight: '1.2',
                }}
              />
              <div className='mt-2'>
                <Text className='text-sm text-text-light'>
                  {stats.totalClinics} {t('dashboard.stats.clinics')}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className='admin-card hover:shadow-admin-lg transition-all duration-200 border-0 shadow-sm'>
            <div className='text-center'>
              <div className='flex justify-center mb-3'>
                <div className='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center'>
                  <DollarOutlined className='text-xl text-yellow-600' />
                </div>
              </div>
              <Statistic
                title={
                  <span className='text-sm font-medium text-text-primary'>
                    {t('dashboard.stats.monthlyRevenue')}
                  </span>
                }
                value={0}
                suffix='USD'
                valueStyle={{
                  color: '#fca311',
                  fontSize: '2rem',
                  fontWeight: '600',
                  lineHeight: '1.2',
                }}
              />
              <div className='mt-2 flex items-center justify-center'>
                <RiseOutlined className='text-green-500 mr-1' />
                <Text className='text-green-500 text-sm font-medium'>
                  +0% {t('dashboard.stats.fromLastMonth')}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Stats Row */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className='admin-card hover:shadow-admin-lg transition-all duration-200 border-0 shadow-sm'>
            <div className='text-center'>
              <div className='flex justify-center mb-3'>
                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <HomeOutlined className='text-xl text-blue-600' />
                </div>
              </div>
              <Statistic
                title={
                  <span className='text-sm font-medium text-text-primary'>
                    {t('dashboard.stats.totalClinics')}
                  </span>
                }
                value={stats.totalClinics}
                valueStyle={{
                  color: '#3b82f6',
                  fontSize: '2rem',
                  fontWeight: '600',
                  lineHeight: '1.2',
                }}
              />
              <div className='mt-2'>
                <Text className='text-sm text-text-light'>
                  +{stats.newClinicsThisMonth} {t('dashboard.stats.newClinicsThisMonth')}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className='admin-card hover:shadow-admin-lg transition-all duration-200 border-0 shadow-sm'>
            <div className='text-center'>
              <div className='flex justify-center mb-3'>
                <div className='w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center'>
                  <ExclamationCircleOutlined className='text-xl text-red-600' />
                </div>
              </div>
              <Statistic
                title={
                  <span className='text-sm font-medium text-text-primary'>
                    {t('dashboard.stats.urgentCases')}
                  </span>
                }
                value={stats.urgentAppointments}
                valueStyle={{
                  color: '#ef4444',
                  fontSize: '2rem',
                  fontWeight: '600',
                  lineHeight: '1.2',
                }}
              />
              <div className='mt-2'>
                <Text className='text-sm text-text-light'>{stats.appointmentsToday} today</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className='admin-card hover:shadow-admin-lg transition-all duration-200 border-0 shadow-sm'>
            <div className='text-center'>
              <div className='flex justify-center mb-3'>
                <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                  <ClockCircleOutlined className='text-xl text-green-600' />
                </div>
              </div>
              <Statistic
                title={
                  <span className='text-sm font-medium text-text-primary'>
                    {t('dashboard.stats.completedToday')}
                  </span>
                }
                value={stats.completedAppointments}
                valueStyle={{
                  color: '#10b981',
                  fontSize: '2rem',
                  fontWeight: '600',
                  lineHeight: '1.2',
                }}
              />
              <div className='mt-2'>
                <Text className='text-sm text-text-light'>
                  {stats.averageAppointmentDuration} {t('dashboard.stats.minAvg')}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className='admin-card hover:shadow-admin-lg transition-all duration-200 border-0 shadow-sm'>
            <div className='text-center'>
              <div className='flex justify-center mb-3'>
                <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                  <UserOutlined className='text-xl text-purple-600' />
                </div>
              </div>
              <Statistic
                title={
                  <span className='text-sm font-medium text-text-primary'>
                    {t('dashboard.stats.totalPatients')}
                  </span>
                }
                value={stats.totalPatients}
                valueStyle={{
                  color: '#8b5cf6',
                  fontSize: '2rem',
                  fontWeight: '600',
                  lineHeight: '1.2',
                }}
              />
              <div className='mt-2'>
                <Text className='text-sm text-text-light'>
                  {t('dashboard.stats.activePatients')}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsCards;

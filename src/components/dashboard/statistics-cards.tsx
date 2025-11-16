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
import { Card, Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import type { DashboardStats } from '@/types';

const { Text } = Typography;

interface StatisticsCardsProps {
  stats: DashboardStats;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: React.ReactNode;
  gradient: string;
  iconBg: string;
  valueColor: string;
}

const StatCard = ({ icon, title, value, subtitle, gradient, iconBg, valueColor }: StatCardProps) => {
  return (
    <Card 
      className='relative overflow-hidden border-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group bg-white'
      style={{
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Decorative subtle background */}
      <div 
        className='absolute inset-0 opacity-[0.02] transition-opacity duration-300 group-hover:opacity-[0.04]'
        style={{
          background: gradient,
        }}
      />
      
      <div className='relative z-10'>
        {/* Icon */}
        <div className='flex items-start justify-between mb-4'>
          <div 
            className='p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg'
            style={{ 
              backgroundColor: iconBg,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className='text-2xl flex items-center justify-center'>
              {icon}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='space-y-3'>
          <Text className='text-sm font-medium text-slate-600 block'>
            {title}
          </Text>
          
          <div 
            className='text-4xl font-bold tracking-tight transition-all duration-300 group-hover:scale-105'
            style={{ color: valueColor }}
          >
            {value}
          </div>
          
          <div className='flex items-center'>
            <Text className='text-sm text-slate-500'>
              {subtitle}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

const StatisticsCards = ({ stats }: StatisticsCardsProps) => {
  const { t } = useTranslation('components');

  return (
    <div className='space-y-6'>
      {/* Main Statistics Row */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<UserOutlined style={{ color: '#3b82f6' }} />}
            title={t('dashboard.stats.totalUsers')}
            value={stats.totalUsers}
            subtitle={`+${stats.newUsersThisWeek} ${t('dashboard.stats.newUsersThisWeek')}`}
            gradient='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            iconBg='#dbeafe'
            valueColor='#1e40af'
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<CalendarOutlined style={{ color: '#f59e0b' }} />}
            title={t('dashboard.stats.appointmentsToday')}
            value={stats.appointmentsToday}
            subtitle={`${stats.pendingAppointments} ${t('dashboard.stats.pendingAppointments')}`}
            gradient='linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            iconBg='#fef3c7'
            valueColor='#d97706'
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<TeamOutlined style={{ color: '#10b981' }} />}
            title={t('dashboard.stats.veterinarians')}
            value={stats.totalVeterinarians}
            subtitle={`${stats.totalClinics} ${t('dashboard.stats.clinics')}`}
            gradient='linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
            iconBg='#d1fae5'
            valueColor='#047857'
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<DollarOutlined style={{ color: '#f59e0b' }} />}
            title={t('dashboard.stats.monthlyRevenue')}
            value='0 USD'
            subtitle={
              <span className='flex items-center gap-1'>
                <RiseOutlined className='text-emerald-500' />
                <span className='text-emerald-500 font-semibold'>
                  +0% {t('dashboard.stats.fromLastMonth')}
                </span>
              </span>
            }
            gradient='linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
            iconBg='#fef3c7'
            valueColor='#d97706'
          />
        </Col>
      </Row>

      {/* Additional Stats Row */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<HomeOutlined style={{ color: '#06b6d4' }} />}
            title={t('dashboard.stats.totalClinics')}
            value={stats.totalClinics}
            subtitle={`+${stats.newClinicsThisMonth} ${t('dashboard.stats.newClinicsThisMonth')}`}
            gradient='linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            iconBg='#cffafe'
            valueColor='#0e7490'
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<ExclamationCircleOutlined style={{ color: '#ef4444' }} />}
            title={t('dashboard.stats.urgentCases')}
            value={stats.urgentAppointments}
            subtitle={`${stats.appointmentsToday} today`}
            gradient='linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
            iconBg='#fee2e2'
            valueColor='#dc2626'
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<ClockCircleOutlined style={{ color: '#10b981' }} />}
            title={t('dashboard.stats.completedToday')}
            value={stats.completedAppointments}
            subtitle={`${stats.averageAppointmentDuration} ${t('dashboard.stats.minAvg')}`}
            gradient='linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
            iconBg='#d1fae5'
            valueColor='#047857'
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={<UserOutlined style={{ color: '#8b5cf6' }} />}
            title={t('dashboard.stats.totalPatients')}
            value={stats.totalPatients}
            subtitle={t('dashboard.stats.activePatients')}
            gradient='linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
            iconBg='#ede9fe'
            valueColor='#7c3aed'
          />
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsCards;

import React from 'react';
import { Card, Col, Row, Typography, Button } from 'antd';
import { BarChartOutlined, CalendarOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const Reports = () => {
  const { t } = useTranslation('pages');

  const reportCards = [
    {
      icon: <BarChartOutlined />,
      title: t('reports.appointmentReports') || 'Appointment Reports',
      description: t('reports.trackAppointments') || 'Track appointment trends and statistics',
      color: '#667eea',
      bgColor: '#dbeafe',
    },
    {
      icon: <DollarOutlined />,
      title: t('reports.financialReports') || 'Financial Reports',
      description: t('reports.revenueAnalysis') || 'Analyze revenue and billing data',
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      icon: <UserOutlined />,
      title: t('reports.userReports') || 'User Reports',
      description: t('reports.userActivity') || 'Monitor user engagement and activity',
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      icon: <CalendarOutlined />,
      title: t('reports.calendarReports') || 'Calendar Reports',
      description: t('reports.scheduleAnalysis') || 'Analyze scheduling patterns',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='bg-white rounded-xl border border-slate-200 shadow-sm p-6'>
        <div className='flex items-center gap-4'>
          <div 
            className='w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-white'
            style={{ backgroundColor: '#667eea' }}
          >
            <BarChartOutlined className='text-xl' />
          </div>
          <div className='flex-1'>
            <Title level={2} className='mb-1 text-slate-800 !tracking-tight !font-bold'>
              {t('reports.title')} 
            </Title>
            <Text className='text-slate-600 font-medium text-base'>
              {t('reports.subtitle')} 
            </Text>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <Card 
        title={
          <div className='flex items-center gap-2'>
            <span className='text-lg font-semibold text-slate-800'>
              {t('reports.categories')} 
            </span>
          </div>
        }
        className='border-0 shadow-lg rounded-xl overflow-hidden'
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        }}
      >
        <Row gutter={[24, 24]}>
          {reportCards.map((card, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <div 
                className='group cursor-pointer p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden'
                style={{
                  backgroundColor: 'white',
                }}
              >
                <div 
                  className='absolute inset-0 opacity-0 group-hover:opacity-[0.02]'
                  style={{ backgroundColor: card.color }}
                />
                
                <div className='relative z-10 flex flex-col items-center space-y-3 h-full'>
                  <div 
                    className='w-16 h-16 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-all duration-300'
                    style={{ 
                      backgroundColor: card.bgColor,
                    }}
                  >
                    <div className='text-2xl' style={{ color: card.color }}>
                      {card.icon}
                    </div>
                  </div>
                  
                  <div className='text-center'>
                    <h3 className='text-lg font-semibold text-slate-800 mb-1'>
                      {card.title}
                    </h3>
                    <p className='text-sm text-slate-600'>
                      {card.description}
                    </p>
                  </div>
                  
                  <div className='mt-auto'>
                    <Button 
                      type='primary'
                      className='w-full h-10 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300'
                      style={{
                        backgroundColor: card.color,
                        border: 'none',
                      }}
                    >
                      {t('reports.viewReports')}
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Recent Reports Section */}
      <Card 
        title={
          <div className='flex items-center gap-2'>
            <span className='text-lg font-semibold text-slate-800'>
              {t('reports.recentReports')}
            </span>
          </div>
        }
        className='border-0 shadow-lg rounded-xl overflow-hidden'
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        }}
      >
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className='p-4 border border-slate-200 rounded-lg bg-white hover:shadow-md transition-all duration-300'>
                <div className='flex items-start justify-between mb-3'>
                  <div 
                    className='w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0'
                    style={{ 
                      backgroundColor: '#dbeafe',
                    }}
                  >
                    <BarChartOutlined className='text-lg' style={{ color: '#1e40af' }} />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h4 className='font-medium text-sm text-slate-800 truncate'>
                      {t('reports.appointmentTrends')} {index + 1}
                    </h4>
                    <p className='text-xs text-slate-500'>
                      {t('reports.generated')} {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className='text-sm text-slate-600 mb-4'>
                  {t('reports.appointmentReportDescription')}
                </div>
                
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-xs text-slate-500'>
                    <span className='w-2 h-2 rounded-full bg-green-400'></span>
                    <span>Completed: 245</span>
                  </div>
                  <Button 
                    type='link' 
                    size='small' 
                    className='text-blue-600 hover:text-blue-700 font-medium'
                  >
                    {t('reports.view')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Export Options */}
      <Card 
        title={
          <div className='flex items-center gap-2'>
            <span className='text-lg font-semibold text-slate-800'>
              {t('reports.exportData')}
            </span>
          </div>
        }
        className='border-0 shadow-lg rounded-xl overflow-hidden'
      >
        <div className='space-y-4 p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Button 
              type='primary' 
              block 
              className='h-12 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300'
              style={{
                backgroundColor: '#667eea',
                border: 'none',
              }}
            >
              Export All Reports (CSV)
            </Button>
            
            <Button 
              block 
              className='h-12 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300'
            >
              Export Selected Reports
            </Button>
            
            <Button 
              block 
              className='h-12 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300'
            >
              Schedule Report
            </Button>
          </div>
          
          <div className='pt-4 border-t border-slate-200'>
            <Text className='text-sm text-slate-600'>
              {t('reports.exportDescription')}
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;

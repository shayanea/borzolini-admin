import React from 'react';
import { Card, Col, Row, Typography, Switch, Button, Space } from 'antd';
import {
  BellOutlined,
  CreditCardOutlined,
  GlobalOutlined,
  LockOutlined,
  NotificationOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const Settings = () => {
  const { t } = useTranslation('pages');

  const settingsCategories = [
    {
      icon: <GlobalOutlined />,
      title: t('settings.general') || 'General Settings',
      description: t('settings.generalDescription') || 'Configure system-wide preferences',
      color: '#667eea',
      bgColor: '#dbeafe',
    },
    {
      icon: <UserOutlined />,
      title: t('settings.userManagement') || 'User Management',
      description: t('settings.userManagementDescription') || 'Manage roles and permissions',
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      icon: <CreditCardOutlined />,
      title: t('settings.billing') || 'Billing & Payments',
      description: t('settings.billingDescription') || 'Configure payment methods and invoices',
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      icon: <LockOutlined />,
      title: t('settings.security') || 'Security Settings',
      description: t('settings.securityDescription') || 'Manage authentication and security',
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
            <LockOutlined className='text-xl' />
          </div>
          <div className='flex-1'>
            <Title level={2} className='mb-1 text-slate-800 !tracking-tight !font-bold'>
              {t('settings.title')}
            </Title>
            <Text className='text-slate-600 font-medium text-base'>
              {t('settings.subtitle')}
            </Text>
          </div>
        </div>
      </div>

      {/* Settings Categories */}
      <Card 
        title={
          <div className='flex items-center gap-2'>
            <span className='text-lg font-semibold text-slate-800'>
              {t('settings.categories')}
            </span>
          </div>
        }
        className='border-0 shadow-lg rounded-xl overflow-hidden'
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        }}
      >
        <Row gutter={[24, 24]}>
          {settingsCategories.map((category, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <div 
                className='group cursor-pointer p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden'
                style={{
                  backgroundColor: 'white',
                }}
              >
                <div 
                  className='absolute inset-0 opacity-0 group-hover:opacity-[0.02]'
                  style={{ backgroundColor: category.color }}
                />
                
                <div className='relative z-10 flex flex-col items-center space-y-3 h-full'>
                  <div 
                    className='w-16 h-16 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-all duration-300'
                    style={{ 
                      backgroundColor: category.bgColor,
                    }}
                  >
                    <div className='text-2xl' style={{ color: category.color }}>
                      {category.icon}
                    </div>
                  </div>
                  
                  <div className='text-center'>
                    <h3 className='text-lg font-semibold text-slate-800 mb-1'>
                      {category.title}
                    </h3>
                    <p className='text-sm text-slate-600'>
                      {category.description}
                    </p>
                  </div>
                  
                  <div className='mt-auto'>
                    <Button 
                      type='primary'
                      className='w-full h-10 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300'
                      style={{
                        backgroundColor: category.color,
                        border: 'none',
                      }}
                    >
                      {t('settings.configure')}
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Detailed Settings */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* General Settings Card */}
        <Card 
          title={
            <div className='flex items-center gap-2'>
              <span className='text-lg font-semibold text-slate-800'>
                {t('settings.general')}
              </span>
            </div>
          }
          className='border-0 shadow-lg rounded-xl overflow-hidden'
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          }}
        >
          <div className='space-y-6'>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <label className='text-sm font-medium text-slate-700 min-w-[120px]'>
                  {t('settings.systemName')}
                </label>
                <div className='flex-1'>
                  <input 
                    type='text' 
                    defaultValue='Clinic Management System'
                    className='w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200'
                    placeholder='Enter system name'
                  />
                </div>
              </div>
              
              <div className='flex items-center gap-3'>
                <label className='text-sm font-medium text-slate-700 min-w-[120px]'>
                  {t('settings.timezone')}
                </label>
                <div className='flex-1'>
                  <select className='w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200'>
                    <option value='UTC'>UTC (Coordinated Universal Time)</option>
                    <option value='America/New_York'>America/New York (EDT)</option>
                    <option value='America/Los_Angeles'>America/Los Angeles (PDT)</option>
                  </select>
                </div>
              </div>
              
              <div className='flex items-center gap-3'>
                <label className='text-sm font-medium text-slate-700 min-w-[120px]'>
                  {t('settings.language')}
                </label>
                <div className='flex-1'>
                  <select className='w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200'>
                    <option value='en'>English</option>
                    <option value='es'>Spanish</option>
                    <option value='fr'>French</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className='pt-4 border-t border-slate-200'>
              <Button 
                type='primary' 
                className='h-10 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300'
                style={{
                  backgroundColor: '#667eea',
                  border: 'none',
                }}
              >
                Save General Settings
              </Button>
            </div>
          </div>
        </Card>

        {/* Security Settings Card */}
        <Card 
          title={
            <div className='flex items-center gap-2'>
              <span className='text-lg font-semibold text-slate-800'>
                {t('settings.security')}
              </span>
            </div>
          }
          className='border-0 shadow-lg rounded-xl overflow-hidden'
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          }}
        >
          <div className='space-y-6'>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <label className='text-sm font-medium text-slate-700 min-w-[120px]'>
                  {t('settings.twoFactor')}
                </label>
                <Switch 
                  defaultChecked 
                  className='mr-2'
                  style={{
                    backgroundColor: '#10b981',
                    opacity: 0.6,
                  }}
                />
                <span className='text-sm text-slate-600'>Enable 2FA for all users</span>
              </div>
              
              <div className='flex items-center gap-3'>
                <label className='text-sm font-medium text-slate-700 min-w-[120px]'>
                  {t('settings.sessionTimeout')}
                </label>
                <div className='flex-1'>
                  <select className='w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200'>
                    <option value='15'>15 minutes</option>
                    <option value='30'>30 minutes</option>
                    <option value='60'>1 hour</option>
                    <option value='120'>2 hours</option>
                    <option value='0'>Never expire</option>
                  </select>
                </div>
              </div>
              
              <div className='flex items-center gap-3'>
                <label className='text-sm font-medium text-slate-700 min-w-[120px]'>
                  {t('settings.passwordPolicy')}
                </label>
                <div className='flex-1'>
                  <select className='w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200'>
                    <option value='strict'>Strict (12+ characters)</option>
                    <option value='medium'>Medium (8+ characters)</option>
                    <option value='lenient'>Lenient (6+ characters)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className='pt-4 border-t border-slate-200'>
              <Button 
                type='primary' 
                className='h-10 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300'
                style={{
                  backgroundColor: '#667eea',
                  border: 'none',
                }}
              >
                Save Security Settings
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Notification Settings */}
      <Card 
        title={
          <div className='flex items-center gap-2'>
            <span className='text-lg font-semibold text-slate-800'>
              {t('settings.notifications')}
            </span>
          </div>
        }
        className='border-0 shadow-lg rounded-xl overflow-hidden'
      >
        <div className='space-y-6 p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <label className='text-sm font-medium text-slate-700 min-w-[140px]'>
                  {t('settings.emailNotifications')}
                </label>
                <Switch defaultChecked className='mr-2' />
                <span className='text-sm text-slate-600'>Send email confirmations</span>
              </div>
              
              <div className='flex items-center gap-3'>
                <label className='text-sm font-medium text-slate-700 min-w-[140px]'>
                  {t('settings.smsNotifications')}
                </label>
                <Switch className='mr-2' />
                <span className='text-sm text-slate-600'>Send SMS reminders</span>
              </div>
              
              <div className='flex items-center gap-3'>
                <label className='text-sm font-medium text-slate-700 min-w-[140px]'>
                  {t('settings.pushNotifications')}
                </label>
                <Switch defaultChecked className='mr-2' />
                <span className='text-sm text-slate-600'>Enable push notifications</span>
              </div>
            </div>
            
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <label className='text-sm font-medium text-slate-700 min-w-[140px]'>
                  {t('settings.appointmentReminders')}
                </label>
                <Switch defaultChecked className='mr-2' />
                <span className='text-sm text-slate-600'>24 hours before appointment</span>
              </div>
              
              <div className='flex items-center gap-3'>
                <label className='text-sm font-medium text-slate-700 min-w-[140px]'>
                  {t('settings.caseUpdates')}
                </label>
                <Switch className='mr-2' />
                <span className='text-sm text-slate-600'>Notify on case status changes</span>
              </div>
              
              <div className='flex items-center gap-3'>
                <label className='text-sm font-medium text-slate-700 min-w-[140px]'>
                  {t('settings.marketingEmails')}
                </label>
                <Switch className='mr-2' />
                <span className='text-sm text-slate-600'>Send promotional content</span>
              </div>
            </div>
          </div>
          
          <div className='pt-4 border-t border-slate-200 flex justify-end'>
            <Button 
              type='primary' 
              className='h-10 px-6 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300'
              style={{
                backgroundColor: '#667eea',
                border: 'none',
              }}
            >
              Save Notification Settings
            </Button>
          </div>
        </div>
      </Card>

      {/* Integration Settings */}
      <Card 
        title={
          <div className='flex items-center gap-2'>
            <span className='text-lg font-semibold text-slate-800'>
              {t('settings.integrations')}
            </span>
          </div>
        }
        className='border-0 shadow-lg rounded-xl overflow-hidden'
      >
        <div className='space-y-6 p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h4 className='font-medium text-slate-700 mb-3'>{t('settings.paymentGateways')}</h4>
              <div className='space-y-3'>
                <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200'>
                  <CreditCardOutlined className='text-green-500' />
                  <div>
                    <div className='font-medium text-sm text-slate-800'>Stripe</div>
                    <div className='text-xs text-slate-500'>Primary payment processor</div>
                  </div>
                  <Switch defaultChecked className='ml-auto' />
                </div>
                
                <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200'>
                  <CreditCardOutlined className='text-blue-500' />
                  <div>
                    <div className='font-medium text-sm text-slate-800'>PayPal</div>
                    <div className='text-xs text-slate-500'>Alternative payment method</div>
                  </div>
                  <Switch className='ml-auto' />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className='font-medium text-slate-700 mb-3'>{t('settings.apiIntegrations')}</h4>
              <div className='space-y-3'>
                <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200'>
                  <GlobalOutlined className='text-purple-500' />
                  <div>
                    <div className='font-medium text-sm text-slate-800'>Google Calendar</div>
                    <div className='text-xs text-slate-500'>Sync appointments</div>
                  </div>
                  <Switch defaultChecked className='ml-auto' />
                </div>
                
                <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200'>
                  <NotificationOutlined className='text-orange-500' />
                  <div>
                    <div className='font-medium text-sm text-slate-800'>Twilio SMS</div>
                    <div className='text-xs text-slate-500'>Send SMS notifications</div>
                  </div>
                  <Switch className='ml-auto' />
                </div>
              </div>
            </div>
          </div>
          
          <div className='pt-4 border-t border-slate-200 flex justify-end'>
            <Button 
              type='primary' 
              className='h-10 px-6 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300'
              style={{
                backgroundColor: '#667eea',
                border: 'none',
              }}
            >
              Save Integration Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;

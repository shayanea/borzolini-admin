import { Card, Col, Row, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  GlobalOutlined,
  UserOutlined,
  CreditCardOutlined,
  LockOutlined,
} from '@ant-design/icons';

interface SettingsCategory {
  icon: JSX.Element;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const SettingsCategories = () => {
  const { t } = useTranslation('pages');

  const settingsCategories: SettingsCategory[] = [
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
    <Card
      title={
        <div className='flex items-center gap-2'>
          <span className='text-lg font-semibold text-slate-800'>{t('settings.categories')}</span>
        </div>
      }
      className='border-0 shadow-lg rounded-xl overflow-hidden'
      style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}
    >
      <Row gutter={[24, 24]}>
        {settingsCategories.map((category, index) => (
          <Col xs={24} sm={12} lg={6} key={index} className='h-full'>
            <div
              className='group cursor-pointer p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden h-full min-h-[260px]'
              style={{ backgroundColor: 'white' }}
            >
              <div
                className='absolute inset-0 opacity-0 group-hover:opacity-[0.02]'
                style={{ backgroundColor: category.color }}
              />

              <div className='relative z-10 flex flex-col items-center space-y-3 h-full'>
                <div
                  className='w-16 h-16 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-all duration-300'
                  style={{ backgroundColor: category.bgColor }}
                >
                  <div className='text-2xl' style={{ color: category.color }}>
                    {category.icon}
                  </div>
                </div>

                <div className='text-center'>
                  <h3 className='text-lg font-semibold text-slate-800 mb-1'>{category.title}</h3>
                  <p className='text-sm text-slate-600'>{category.description}</p>
                </div>

                <div className='mt-auto'>
                  <Button
                    type='primary'
                    className='w-full h-10 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300'
                    style={{ backgroundColor: category.color, border: 'none' }}
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
  );
};

export default SettingsCategories;

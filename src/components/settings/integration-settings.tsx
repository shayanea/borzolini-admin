import { Card, Switch } from 'antd';
import {
  CreditCardOutlined,
  GlobalOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const IntegrationSettings = () => {
  const { t } = useTranslation('pages');

  return (
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
      </div>
    </Card>
  );
};

export { IntegrationSettings };
export default IntegrationSettings;

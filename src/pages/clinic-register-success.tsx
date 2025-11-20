import { CheckCircleOutlined, HomeOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Result, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants';

const { Text } = Typography;

const ClinicRegisterSuccess = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleRegisterAnother = () => {
    navigate(ROUTES.CLINIC_REGISTER);
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-2xl mx-auto px-4'>
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title='Clinic Registration Submitted Successfully!'
          subTitle={
            <div className='space-y-4'>
              <Text type='secondary' className='text-lg'>
                Thank you for registering your clinic with us. Your application has been received
                and is now under review.
              </Text>
              <Card className='text-left'>
                <div className='space-y-3'>
                  <div className='flex items-center space-x-2'>
                    <MailOutlined className='text-blue-500' />
                    <Text strong>What happens next?</Text>
                  </div>
                  <ul className='list-disc list-inside space-y-2 text-gray-600'>
                    <li>Our team will review your clinic information within 1-2 business days</li>
                    <li>We may contact you for additional information or clarification</li>
                    <li>Once approved, your clinic will be published on our platform</li>
                    <li>
                      You will receive an email notification with your clinic dashboard access
                    </li>
                  </ul>
                </div>
              </Card>
              <Card className='text-left'>
                <div className='space-y-3'>
                  <div className='flex items-center space-x-2'>
                    <CheckCircleOutlined className='text-green-500' />
                    <Text strong>Registration Details</Text>
                  </div>
                  <div className='space-y-2 text-gray-600'>
                    <div>• Registration ID: #{Date.now().toString().slice(-8)}</div>
                    <div>• Submitted: {new Date().toLocaleDateString()}</div>
                    <div>• Status: Under Review</div>
                  </div>
                </div>
              </Card>
            </div>
          }
          extra={
            <Space size='middle'>
              <Button
                type='primary'
                icon={<HomeOutlined />}
                onClick={handleGoHome}
                className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
              >
                Go to Home
              </Button>
              <Button onClick={handleRegisterAnother}>Register Another Clinic</Button>
            </Space>
          }
        />
      </div>
    </div>
  );
};

export { ClinicRegisterSuccess };
export default ClinicRegisterSuccess;

import { ClockCircleOutlined } from '@ant-design/icons';
import { Alert, Col, Form, Input, Row, Switch, Typography } from 'antd';

import { DAYS_OF_WEEK } from './constants';

const { Title, Text } = Typography;

export function OperatingHoursStep() {
  return (
    <div className='space-y-8'>
      {/* Section Header */}
      <div className='border-l-4 border-indigo-500 pl-4'>
        <Title level={3} className='!mb-1'>
          Operating Hours
        </Title>
        <Text type='secondary'>
          Set your clinic's business hours so pet owners know when you're available. You can
          customize hours for each day or mark days as closed.
        </Text>
      </div>

      <Alert
        message='Clear hours improve booking success'
        description='Accurate operating hours help pet owners schedule appointments at convenient times and reduce confusion.'
        type='info'
        showIcon
        icon={<ClockCircleOutlined />}
        className='rounded-lg'
      />

      {/* Operating Hours */}
      <div className='space-y-4'>
        {DAYS_OF_WEEK.map(day => {
          const isWeekend = day.key === 'saturday' || day.key === 'sunday';
          const gradientClass = isWeekend 
            ? 'from-orange-50 to-amber-50 border-orange-100' 
            : 'from-indigo-50 to-blue-50 border-indigo-100';
          
          return (
            <div
              key={day.key}
              className={`bg-gradient-to-r ${gradientClass} border rounded-xl p-5 transition-all hover:shadow-md`}
            >
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isWeekend ? 'bg-orange-200 text-orange-700' : 'bg-indigo-200 text-indigo-700'
                  } font-semibold`}
                  >
                    {day.label.substring(0, 2)}
                  </div>
                  <div>
                    <Title level={5} className='!mb-0'>
                      {day.label}
                    </Title>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) =>
                        prevValues.operating_hours?.[day.key]?.closed !==
                        currentValues.operating_hours?.[day.key]?.closed
                      }
                    >
                      {({ getFieldValue }) => {
                        const isClosed = getFieldValue(['operating_hours', day.key, 'closed']);
                        return (
                          <Text type='secondary' className='text-sm'>
                            {isClosed ? 'Closed' : 'Open for business'}
                          </Text>
                        );
                      }}
                    </Form.Item>
                  </div>
                </div>
                <Form.Item
                  name={['operating_hours', day.key, 'closed']}
                  valuePropName='checked'
                  getValueFromEvent={(checked: boolean) => !checked}
                  getValueProps={(value: boolean) => ({ checked: !value })}
                  className='!mb-0'
                >
                  <Switch
                    checkedChildren='Open'
                    unCheckedChildren='Closed'
                    size='default'
                    className={isWeekend ? 'bg-orange-400' : ''}
                  />
                </Form.Item>
              </div>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.operating_hours?.[day.key]?.closed !==
                  currentValues.operating_hours?.[day.key]?.closed
                }
              >
                {({ getFieldValue }) => {
                  const isClosed = getFieldValue(['operating_hours', day.key, 'closed']);
                  if (isClosed) {
                    return (
                      <div className='text-center py-4 text-gray-400'>
                        <Text type='secondary'>This day is marked as closed</Text>
                      </div>
                    );
                  }
                  return (
                    <Row gutter={16} className='mt-4'>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={['operating_hours', day.key, 'open']}
                          label={
                            <span className='text-base font-medium flex items-center gap-2'>
                              <ClockCircleOutlined className={isWeekend ? 'text-orange-500' : 'text-indigo-500'} />
                              Opening Time
                            </span>
                          }
                          rules={[{ required: true, message: 'Please enter opening time' }]}
                        >
                          <Input type='time' size='large' className='rounded-lg' />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={['operating_hours', day.key, 'close']}
                          label={
                            <span className='text-base font-medium flex items-center gap-2'>
                              <ClockCircleOutlined className={isWeekend ? 'text-orange-500' : 'text-indigo-500'} />
                              Closing Time
                            </span>
                          }
                          rules={[{ required: true, message: 'Please enter closing time' }]}
                        >
                          <Input type='time' size='large' className='rounded-lg' />
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                }}
              </Form.Item>
            </div>
          );
        })}
      </div>

      <div className='text-center text-gray-500 text-sm bg-gray-50 rounded-lg p-4'>
        <Text type='secondary'>
          Tip: Consider adding flexible hours for emergencies or special appointments outside
          regular business hours
        </Text>
      </div>
    </div>
  );
}

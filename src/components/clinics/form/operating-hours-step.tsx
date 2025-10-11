import { Card, Col, Form, Input, Row, Switch, Typography } from 'antd';
import { FC } from 'react';

const { Title } = Typography;

interface DayOfWeek {
  key: string;
  label: string;
}

interface OperatingHoursStepProps {
  daysOfWeek: DayOfWeek[];
}

const OperatingHoursStep: FC<OperatingHoursStepProps> = ({ daysOfWeek }) => {
  return (
    <Card title='Operating Hours' className='mb-6'>
      <div className='space-y-4'>
        {daysOfWeek.map(day => (
          <div key={day.key} className='border rounded-lg p-4'>
            <div className='flex items-center justify-between mb-4'>
              <Title level={5} className='!mb-0'>
                {day.label}
              </Title>
              <Form.Item
                name={['operating_hours', day.key, 'closed']}
                valuePropName='checked'
                className='!mb-0'
              >
                <Switch checkedChildren='Closed' unCheckedChildren='Open' />
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
                  return null;
                }
                return (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name={['operating_hours', day.key, 'open']}
                        label='Opening Time'
                        rules={[{ required: true, message: 'Please enter opening time' }]}
                      >
                        <Input type='time' />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={['operating_hours', day.key, 'close']}
                        label='Closing Time'
                        rules={[{ required: true, message: 'Please enter closing time' }]}
                      >
                        <Input type='time' />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }}
            </Form.Item>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OperatingHoursStep;

import { Col, Form, Input, Row, Switch, Typography } from 'antd';
import { FC, useMemo } from 'react';

const { Title } = Typography;

export interface DayOfWeek {
  key: string;
  label: string;
  apiIndex?: number;
}

export interface OperatingHoursFieldsProps {
  /**
   * Days of the week to display
   */
  daysOfWeek: DayOfWeek[];
  
  /**
   * Base name for form fields. If provided, fields will be named as [namePrefix].operating_hours.[day].open, etc.
   * If not provided, fields will be named as operating_hours.[day].open, etc.
   */
  namePrefix?: string;
}

/**
 * Helper function to create field name with optional prefix
 */
const createFieldName = (namePrefix: string | undefined, names: string[]): string[] => {
  if (namePrefix) {
    return [namePrefix, ...names];
  }
  return names;
};

/**
 * Component for time inputs (open/close)
 */
const TimeInputs: FC<{
  day: DayOfWeek;
  namePrefix?: string;
}> = ({ day, namePrefix }) => {
  const fieldName = useMemo(
    () => (names: string[]) => createFieldName(namePrefix, names),
    [namePrefix]
  );
  
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name={fieldName(['operating_hours', day.key, 'open'])}
          label='Opening Time'
          rules={[{ required: true, message: 'Please enter opening time' }]}
        >
          <Input type='time' />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name={fieldName(['operating_hours', day.key, 'close'])}
          label='Closing Time'
          rules={[{ required: true, message: 'Please enter closing time' }]}
        >
          <Input type='time' />
        </Form.Item>
      </Col>
    </Row>
  );
};

/**
 * Component for the day header with closed toggle
 */
const DayHeader: FC<{
  day: DayOfWeek;
  namePrefix?: string;
}> = ({ day, namePrefix }) => {
  const fieldName = useMemo(
    () => (names: string[]) => createFieldName(namePrefix, names),
    [namePrefix]
  );
  
  return (
    <div className='flex items-center justify-between mb-4'>
      <Title level={5} className='!mb-0'>
        {day.label}
      </Title>
      <Form.Item
        name={fieldName(['operating_hours', day.key, 'closed'])}
        valuePropName='checked'
        className='!mb-0'
      >
        <Switch checkedChildren='Closed' unCheckedChildren='Open' />
      </Form.Item>
    </div>
  );
};

/**
 * Component for a single day's operating hours
 */
const DayOperatingHours: FC<{
  day: DayOfWeek;
  namePrefix?: string;
}> = ({ day, namePrefix }) => {
  // Helper function to check if closed field changed
  const shouldUpdateTimeInputs = (prevValues: any, currentValues: any) => {
    const prevPath = namePrefix
      ? `${namePrefix}.operating_hours.${day.key}.closed`
      : `operating_hours.${day.key}.closed`;
      
    const currentPath = namePrefix
      ? `${namePrefix}.operating_hours.${day.key}.closed`
      : `operating_hours.${day.key}.closed`;
      
    // Get nested value using path
    const getProp = (obj: any, path: string) => {
      return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : undefined;
      }, obj);
    };
    
    return getProp(prevValues, prevPath) !== getProp(currentValues, currentPath);
  };

  // Helper function to get closed field value
  const renderTimeInputs = (formInstance: any) => {
    const fieldPath = namePrefix
      ? [namePrefix, 'operating_hours', day.key, 'closed']
      : ['operating_hours', day.key, 'closed'];
    
    const isClosed = formInstance.getFieldValue(fieldPath);
    
    return isClosed ? null : <TimeInputs day={day} namePrefix={namePrefix} />;
  };

  return (
    <div className='border rounded-lg p-4'>
      <DayHeader day={day} namePrefix={namePrefix} />
      
      <Form.Item
        noStyle
        shouldUpdate={shouldUpdateTimeInputs}
      >
        {renderTimeInputs}
      </Form.Item>
    </div>
  );
};

/**
 * Component for all operating hours fields
 */
const OperatingHoursFields: FC<OperatingHoursFieldsProps> = ({ daysOfWeek, namePrefix }) => {
  return (
    <div className='space-y-4'>
      {daysOfWeek.map(day => (
        <DayOperatingHours key={day.key} day={day} namePrefix={namePrefix} />
      ))}
    </div>
  );
};

export { OperatingHoursFields };
export default OperatingHoursFields;
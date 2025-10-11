import { Form, Input, Switch } from 'antd';
import { FC } from 'react';

import { VisitTypeSectionProps } from './types';

const { TextArea } = Input;

export const VisitTypeSection: FC<VisitTypeSectionProps> = ({
  form,
  isTelemedicine,
  setIsTelemedicine,
  isHomeVisit,
  setIsHomeVisit,
}) => {
  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-4'>
        <Form.Item label='Telemedicine' className='mb-0'>
          <Switch
            checked={isTelemedicine}
            onChange={setIsTelemedicine}
            checkedChildren='Yes'
            unCheckedChildren='No'
          />
        </Form.Item>

        <Form.Item label='Home Visit' className='mb-0'>
          <Switch
            checked={isHomeVisit}
            onChange={setIsHomeVisit}
            checkedChildren='Yes'
            unCheckedChildren='No'
          />
        </Form.Item>
      </div>

      {isTelemedicine && (
        <Form.Item
          label='Telemedicine Link'
          name='telemedicine_link'
          rules={[{ required: true, message: 'Please provide telemedicine link' }]}
        >
          <Input placeholder='https://meet.google.com/...' />
        </Form.Item>
      )}

      {isHomeVisit && (
        <Form.Item
          label='Home Visit Address'
          name='home_visit_address'
          rules={[{ required: true, message: 'Please provide home visit address' }]}
        >
          <TextArea rows={2} placeholder='Enter full address for home visit' />
        </Form.Item>
      )}
    </div>
  );
};

export default VisitTypeSection;

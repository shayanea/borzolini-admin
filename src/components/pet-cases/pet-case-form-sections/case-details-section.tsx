import { Form, Input } from 'antd';
import { FC } from 'react';

import { CaseDetailsSectionProps } from './types';

const { TextArea } = Input;

export const CaseDetailsSection: FC<CaseDetailsSectionProps> = () => {
  return (
    <>
      <Form.Item
        label='Description'
        name='description'
        rules={[{ required: true, message: 'Please enter a case description' }]}
      >
        <TextArea rows={4} placeholder='Detailed description of the case and symptoms' />
      </Form.Item>

      <Form.Item
        label='Initial Symptoms (one per line)'
        name='initial_symptoms'
        help='Enter each symptom on a new line'
      >
        <TextArea
          rows={4}
          placeholder='Coughing&#10;Lethargy&#10;Loss of appetite'
        />
      </Form.Item>

      <Form.Item label='Additional Notes' name='notes'>
        <TextArea rows={3} placeholder='Any additional notes or observations' />
      </Form.Item>
    </>
  );
};

export default CaseDetailsSection;

import { Card, Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

const MediaBrandingStep: FC = () => {
  return (
    <Card title='Media & Branding' className='mb-6'>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='logo_url'
            label='Logo URL'
            rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
          >
            <Input placeholder='Enter logo URL (optional)' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='banner_url'
            label='Banner URL'
            rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
          >
            <Input placeholder='Enter banner URL (optional)' />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export { MediaBrandingStep };
export default MediaBrandingStep;

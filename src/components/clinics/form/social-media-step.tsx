import { Card, Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

const SocialMediaStep: FC = () => {
  return (
    <Card title='Social Media' className='mb-6'>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='facebook_url'
            label='Facebook URL'
            rules={[
              { type: 'url', message: 'Please enter a valid URL' },
              {
                pattern: /^https?:\/\/(www\.)?facebook\.com\/.+/,
                message: 'Please enter a valid Facebook URL',
              },
            ]}
          >
            <Input placeholder='https://facebook.com/yourclinic' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='twitter_url'
            label='Twitter URL'
            rules={[
              { type: 'url', message: 'Please enter a valid URL' },
              {
                pattern: /^https?:\/\/(www\.)?twitter\.com\/.+/,
                message: 'Please enter a valid Twitter URL',
              },
            ]}
          >
            <Input placeholder='https://twitter.com/yourclinic' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='instagram_url'
            label='Instagram URL'
            rules={[
              { type: 'url', message: 'Please enter a valid URL' },
              {
                pattern: /^https?:\/\/(www\.)?instagram\.com\/.+/,
                message: 'Please enter a valid Instagram URL',
              },
            ]}
          >
            <Input placeholder='https://instagram.com/yourclinic' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='linkedin_url'
            label='LinkedIn URL'
            rules={[
              { type: 'url', message: 'Please enter a valid URL' },
              {
                pattern: /^https?:\/\/(www\.)?linkedin\.com\/.+/,
                message: 'Please enter a valid LinkedIn URL',
              },
            ]}
          >
            <Input placeholder='https://linkedin.com/company/yourclinic' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='youtube_url'
            label='YouTube URL'
            rules={[
              { type: 'url', message: 'Please enter a valid URL' },
              {
                pattern: /^https?:\/\/(www\.)?youtube\.com\/.+/,
                message: 'Please enter a valid YouTube URL',
              },
            ]}
          >
            <Input placeholder='https://youtube.com/c/yourclinic' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='tiktok_url'
            label='TikTok URL'
            rules={[
              { type: 'url', message: 'Please enter a valid URL' },
              {
                pattern: /^https?:\/\/(www\.)?tiktok\.com\/.+/,
                message: 'Please enter a valid TikTok URL',
              },
            ]}
          >
            <Input placeholder='https://tiktok.com/@yourclinic' />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default SocialMediaStep;

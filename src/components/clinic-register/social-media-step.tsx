import {
    FacebookOutlined,
    InstagramOutlined,
    LinkedinOutlined,
    ShareAltOutlined,
    TwitterOutlined,
    YoutubeOutlined,
} from '@ant-design/icons';
import { Alert, Col, Form, Input, Row, Typography } from 'antd';

const { Text, Title } = Typography;

export function SocialMediaStep() {
  return (
    <div className='space-y-8'>
      {/* Section Header */}
      <div className='border-l-4 border-indigo-500 pl-4'>
        <Title level={3} className='!mb-1'>
          Social Media Profiles
        </Title>
        <Text type='secondary'>
          Connect your social media accounts to build trust and help pet owners learn more about
          your clinic. All fields are optional.
        </Text>
      </div>

      <Alert
        message='Boost Your Online Presence'
        description='Adding your social media profiles helps pet owners connect with your clinic, see reviews, and stay updated with your latest news and services.'
        type='info'
        showIcon
        icon={<ShareAltOutlined />}
        className='rounded-lg'
      />

      {/* Social Media Links */}
      <div className='space-y-6'>
        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100'>
          <Title level={5} className='!mb-6'>Popular Platforms</Title>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name='facebook_url'
                label={
                  <span className='text-base font-medium flex items-center gap-2'>
                    <FacebookOutlined className='text-blue-600 text-lg' />
                    Facebook
                  </span>
                }
                rules={[
                  { type: 'url', message: 'Please enter a valid URL' },
                  {
                    pattern: /^https?:\/\/(www\.)?facebook\.com\/.+/,
                    message: 'Please enter a valid Facebook URL',
                  },
                ]}
              >
                <Input
                  placeholder='https://facebook.com/yourclinic'
                  size='large'
                  className='rounded-lg'
                  prefix={<FacebookOutlined className='text-gray-400' />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name='instagram_url'
                label={
                  <span className='text-base font-medium flex items-center gap-2'>
                    <InstagramOutlined className='text-pink-600 text-lg' />
                    Instagram
                  </span>
                }
                rules={[
                  { type: 'url', message: 'Please enter a valid URL' },
                  {
                    pattern: /^https?:\/\/(www\.)?instagram\.com\/.+/,
                    message: 'Please enter a valid Instagram URL',
                  },
                ]}
              >
                <Input
                  placeholder='https://instagram.com/yourclinic'
                  size='large'
                  className='rounded-lg'
                  prefix={<InstagramOutlined className='text-gray-400' />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name='twitter_url'
                label={
                  <span className='text-base font-medium flex items-center gap-2'>
                    <TwitterOutlined className='text-sky-500 text-lg' />
                    Twitter / X
                  </span>
                }
                rules={[
                  { type: 'url', message: 'Please enter a valid URL' },
                  {
                    pattern: /^https?:\/\/(www\.)?twitter\.com\/.+/,
                    message: 'Please enter a valid Twitter URL',
                  },
                ]}
              >
                <Input
                  placeholder='https://twitter.com/yourclinic'
                  size='large'
                  className='rounded-lg'
                  prefix={<TwitterOutlined className='text-gray-400' />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name='linkedin_url'
                label={
                  <span className='text-base font-medium flex items-center gap-2'>
                    <LinkedinOutlined className='text-blue-700 text-lg' />
                    LinkedIn
                  </span>
                }
                rules={[
                  { type: 'url', message: 'Please enter a valid URL' },
                  {
                    pattern: /^https?:\/\/(www\.)?linkedin\.com\/.+/,
                    message: 'Please enter a valid LinkedIn URL',
                  },
                ]}
              >
                <Input
                  placeholder='https://linkedin.com/company/yourclinic'
                  size='large'
                  className='rounded-lg'
                  prefix={<LinkedinOutlined className='text-gray-400' />}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100'>
          <Title level={5} className='!mb-6'>Video & Content Platforms</Title>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name='youtube_url'
                label={
                  <span className='text-base font-medium flex items-center gap-2'>
                    <YoutubeOutlined className='text-red-600 text-lg' />
                    YouTube
                  </span>
                }
                rules={[
                  { type: 'url', message: 'Please enter a valid URL' },
                  {
                    pattern: /^https?:\/\/(www\.)?youtube\.com\/.+/,
                    message: 'Please enter a valid YouTube URL',
                  },
                ]}
              >
                <Input
                  placeholder='https://youtube.com/c/yourclinic'
                  size='large'
                  className='rounded-lg'
                  prefix={<YoutubeOutlined className='text-gray-400' />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name='tiktok_url'
                label={
                  <span className='text-base font-medium flex items-center gap-2'>
                    <svg viewBox='0 0 24 24' className='w-4 h-4' fill='currentColor'>
                      <path d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z' />
                    </svg>
                    TikTok
                  </span>
                }
                rules={[
                  { type: 'url', message: 'Please enter a valid URL' },
                  {
                    pattern: /^https?:\/\/(www\.)?tiktok\.com\/.+/,
                    message: 'Please enter a valid TikTok URL',
                  },
                ]}
              >
                <Input
                  placeholder='https://tiktok.com/@yourclinic'
                  size='large'
                  className='rounded-lg'
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className='text-center text-gray-500 text-sm'>
          <Text type='secondary'>
            Tip: Active social media presence helps build trust and attract more pet owners to
            your clinic
          </Text>
        </div>
      </div>
    </div>
  );
}

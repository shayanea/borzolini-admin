import { Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

import {
  SOCIAL_MEDIA_ERROR_MESSAGES,
  SOCIAL_MEDIA_FIELDS,
  SOCIAL_MEDIA_LABELS,
  SOCIAL_MEDIA_PLACEHOLDERS,
  SOCIAL_MEDIA_URL_PATTERNS,
} from '@/constants/social-media';

export interface SocialMediaFieldsProps {
  /**
   * Base name for form fields. If provided, fields will be named as [namePrefix].facebook_url, etc.
   * If not provided, fields will be named as facebook_url, twitter_url, etc.
   */
  namePrefix?: string;
}

const SocialMediaFields: FC<SocialMediaFieldsProps> = ({ namePrefix }) => {
  // Helper function to create field name with optional prefix
  const fieldName = (name: string): string | string[] => {
    if (namePrefix) {
      return [namePrefix, name];
    }
    return name;
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name={fieldName(SOCIAL_MEDIA_FIELDS.FACEBOOK)}
            label={SOCIAL_MEDIA_LABELS.FACEBOOK}
            rules={[
              { type: 'url', message: SOCIAL_MEDIA_ERROR_MESSAGES.URL },
              {
                pattern: SOCIAL_MEDIA_URL_PATTERNS.FACEBOOK,
                message: SOCIAL_MEDIA_ERROR_MESSAGES.FACEBOOK,
              },
            ]}
          >
            <Input placeholder={SOCIAL_MEDIA_PLACEHOLDERS.FACEBOOK} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={fieldName(SOCIAL_MEDIA_FIELDS.TWITTER)}
            label={SOCIAL_MEDIA_LABELS.TWITTER}
            rules={[
              { type: 'url', message: SOCIAL_MEDIA_ERROR_MESSAGES.URL },
              {
                pattern: SOCIAL_MEDIA_URL_PATTERNS.TWITTER,
                message: SOCIAL_MEDIA_ERROR_MESSAGES.TWITTER,
              },
            ]}
          >
            <Input placeholder={SOCIAL_MEDIA_PLACEHOLDERS.TWITTER} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name={fieldName(SOCIAL_MEDIA_FIELDS.INSTAGRAM)}
            label={SOCIAL_MEDIA_LABELS.INSTAGRAM}
            rules={[
              { type: 'url', message: SOCIAL_MEDIA_ERROR_MESSAGES.URL },
              {
                pattern: SOCIAL_MEDIA_URL_PATTERNS.INSTAGRAM,
                message: SOCIAL_MEDIA_ERROR_MESSAGES.INSTAGRAM,
              },
            ]}
          >
            <Input placeholder={SOCIAL_MEDIA_PLACEHOLDERS.INSTAGRAM} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={fieldName(SOCIAL_MEDIA_FIELDS.LINKEDIN)}
            label={SOCIAL_MEDIA_LABELS.LINKEDIN}
            rules={[
              { type: 'url', message: SOCIAL_MEDIA_ERROR_MESSAGES.URL },
              {
                pattern: SOCIAL_MEDIA_URL_PATTERNS.LINKEDIN,
                message: SOCIAL_MEDIA_ERROR_MESSAGES.LINKEDIN,
              },
            ]}
          >
            <Input placeholder={SOCIAL_MEDIA_PLACEHOLDERS.LINKEDIN} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name={fieldName(SOCIAL_MEDIA_FIELDS.YOUTUBE)}
            label={SOCIAL_MEDIA_LABELS.YOUTUBE}
            rules={[
              { type: 'url', message: SOCIAL_MEDIA_ERROR_MESSAGES.URL },
              {
                pattern: SOCIAL_MEDIA_URL_PATTERNS.YOUTUBE,
                message: SOCIAL_MEDIA_ERROR_MESSAGES.YOUTUBE,
              },
            ]}
          >
            <Input placeholder={SOCIAL_MEDIA_PLACEHOLDERS.YOUTUBE} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={fieldName(SOCIAL_MEDIA_FIELDS.TIKTOK)}
            label={SOCIAL_MEDIA_LABELS.TIKTOK}
            rules={[
              { type: 'url', message: SOCIAL_MEDIA_ERROR_MESSAGES.URL },
              {
                pattern: SOCIAL_MEDIA_URL_PATTERNS.TIKTOK,
                message: SOCIAL_MEDIA_ERROR_MESSAGES.TIKTOK,
              },
            ]}
          >
            <Input placeholder={SOCIAL_MEDIA_PLACEHOLDERS.TIKTOK} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default SocialMediaFields;
/**
 * SocialMediaLinks Component
 * Renders social media icons with links
 */

import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TikTokOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import { Typography } from 'antd';
import { FC } from 'react';

const { Link } = Typography;

export interface SocialMediaLinksProps {
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  /**
   * Size of the icons - 'small' | 'medium' | 'large'
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Display style - 'horizontal' | 'vertical'
   * @default 'horizontal'
   */
  layout?: 'horizontal' | 'vertical';
  /**
   * Custom className for styling
   */
  className?: string;
}

const SocialMediaLinks: FC<SocialMediaLinksProps> = ({
  facebook_url,
  twitter_url,
  instagram_url,
  linkedin_url,
  youtube_url,
  tiktok_url,
  size = 'medium',
  layout = 'horizontal',
  className = '',
}) => {
  // Size mapping for icon font sizes
  const sizeMap = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl',
  };

  // Layout classes
  const layoutClass = layout === 'horizontal' ? 'flex flex-wrap gap-2' : 'flex flex-col gap-2';

  // Base icon class
  const iconClass = sizeMap[size];

  // Check if any social media URL is provided
  const hasSocialMedia =
    facebook_url || twitter_url || instagram_url || linkedin_url || youtube_url || tiktok_url;

  if (!hasSocialMedia) {
    return null;
  }

  return (
    <div className={`${layoutClass} ${className}`}>
      {facebook_url && (
        <Link href={facebook_url} target='_blank' rel='noopener noreferrer' title='Facebook'>
          <FacebookOutlined className={`${iconClass} text-blue-600 hover:text-blue-800`} />
        </Link>
      )}
      {twitter_url && (
        <Link href={twitter_url} target='_blank' rel='noopener noreferrer' title='Twitter'>
          <TwitterOutlined className={`${iconClass} text-blue-400 hover:text-blue-600`} />
        </Link>
      )}
      {instagram_url && (
        <Link href={instagram_url} target='_blank' rel='noopener noreferrer' title='Instagram'>
          <InstagramOutlined className={`${iconClass} text-pink-600 hover:text-pink-800`} />
        </Link>
      )}
      {linkedin_url && (
        <Link href={linkedin_url} target='_blank' rel='noopener noreferrer' title='LinkedIn'>
          <LinkedinOutlined className={`${iconClass} text-blue-700 hover:text-blue-900`} />
        </Link>
      )}
      {youtube_url && (
        <Link href={youtube_url} target='_blank' rel='noopener noreferrer' title='YouTube'>
          <YoutubeOutlined className={`${iconClass} text-red-600 hover:text-red-800`} />
        </Link>
      )}
      {tiktok_url && (
        <Link href={tiktok_url} target='_blank' rel='noopener noreferrer' title='TikTok'>
          <TikTokOutlined className={`${iconClass} text-black hover:text-gray-800`} />
        </Link>
      )}
    </div>
  );
};

export default SocialMediaLinks;


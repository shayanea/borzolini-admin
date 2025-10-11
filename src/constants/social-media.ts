/**
 * Constants related to social media functionality
 */

/**
 * Social media platform names
 */
export const SOCIAL_MEDIA_PLATFORMS = {
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  INSTAGRAM: 'instagram',
  LINKEDIN: 'linkedin',
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
};

/**
 * Social media field names
 */
export const SOCIAL_MEDIA_FIELDS = {
  FACEBOOK: 'facebook_url',
  TWITTER: 'twitter_url',
  INSTAGRAM: 'instagram_url',
  LINKEDIN: 'linkedin_url',
  YOUTUBE: 'youtube_url',
  TIKTOK: 'tiktok_url',
};

/**
 * Social media field labels
 */
export const SOCIAL_MEDIA_LABELS = {
  FACEBOOK: 'Facebook URL',
  TWITTER: 'Twitter URL',
  INSTAGRAM: 'Instagram URL',
  LINKEDIN: 'LinkedIn URL',
  YOUTUBE: 'YouTube URL',
  TIKTOK: 'TikTok URL',
};

/**
 * Social media URL validation patterns
 */
export const SOCIAL_MEDIA_URL_PATTERNS = {
  FACEBOOK: /^https?:\/\/(www\.)?facebook\.com\/.+/,
  TWITTER: /^https?:\/\/(www\.)?twitter\.com\/.+/,
  INSTAGRAM: /^https?:\/\/(www\.)?instagram\.com\/.+/,
  LINKEDIN: /^https?:\/\/(www\.)?linkedin\.com\/.+/,
  YOUTUBE: /^https?:\/\/(www\.)?youtube\.com\/.+/,
  TIKTOK: /^https?:\/\/(www\.)?tiktok\.com\/.+/,
};

/**
 * Social media URL placeholders
 */
export const SOCIAL_MEDIA_PLACEHOLDERS = {
  FACEBOOK: 'https://facebook.com/yourclinic',
  TWITTER: 'https://twitter.com/yourclinic',
  INSTAGRAM: 'https://instagram.com/yourclinic',
  LINKEDIN: 'https://linkedin.com/company/yourclinic',
  YOUTUBE: 'https://youtube.com/c/yourclinic',
  TIKTOK: 'https://tiktok.com/@yourclinic',
};

/**
 * Social media validation error messages
 */
export const SOCIAL_MEDIA_ERROR_MESSAGES = {
  FACEBOOK: 'Please enter a valid Facebook URL',
  TWITTER: 'Please enter a valid Twitter URL',
  INSTAGRAM: 'Please enter a valid Instagram URL',
  LINKEDIN: 'Please enter a valid LinkedIn URL',
  YOUTUBE: 'Please enter a valid YouTube URL',
  TIKTOK: 'Please enter a valid TikTok URL',
  URL: 'Please enter a valid URL',
};

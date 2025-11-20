/**
 * EmptyState Component
 * Reusable empty state component with icon variants
 */

import {
  AlertOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  HeartOutlined,
  InboxOutlined,
  MedicineBoxOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { FC, ReactNode } from 'react';

export type EmptyStateIconType =
  | 'default'
  | 'user'
  | 'database'
  | 'file'
  | 'alert'
  | 'medical'
  | 'pet'
  | 'inbox'
  | 'custom';

export interface EmptyStateProps {
  /**
   * Icon type to display
   * @default 'default'
   */
  icon?: EmptyStateIconType;
  /**
   * Custom icon element (only used when icon='custom')
   */
  customIcon?: ReactNode;
  /**
   * Title/heading text
   */
  title?: string;
  /**
   * Description text
   */
  description?: string;
  /**
   * Optional action button
   */
  action?: {
    text: string;
    onClick: () => void;
    type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  };
  /**
   * Custom className for styling
   */
  className?: string;
  /**
   * Size of the empty state - 'small' | 'default' | 'large'
   * @default 'default'
   */
  size?: 'small' | 'default' | 'large';
}

const EmptyState: FC<EmptyStateProps> = ({
  icon = 'default',
  customIcon,
  title,
  description,
  action,
  className = '',
  size = 'default',
}) => {
  // Icon mapping
  const getIcon = (): ReactNode => {
    if (icon === 'custom' && customIcon) {
      return customIcon;
    }

    const iconSize = size === 'small' ? 'text-3xl' : size === 'large' ? 'text-6xl' : 'text-5xl';
    const iconColor = 'text-gray-400';
    const iconClass = `${iconSize} ${iconColor} mb-3`;

    const iconMap: Record<EmptyStateIconType, ReactNode> = {
      default: <InboxOutlined className={iconClass} />,
      user: <UserOutlined className={iconClass} />,
      database: <DatabaseOutlined className={iconClass} />,
      file: <FileTextOutlined className={iconClass} />,
      alert: <AlertOutlined className={iconClass} />,
      medical: <MedicineBoxOutlined className={iconClass} />,
      pet: <HeartOutlined className={iconClass} />,
      inbox: <InboxOutlined className={iconClass} />,
      custom: null,
    };

    return iconMap[icon];
  };

  // Container padding based on size
  const paddingClass =
    size === 'small' ? 'py-4' : size === 'large' ? 'py-12' : 'py-8';

  return (
    <div className={`text-center ${paddingClass} ${className}`}>
      {getIcon()}
      {title && (
        <div
          className={`font-medium ${
            size === 'small' ? 'text-base' : size === 'large' ? 'text-xl' : 'text-lg'
          } text-gray-700 mb-2`}
        >
          {title}
        </div>
      )}
      {description && (
        <div
          className={`${
            size === 'small' ? 'text-xs' : 'text-sm'
          } text-gray-500 max-w-md mx-auto`}
        >
          {description}
        </div>
      )}
      {action && (
        <div className='mt-4'>
          <Button type={action.type || 'default'} onClick={action.onClick}>
            {action.text}
          </Button>
        </div>
      )}
    </div>
  );
};

/**
 * Pre-configured empty state variants for common use cases
 */
export const EmptyStateVariants = {
  NoData: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      icon='database'
      title='No Data Available'
      description='There is no data to display at the moment.'
      {...props}
    />
  ),
  NoResults: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      icon='inbox'
      title='No Results Found'
      description='Try adjusting your search or filter criteria.'
      {...props}
    />
  ),
  NoRecords: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      icon='file'
      title='No Records'
      description='No records have been created yet.'
      {...props}
    />
  ),
  NoUsers: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      icon='user'
      title='No Users'
      description='No users found matching your criteria.'
      {...props}
    />
  ),
  NoPets: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      icon='pet'
      title='No Pets'
      description='No pets found for this user.'
      {...props}
    />
  ),
  NoSymptoms: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      icon='alert'
      title='No Symptoms Recorded'
      description='No symptoms have been recorded for this case.'
      {...props}
    />
  ),
  NoVitalSigns: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      icon='medical'
      title='No Vital Signs'
      description='No vital signs have been recorded.'
      {...props}
    />
  ),
};

export { EmptyState };
export default EmptyState;


import { Spin } from 'antd';
import React from 'react';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'default' | 'large';
  className?: string;
  fullScreen?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'large',
  className = '',
  fullScreen = false,
}) => {
  const containerClass = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex justify-center items-center py-12';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className='text-center'>
        <Spin size={size} className='mb-4' />
        <div className='text-lg text-gray-600'>{message}</div>
      </div>
    </div>
  );
};

export default LoadingState;

import { Spin } from 'antd';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'default' | 'large';
  className?: string;
  fullScreen?: boolean;
}

function LoadingState({
  message = 'Loading...',
  size = 'large',
  className = '',
  fullScreen = false,
}: LoadingStateProps) {
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
}

export { LoadingState };
export default LoadingState;

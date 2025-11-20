import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner = ({
  size = 'default',
  text = 'Loading...',
  fullScreen = false,
  className = '',
}: LoadingSpinnerProps) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  if (fullScreen) {
    return (
      <div className='fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50'>
        <div className='text-center'>
          <Spin indicator={antIcon} size={size} />
          <div className='mt-4 text-gray-600'>{text}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Spin indicator={antIcon} size={size} />
      {text && <div className='mt-4 text-gray-600'>{text}</div>}
    </div>
  );
};

export { LoadingSpinner };
export default LoadingSpinner;

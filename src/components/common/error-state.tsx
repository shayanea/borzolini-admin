import { Alert, Button } from 'antd';

interface ErrorStateProps {
  title?: string;
  message: string;
  description?: string;
  onRetry?: () => void;
  retryText?: string;
  showIcon?: boolean;
  type?: 'error' | 'warning' | 'info';
  className?: string;
}

function ErrorState({
  title = 'Error',
  message,
  description,
  onRetry,
  retryText = 'Try Again',
  showIcon = true,
  type = 'error',
  className = '',
}: ErrorStateProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <Alert
        message={title}
        description={description || message}
        type={type}
        showIcon={showIcon}
        action={
          onRetry ? (
            <Button size='small' onClick={onRetry}>
              {retryText}
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}

export { ErrorState };
export default ErrorState;

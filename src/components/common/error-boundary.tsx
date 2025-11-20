import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { Component, ErrorInfo, ReactNode } from 'react';

import { ROUTES } from '@/constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.error('Error Boundary caught error:', error, errorInfo);
    }

    // TODO: Replace with centralized logger when implemented
    // logger.error('React Error Boundary caught error', error, {
    //   componentStack: errorInfo.componentStack,
    // });

    // In production, you might want to log to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = ROUTES.DASHBOARD;
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Result
          status='error'
          title='Something went wrong'
          subTitle="We're sorry, but something unexpected happened. Please try again."
          extra={[
            <Button
              key='reload'
              type='primary'
              icon={<ReloadOutlined />}
              onClick={this.handleReload}
            >
              Reload Page
            </Button>,
            <Button key='home' icon={<HomeOutlined />} onClick={this.handleGoHome}>
              Go Home
            </Button>,
          ]}
        >
          {import.meta.env.VITE_NODE_ENV === 'development' && this.state.error && (
            <div className='mt-4 p-4 bg-gray-100 rounded text-sm font-mono'>
              <h4 className='font-semibold mb-2'>Error Details (Development):</h4>
              <p className='text-red-600 mb-2'>{this.state.error.toString()}</p>
              {this.state.errorInfo && (
                <details className='mt-2'>
                  <summary className='cursor-pointer font-semibold'>Stack Trace</summary>
                  <pre className='mt-2 text-xs overflow-auto'>
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          )}
        </Result>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export default ErrorBoundary;


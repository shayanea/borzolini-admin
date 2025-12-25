import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
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
				<div className='min-h-[80vh] flex items-center justify-center p-4 bg-gray-50'>
					<div className='bg-white p-8 md:p-12 rounded-2xl shadow-lg text-center max-w-lg w-full'>
						<div className='mb-6 relative inline-block'>
							<div className='w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto animate-pulse'>
								<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
									<span className='text-4xl'>⚠️</span>
								</div>
							</div>
						</div>

						<h2 className='text-3xl font-bold text-gray-900 mb-3 tracking-tight'>
							Oops! Something went wrong
						</h2>

						<p className='text-gray-500 mb-8 text-lg font-light leading-relaxed'>
							Use the reload button to refresh the page/component. If the issue persists, please contact support.
						</p>

						<div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-8'>
							<Button
								type='primary'
								size='large'
								icon={<ReloadOutlined />}
								onClick={this.handleReload}
								className='w-full sm:w-auto min-w-[140px] h-11'
							>
								Reload Page
							</Button>
							<Button
								size='large'
								icon={<HomeOutlined />}
								onClick={this.handleGoHome}
								className='w-full sm:w-auto min-w-[140px] h-11'
							>
								Dashboard
							</Button>
						</div>

						{import.meta.env.VITE_NODE_ENV === 'development' && this.state.error && (
							<div className='mt-8 pt-6 border-t border-gray-100'>
								<details className='group'>
									<summary className='cursor-pointer text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2'>
										<span>View Technical Details</span>
										<span className='text-xs opacity-0 group-open:opacity-100 transition-opacity'>
											(Development Only)
										</span>
									</summary>
									<div className='mt-4 text-left bg-gray-900 rounded-lg p-4 overflow-hidden'>
										<p className='text-red-400 font-mono text-xs mb-2 break-words'>
											{this.state.error.toString()}
										</p>
										{this.state.errorInfo && (
											<pre className='text-gray-500 font-mono text-[10px] overflow-auto max-h-40 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent'>
												{this.state.errorInfo.componentStack}
											</pre>
										)}
									</div>
								</details>
							</div>
						)}
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export { ErrorBoundary };
export default ErrorBoundary;


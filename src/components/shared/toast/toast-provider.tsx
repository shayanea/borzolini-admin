import { registerNotificationApi } from '@/utils/toast';
import { notification } from 'antd';
import { useEffect } from 'react';

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	const [api, contextHolder] = notification.useNotification({
		stack: { threshold: 3 },
	});

	useEffect(() => {
		registerNotificationApi(api);
	}, [api]);

	return (
		<>
			{contextHolder}
			{children}
		</>
	);
};

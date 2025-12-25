import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

let notificationApi: any = null;

export const registerNotificationApi = (api: any) => {
  notificationApi = api;
};

const openNotification = (type: NotificationType, message: string, description?: string) => {
  const config = {
    message: message,
    description: description,
    placement: 'topRight' as const,
    duration: 3,
    className: 'modern-toast',
    style: {
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  };

  if (notificationApi) {
    notificationApi[type](config);
  } else {
    notification[type](config);
  }
};

export const toast = {
  success: (message: string, description?: string) =>
    openNotification('success', message, description),
  error: (message: string, description?: string) => openNotification('error', message, description),
  info: (message: string, description?: string) => openNotification('info', message, description),
  warning: (message: string, description?: string) =>
    openNotification('warning', message, description),
};

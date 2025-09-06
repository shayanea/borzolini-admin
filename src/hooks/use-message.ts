// Custom hook for Ant Design message notifications
import { App } from 'antd';
import { useCallback } from 'react';

export const useMessage = () => {
  const { message } = App.useApp();

  const showSuccess = useCallback(
    (content: string, duration?: number) => {
      message.success(content, duration);
    },
    [message]
  );

  const showError = useCallback(
    (content: string, duration?: number) => {
      message.error(content, duration);
    },
    [message]
  );

  const showWarning = useCallback(
    (content: string, duration?: number) => {
      message.warning(content, duration);
    },
    [message]
  );

  const showInfo = useCallback(
    (content: string, duration?: number) => {
      message.info(content, duration);
    },
    [message]
  );

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
  };
};

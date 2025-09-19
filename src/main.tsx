import 'dayjs/locale/en';
import './index.css';
import './utils/debug-token';

import { App as AntdApp, ConfigProvider } from 'antd';
import { CACHE_PRESETS, theme } from './constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './app.tsx';
import { AuthProvider } from './components/auth/auth-provider';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';

// Configure dayjs
dayjs.locale('en');

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_PRESETS.STANDARD.staleTime,
      gcTime: CACHE_PRESETS.STANDARD.gcTime,
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') ?? document.body).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <AntdApp>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </AntdApp>
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);

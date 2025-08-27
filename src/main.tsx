import 'dayjs/locale/en';
import './index.css';

import { CACHE_PRESETS, theme } from './constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './app.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
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
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') ?? document.body).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);

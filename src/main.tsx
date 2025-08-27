import 'dayjs/locale/en'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './app.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import dayjs from 'dayjs'

// Configure dayjs
dayjs.locale('en')

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#14213d',
    colorSuccess: '#059669',
    colorWarning: '#fca311',
    colorError: '#dc2626',
    colorInfo: '#3b82f6',
    borderRadius: 8,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#1f2937',
      triggerBg: '#374151',
      triggerColor: '#ffffff',
    },
    Menu: {
      darkItemBg: '#1f2937',
      darkItemHoverBg: '#374151',
      darkItemSelectedBg: '#3b82f6',
      darkItemSelectedColor: '#ffffff',
    },
    Button: {
      primaryColor: '#ffffff',
      primaryBg: '#14213d',
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)

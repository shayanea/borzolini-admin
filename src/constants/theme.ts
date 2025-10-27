// Ant Design theme configuration
export const theme = {
  token: {
    colorPrimary: '#38a3a5',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#06b6d4',
    borderRadius: 10,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#0b1220',
      triggerBg: '#111827',
      triggerColor: '#ffffff',
    },
    Menu: {
      darkItemBg: '#0b1220',
      darkItemHoverBg: '#111827',
      darkItemSelectedBg: '#38a3a5',
      darkItemSelectedColor: '#ffffff',
    },
    Button: {
      primaryColor: '#ffffff',
      primaryBg: '#38a3a5',
      borderRadius: 10,
    },
    Card: {
      borderRadius: 14,
      boxShadow: '0 10px 25px rgba(2, 6, 23, 0.06), 0 2px 6px rgba(2, 6, 23, 0.04)',
    },
  },
};

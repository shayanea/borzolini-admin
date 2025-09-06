// Ant Design theme configuration
export const theme = {
  token: {
    colorPrimary: '#023e8a',
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
      primaryBg: '#023e8a',
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
  },
};

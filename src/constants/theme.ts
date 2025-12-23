// Ant Design theme configuration
export const theme = {
  token: {
    colorPrimary: '#D5992A',
    colorSuccess: '#10b981',
    colorWarning: '#D5992A',
    colorError: '#ef4444',
    colorInfo: '#B88224',
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
      darkItemSelectedBg: '#D5992A',
      darkItemSelectedColor: '#ffffff',
    },
    Button: {
      primaryColor: '#ffffff',
      primaryBg: '#D5992A',
      borderRadius: 10,
    },
    Card: {
      borderRadius: 14,
      boxShadow: '0 10px 25px rgba(2, 6, 23, 0.06), 0 2px 6px rgba(2, 6, 23, 0.04)',
    },
  },
};

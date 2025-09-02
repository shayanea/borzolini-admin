import { Button, Space, Typography } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ReportsHeader = ({
  onFilters,
  onExportReport,
}: {
  onFilters: () => void;
  onExportReport: () => void;
}) => {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <Title level={2} className='!mb-2'>
          Reports & Analytics
        </Title>
        <Text className='text-text-light'>
          View clinic performance metrics and generate reports
        </Text>
      </div>

      <Space>
        <Button icon={<FilterOutlined />} onClick={onFilters}>
          Filters
        </Button>
        <div className='relative'>
          <Button
            icon={<DownloadOutlined />}
            type='primary'
            className='bg-primary-navy border-primary-navy'
            onClick={onExportReport}
          >
            Export Report
          </Button>
          <span className='absolute -top-2 -right-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full'>
            Soon
          </span>
        </div>
      </Space>
    </div>
  );
};

export default ReportsHeader;

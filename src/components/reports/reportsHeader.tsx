import { Button, Space, Typography } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ReportsHeader = ({ onFilters, onExportReport }) => {
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
        <Button
          icon={<DownloadOutlined />}
          type='primary'
          className='bg-primary-navy border-primary-navy'
          onClick={onExportReport}
        >
          Export Report
        </Button>
      </Space>
    </div>
  );
};

export default ReportsHeader;

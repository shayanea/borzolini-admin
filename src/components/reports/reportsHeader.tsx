import React from 'react';
import { Typography, Button, Space } from 'antd';
import { FilterOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ReportsHeaderProps } from '@/types/reports';

const { Title, Text } = Typography;

const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  onFilters,
  onExportReport,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Title level={2} className="!mb-2">
          Reports & Analytics
        </Title>
        <Text className="text-text-light">
          View clinic performance metrics and generate reports
        </Text>
      </div>
      
      <Space>
        <Button icon={<FilterOutlined />} onClick={onFilters}>
          Filters
        </Button>
        <Button 
          icon={<DownloadOutlined />} 
          type="primary" 
          className="bg-primary-navy border-primary-navy"
          onClick={onExportReport}
        >
          Export Report
        </Button>
      </Space>
    </div>
  );
};

export default ReportsHeader;

import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';

import { ExportButton } from '@/components/common';

const { Title, Text } = Typography;

interface ClinicPageHeaderProps {
  title: string;
  subtitle: string;
  loading?: boolean;
  onRefresh: () => void;
  onExportCSV: () => Promise<Blob>;
  onExportExcel: () => Promise<Blob>;
  onAddClinic: () => void;
  filters?: Record<string, any>;
  estimatedRecordCount?: number;
}

const ClinicPageHeader = ({
  title,
  subtitle,
  loading = false,
  onRefresh,
  onExportCSV,
  onExportExcel,
  onAddClinic,
  filters = {},
  estimatedRecordCount = 0,
}: ClinicPageHeaderProps) => {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
      <div className='flex-1'>
        <Title level={2} className='!mb-2 !text-text-primary'>
          {title}
        </Title>
        <Text className='text-text-secondary text-base'>{subtitle}</Text>
      </div>

      <Space size='middle'>
        <Button
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          loading={loading}
          className='flex items-center'
        >
          Refresh
        </Button>

        <ExportButton
          entityType='clinics'
          exportCSV={onExportCSV}
          exportExcel={onExportExcel}
          filters={filters}
          estimatedRecordCount={estimatedRecordCount}
          disabled={loading}
        />

        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={onAddClinic}
          className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark flex items-center'
        >
          Add Clinic
        </Button>
      </Space>
    </div>
  );
};

export default ClinicPageHeader;

import { Button, Space, Typography } from 'antd';
import { DownloadOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ClinicPageHeaderProps {
  title: string;
  subtitle: string;
  loading?: boolean;
  onRefresh: () => void;
  onExport: () => void;
  onAddClinic: () => void;
}

const ClinicPageHeader = ({
  title,
  subtitle,
  loading = false,
  onRefresh,
  onExport,
  onAddClinic,
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

        <div className='relative'>
          <Button
            icon={<DownloadOutlined />}
            onClick={onExport}
            loading={loading}
            className='flex items-center'
          >
            Export
          </Button>
          <span className='absolute -top-2 -right-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full'>
            Soon
          </span>
        </div>

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

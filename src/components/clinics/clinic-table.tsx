import { Badge, Button, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
} from '@ant-design/icons';

import type { Clinic } from '@/types';
import { ROUTES } from '@/constants/routes';
import { SocialMediaLinks } from '@/components/common';
import type { TablePaginationConfig } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Text, Link } = Typography;

interface ClinicTableProps {
  clinics: Clinic[];
  loading?: boolean;
  pagination?: TablePaginationConfig;
  rowSelection?: TableProps<Clinic>['rowSelection'];
  onChange?: TableProps<Clinic>['onChange'];
  onEdit: (clinic: Clinic) => void;
  onDelete: (clinicId: string) => void;
  onView?: (clinic: Clinic) => void;
  onViewStaff?: (clinic: Clinic) => void;
}

const ClinicTable = ({
  clinics,
  loading = false,
  pagination,
  rowSelection,
  onChange,
  onEdit,
  onDelete,
  onView,
  onViewStaff,
}: ClinicTableProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('components');

  const handleViewPetCases = (clinic: Clinic) => {
    navigate(`${ROUTES.PET_CASES}?clinicId=${clinic.id}`);
  };
  const columns: ColumnsType<Clinic> = [
    {
      title: t('clinicTable.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (name: string) => (
        <div className='flex flex-col'>
          <Link className='font-medium text-text-primary hover:text-primary-navy'>
            <Text ellipsis={{ tooltip: name }}>{name}</Text>
          </Link>
        </div>
      ),
    },
    {
      title: t('clinicTable.location'),
      key: 'location',
      render: (_, record: Clinic) => (
        <div className='flex flex-col'>
          <Text className='text-text-primary' ellipsis={{ tooltip: record.address }}>
            {record.address}
          </Text>
          <Text
            className='text-text-secondary text-sm'
            ellipsis={{ tooltip: `${record.city}, ${record.country}` }}
          >
            {record.city}, {record.country}
          </Text>
          {record.postal_code && (
            <Text
              className='text-text-secondary text-sm'
              ellipsis={{ tooltip: record.postal_code }}
            >
              {record.postal_code}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: t('clinicTable.contact'),
      key: 'contact',
      render: (_, record: Clinic) => (
        <div className='flex flex-col space-y-1'>
          <Text className='text-text-primary' ellipsis={{ tooltip: record.phone }}>
            {record.phone}
          </Text>
          <Text className='text-text-secondary text-sm' ellipsis={{ tooltip: record.email }}>
            {record.email}
          </Text>
          {record.website && (
            <Link href={record.website} target='_blank' className='text-sm'>
              <Text ellipsis={{ tooltip: record.website }}>{record.website}</Text>
            </Link>
          )}
          {/* Social Media Links */}
          <div className='mt-2'>
            <SocialMediaLinks
              facebook_url={record.facebook_url}
              twitter_url={record.twitter_url}
              instagram_url={record.instagram_url}
              linkedin_url={record.linkedin_url}
              youtube_url={record.youtube_url}
              tiktok_url={record.tiktok_url}
              size='small'
            />
          </div>
        </div>
      ),
    },
    {
      title: t('clinicTable.rating'),
      dataIndex: 'rating',
      key: 'rating',
      sorter: true,
      render: (rating: number, record: Clinic) => (
        <div className='flex flex-col'>
          <div className='flex items-center space-x-2'>
            <Badge
              count={rating.toFixed(1)}
              showZero
              style={{
                backgroundColor: rating >= 4 ? '#52c41a' : rating >= 3 ? '#faad14' : '#f5222d',
              }}
            />
            <Text
              className='text-text-secondary text-sm'
              ellipsis={{ tooltip: `(${record.totalReviews} ${t('clinicTable.reviews')})` }}
            >
              ({record.totalReviews} {t('clinicTable.reviews')})
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: t('clinicTable.services'),
      key: 'services',
      render: (_, record: Clinic) => (
        <div className='flex flex-wrap gap-1'>
          {record.services.length > 3 && (
            <Tag color='default' className='text-xs'>
              {t('clinicTable.moreServices', { count: record.services.length - 3 })}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: t('clinicTable.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean) => (
        <Badge
          status={isActive ? 'success' : 'default'}
          text={isActive ? t('clinicTable.active') : t('clinicTable.inactive')}
        />
      ),
    },
    {
      title: t('clinicTable.actions'),
      key: 'actions',
      width: 120,
      render: (_, record: Clinic) => (
        <Space size='small'>
          <Button
            type='text'
            icon={<EyeOutlined />}
            size='small'
            className='text-primary-navy hover:text-primary-dark'
            title={t('clinicTable.viewDetails')}
            onClick={() => onView && onView(record)}
          />
          <Button
            type='text'
            icon={<TeamOutlined />}
            size='small'
            className='text-primary-navy hover:text-primary-dark'
            title={t('clinicTable.viewStaffVeterinarians')}
            onClick={() => onViewStaff && onViewStaff(record)}
          />
          <Button
            type='text'
            icon={<MedicineBoxOutlined />}
            size='small'
            className='text-primary-navy hover:text-primary-dark'
            title={t('clinicTable.viewPetCases')}
            onClick={() => handleViewPetCases(record)}
          />
          <Button
            type='text'
            icon={<EditOutlined />}
            size='small'
            className='text-primary-navy hover:text-primary-dark'
            onClick={() => onEdit(record)}
            title={t('clinicTable.editClinic')}
          />
          <Button
            type='text'
            icon={<DeleteOutlined />}
            size='small'
            danger
            onClick={() => onDelete(record.id)}
            title={t('clinicTable.deleteClinic')}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={clinics}
      rowKey='id'
      loading={loading}
      pagination={pagination}
      rowSelection={rowSelection}
      onChange={onChange}
      className='clinic-table'
      scroll={{ x: 1200 }}
    />
  );
};

export default ClinicTable;

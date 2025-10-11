import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Badge, Button, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import type { Clinic } from '@/types';
import type { TablePaginationConfig } from 'antd';
import { SocialMediaLinks } from '@/components/common';

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

  const handleViewPetCases = (clinic: Clinic) => {
    navigate(`${ROUTES.PET_CASES}?clinicId=${clinic.id}`);
  };
  const columns: ColumnsType<Clinic> = [
    {
      title: 'Name',
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
      title: 'Location',
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
      title: 'Contact',
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
      title: 'Rating',
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
              ellipsis={{ tooltip: `(${record.totalReviews} reviews)` }}
            >
              ({record.totalReviews} reviews)
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Services',
      key: 'services',
      render: (_, record: Clinic) => (
        <div className='flex flex-wrap gap-1'>
          {record.services.length > 3 && (
            <Tag color='default' className='text-xs'>
              +{record.services.length - 3} more
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean) => (
        <Badge status={isActive ? 'success' : 'default'} text={isActive ? 'Active' : 'Inactive'} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record: Clinic) => (
        <Space size='small'>
          <Button
            type='text'
            icon={<EyeOutlined />}
            size='small'
            className='text-primary-navy hover:text-primary-dark'
            title='View Details'
            onClick={() => onView && onView(record)}
          />
          <Button
            type='text'
            icon={<TeamOutlined />}
            size='small'
            className='text-primary-navy hover:text-primary-dark'
            title='View Staff & Veterinarians'
            onClick={() => onViewStaff && onViewStaff(record)}
          />
          <Button
            type='text'
            icon={<MedicineBoxOutlined />}
            size='small'
            className='text-primary-navy hover:text-primary-dark'
            title='View Pet Cases'
            onClick={() => handleViewPetCases(record)}
          />
          <Button
            type='text'
            icon={<EditOutlined />}
            size='small'
            className='text-primary-navy hover:text-primary-dark'
            onClick={() => onEdit(record)}
            title='Edit Clinic'
          />
          <Button
            type='text'
            icon={<DeleteOutlined />}
            size='small'
            danger
            onClick={() => onDelete(record.id)}
            title='Delete Clinic'
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

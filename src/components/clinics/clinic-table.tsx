import { Badge, Button, Space, Table, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import type { Clinic } from '@/types';
import type { ColumnsType } from 'antd/es/table';

const { Text, Link } = Typography;

interface ClinicTableProps {
  clinics: Clinic[];
  loading?: boolean;
  pagination?: any;
  rowSelection?: any;
  onChange?: (pagination: any, filters: any, sorter: any) => void;
  onEdit: (clinic: Clinic) => void;
  onDelete: (clinicId: string) => void;
}

const ClinicTable = ({
  clinics,
  loading = false,
  pagination,
  rowSelection,
  onChange,
  onEdit,
  onDelete,
}: ClinicTableProps) => {
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
          {record.postalCode && (
            <Text className='text-text-secondary text-sm' ellipsis={{ tooltip: record.postalCode }}>
              {record.postalCode}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record: Clinic) => (
        <div className='flex flex-col'>
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

import {
  Badge,
  Button,
  Card,
  Checkbox,
  Pagination,
  Popconfirm,
  Space,
  Spin,
  Table,
  Typography,
} from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import type { Breed } from '@/types/breeds';
import { formatDate } from '@/lib/utils';

const { Text } = Typography;

interface BreedsTableProps {
  breeds: Breed[];
  loading: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  selectedIds: string[];
  onPageChange: (page: number) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onView: (breed: Breed) => void;
  onEdit: (breed: Breed) => void;
  onDelete: (id: string) => void;
  getSpeciesColor: (
    species: string
  ) => 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'default';
}

export function BreedsTable({
  breeds,
  loading,
  totalCount,
  currentPage,
  pageSize,
  selectedIds,
  onPageChange,
  onSelectAll,
  onSelectRow,
  onView,
  onEdit,
  onDelete,
  getSpeciesColor,
}: BreedsTableProps) {
  const columns = [
    {
      title: (
        <Checkbox
          checked={selectedIds.length === breeds?.length && breeds?.length > 0}
          onChange={e => onSelectAll(e.target.checked)}
        />
      ),
      key: 'checkbox',
      width: 50,
      render: (_: unknown, record: Breed) => (
        <Checkbox
          checked={selectedIds.includes(record.id)}
          onChange={e => onSelectRow(record.id, e.target.checked)}
        />
      ),
    },
    {
      title: 'Image',
      key: 'image_url',
      width: 100,
      render: (_: unknown, record: Breed) => (
        record.image_url ? (
          <img
            src={record.image_url}
            alt={record.name}
            className="w-16 h-16 object-cover rounded border"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
            <Text type="secondary" className="text-xs">No image</Text>
          </div>
        )
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Species',
      dataIndex: 'species',
      key: 'species',
      render: (species: string) => <Badge color={getSpeciesColor(species)} text={species} />,
    },
    {
      title: 'Size',
      dataIndex: 'size_category',
      key: 'size_category',
      render: (size?: string) => size ? <Text>{size}</Text> : <Text type="secondary">N/A</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Badge color={isActive ? 'success' : 'default'} text={isActive ? 'Active' : 'Inactive'} />
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: Date) => <Text type='secondary'>{formatDate(date)}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: Breed) => (
        <Space size='small'>
          <Button type='text' icon={<EyeOutlined />} size='small' onClick={() => onView(record)} />
          <Button type='text' icon={<EditOutlined />} size='small' onClick={() => onEdit(record)} />
          <Popconfirm
            title='Delete breed'
            description='Are you sure you want to delete this breed?'
            onConfirm={() => onDelete(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button type='text' danger icon={<DeleteOutlined />} size='small' />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div className='flex justify-between items-center mb-4'>
        <Typography.Title level={4}>Breeds ({totalCount})</Typography.Title>
        <Text type='secondary'>
          Page {currentPage} of {Math.ceil(totalCount / pageSize)}
        </Text>
      </div>
      {loading ? (
        <div className='flex items-center justify-center py-8'>
          <Spin size='large' />
          <Text className='ml-2'>Loading breeds...</Text>
        </div>
      ) : breeds?.length === 0 ? (
        <div className='text-center py-8'>
          <Text type='secondary' className='block mb-4'>
            No breeds found
          </Text>
        </div>
      ) : (
        <>
          <Table columns={columns} dataSource={breeds} rowKey='id' pagination={false} />
          {totalCount > pageSize && (
            <div className='mt-4 flex justify-center'>
              <Pagination
                current={currentPage}
                total={totalCount}
                pageSize={pageSize}
                onChange={onPageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
}


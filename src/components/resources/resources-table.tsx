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
import { DeleteOutlined, EditOutlined, EyeOutlined, LinkOutlined } from '@ant-design/icons';

import type { Resource } from '@/types/resources';
import { formatDate } from '@/lib/utils';

const { Text } = Typography;

interface ResourcesTableProps {
  resources: Resource[];
  loading: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  selectedIds: string[];
  onPageChange: (page: number) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onView: (resource: Resource) => void;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
  getTypeColor: (
    type: string
  ) => 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'default';
}

export function ResourcesTable({
  resources,
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
  getTypeColor,
}: ResourcesTableProps) {
  const columns = [
    {
      title: (
        <Checkbox
          checked={selectedIds.length === resources?.length && resources?.length > 0}
          onChange={e => onSelectAll(e.target.checked)}
        />
      ),
      key: 'checkbox',
      width: 50,
      render: (_: unknown, record: Resource) => (
        <Checkbox
          checked={selectedIds.includes(record.id)}
          onChange={e => onSelectRow(record.id, e.target.checked)}
        />
      ),
    },
    {
      title: 'Image',
      key: 'cover',
      width: 100,
      render: (_: unknown, record: Resource) => (
        record.cover ? (
          <img
            src={record.cover}
            alt={record.title}
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
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: Resource) => (
        <Typography.Link
          href={record.url}
          target="_blank"
          rel="noopener noreferrer"
          strong
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          {title}
          <LinkOutlined className="text-xs" />
        </Typography.Link>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Badge color={getTypeColor(type)} text={type} />,
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
      render: (_: unknown, record: Resource) => (
        <Space size='small'>
          <Button type='text' icon={<EyeOutlined />} size='small' onClick={() => onView(record)} />
          <Button type='text' icon={<EditOutlined />} size='small' onClick={() => onEdit(record)} />
          <Popconfirm
            title='Delete resource'
            description='Are you sure you want to delete this resource?'
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
        <Typography.Title level={4}>Resources ({totalCount})</Typography.Title>
        <Text type='secondary'>
          Page {currentPage} of {Math.ceil(totalCount / pageSize)}
        </Text>
      </div>
      {loading ? (
        <div className='flex items-center justify-center py-8'>
          <Spin size='large' />
          <Text className='ml-2'>Loading resources...</Text>
        </div>
      ) : resources?.length === 0 ? (
        <div className='text-center py-8'>
          <Text type='secondary' className='block mb-4'>
            No resources found
          </Text>
        </div>
      ) : (
        <>
          <Table columns={columns} dataSource={resources} rowKey='id' pagination={false} />
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

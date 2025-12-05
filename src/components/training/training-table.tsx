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
  Tag,
  Typography,
} from 'antd';
import { ClockCircleOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { getDifficultyColor, getSpeciesIcon } from './training-utils';

import type { TrainingActivity } from '@/types/training';
import { formatDate } from '@/lib/utils';

const { Text } = Typography;

interface TrainingTableProps {
  activities: TrainingActivity[];
  loading: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  selectedIds: string[];
  onPageChange: (page: number) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onView: (activity: TrainingActivity) => void;
  onEdit: (activity: TrainingActivity) => void;
  onDelete: (id: string) => void;
}

export function TrainingTable({
  activities,
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
}: TrainingTableProps) {
  const columns = [
    {
      title: (
        <Checkbox
          checked={selectedIds.length === activities.length && activities.length > 0}
          onChange={e => onSelectAll(e.target.checked)}
        />
      ),
      key: 'checkbox',
      width: 50,
      render: (_: unknown, record: TrainingActivity) => (
        <Checkbox
          checked={selectedIds.includes(record.id)}
          onChange={e => onSelectRow(record.id, e.target.checked)}
        />
      ),
    },
    {
      title: 'Image',
      key: 'thumbnail',
      width: 100,
      render: (_: unknown, record: TrainingActivity) => {
        const thumbnailUrl = (record as unknown as { thumbnailUrl?: string }).thumbnailUrl;
        return thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={record.title}
            className='w-16 h-16 object-cover rounded border'
            onError={e => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className='w-16 h-16 bg-gray-100 rounded border flex items-center justify-center'>
            <Text type='secondary' className='text-xs'>
              No image
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => <Text strong>{title}</Text>,
    },
    {
      title: 'Species',
      key: 'species',
      render: (_: unknown, record: TrainingActivity) => {
        // Access by_species from record (API returns it as by_species)
        const by_species = (record as any).by_species;
        if (!by_species || !Array.isArray(by_species) || by_species.length === 0) {
          return <Text type='secondary'>No species</Text>;
        }
        return (
          <Space size='small' wrap>
            {by_species.slice(0, 2).map((s: any, idx: number) => (
              <Tag key={s.id || idx} color='blue'>
                {getSpeciesIcon(s.species)} {s.species}
              </Tag>
            ))}
            {by_species.length > 2 && <Tag color='default'>+{by_species.length - 2} more</Tag>}
          </Space>
        );
      },
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty: string) => (
        <Badge color={getDifficultyColor(difficulty)} text={difficulty} />
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'avg_duration_minutes',
      key: 'duration',
      render: (minutes?: number | null) => (
        <Space>
          <ClockCircleOutlined />
          <span>{minutes ? `${minutes} min` : 'N/A'}</span>
        </Space>
      ),
    },
    {
      title: 'Tags',
      key: 'tags',
      render: (_: unknown, record: TrainingActivity) => {
        // Access tags from record (API returns it as tags)
        const tags = (record as any).tags;
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
          return <Text type='secondary'>No tags</Text>;
        }
        return (
          <Space size='small' wrap>
            {tags.slice(0, 3).map((tag: string) => (
              <Tag key={tag} color='default'>
                {tag}
              </Tag>
            ))}
            {tags.length > 3 && <Tag color='default'>+{tags.length - 3}</Tag>}
          </Space>
        );
      },
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
      render: (_: unknown, record: TrainingActivity) => (
        <Space size='small'>
          <Button type='text' icon={<EyeOutlined />} size='small' onClick={() => onView(record)} />
          <Button type='text' icon={<EditOutlined />} size='small' onClick={() => onEdit(record)} />
          <Popconfirm
            title='Delete training activity'
            description='Are you sure you want to delete this training activity?'
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
        <Typography.Title level={4}>Training Activities ({totalCount})</Typography.Title>
        <Text type='secondary'>
          Page {currentPage} of {Math.ceil(totalCount / pageSize)}
        </Text>
      </div>
      {loading ? (
        <div className='flex items-center justify-center py-8'>
          <Spin size='large' />
          <Text className='ml-2'>Loading training activities...</Text>
        </div>
      ) : activities.length === 0 ? (
        <div className='text-center py-8'>
          <Text type='secondary' className='block mb-4'>
            No training activities found
          </Text>
        </div>
      ) : (
        <>
          <Table columns={columns} dataSource={activities} rowKey='id' pagination={false} />
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

import { Badge, Button, Card, Checkbox, Pagination, Popconfirm, Space, Spin, Table, Typography } from 'antd';
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { TrainingActivity } from '@/types/training';
import { formatDate } from '@/lib/utils';
import { getDifficultyColor, getSpeciesIcon } from './training-utils';

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
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => <Text strong>{title}</Text>,
    },
    {
      title: 'Species',
      dataIndex: 'by_species',
      key: 'species',
      render: (bySpecies?: Array<{ species: string }>) => {
        if (!bySpecies || bySpecies.length === 0) {
          return <Text type="secondary">No species</Text>;
        }
        return (
          <Space size='small' wrap>
            {bySpecies.slice(0, 2).map((s, idx) => (
              <Badge key={idx} text={`${getSpeciesIcon(s.species)} ${s.species}`} />
            ))}
            {bySpecies.length > 2 && <Badge text={`+${bySpecies.length - 2} more`} />}
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
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space size='small' wrap>
          {tags.slice(0, 3).map(tag => (
            <Badge key={tag} text={tag} />
          ))}
          {tags.length > 3 && <Badge text={`+${tags.length - 3}`} />}
        </Space>
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
      render: (_: unknown, record: TrainingActivity) => (
        <Space size='small'>
          <Button
            type='text'
            icon={<EyeOutlined />}
            size='small'
            onClick={() => onView(record)}
          />
          <Button
            type='text'
            icon={<EditOutlined />}
            size='small'
            onClick={() => onEdit(record)}
          />
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
          <Table
            columns={columns}
            dataSource={activities}
            rowKey='id'
            pagination={false}
          />
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


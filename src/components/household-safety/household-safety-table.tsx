import { Badge, Button, Card, Pagination, Space, Spin, Table, Tag, Typography } from 'antd';
import { ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import type { SafetyLevel, SafetySearchResult } from '@/types/household-safety';

import { formatDate } from '@/lib/utils';

const { Title, Text } = Typography;

interface HouseholdSafetyTableProps {
  results: SafetySearchResult[];
  loading: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  activeTab: string;
  onPageChange: (page: number) => void;
  onView: (item: SafetySearchResult) => void;
  getSafetyBadgeColor: (level?: SafetyLevel) => 'success' | 'warning' | 'error' | 'default';
  getItemTypeIcon: (type: string) => string;
}

export function HouseholdSafetyTable({
  results,
  loading,
  totalCount,
  currentPage,
  pageSize,
  activeTab,
  onPageChange,
  onView,
  getSafetyBadgeColor,
  getItemTypeIcon,
}: HouseholdSafetyTableProps) {
  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (_: unknown, record: SafetySearchResult) => (
        <span className='text-lg'>{getItemTypeIcon(record.type)}</span>
      ),
    },
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: unknown, record: SafetySearchResult) => {
        const displayName = record.canonical_name || record.name;
        return (
          <div>
            <div className='font-semibold'>{displayName}</div>
            {record.scientific_name && (
              <div className='text-xs italic text-gray-400'>{record.scientific_name}</div>
            )}
            {record.category && (
              <Tag color='blue' className='mt-1'>
                {record.category}
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: 'Safety Level',
      key: 'safety',
      width: 200,
      render: (_: unknown, record: SafetySearchResult) => {
        const safetyOverall = record.safety_overall || record.safetyLevel;
        return (
          <Space size='small' wrap direction='vertical' style={{ width: '100%' }}>
            {safetyOverall && (
              <Badge
                color={getSafetyBadgeColor(safetyOverall as SafetyLevel)}
                text={`Overall: ${safetyOverall}`}
              />
            )}
            <Space size='small' wrap>
              {record.safetyLevel && !record.safety_overall && (
                <Badge
                  color={getSafetyBadgeColor(record.safetyLevel as SafetyLevel)}
                  text={record.safetyLevel}
                />
              )}
              {record.toxicityLevel && (
                <Badge
                  color={getSafetyBadgeColor(record.toxicityLevel as SafetyLevel)}
                  text={record.toxicityLevel}
                />
              )}
              {record.hazardLevel && (
                <Badge
                  color={getSafetyBadgeColor(record.hazardLevel as SafetyLevel)}
                  text={record.hazardLevel}
                />
              )}
            </Space>
          </Space>
        );
      },
    },
    {
      title: 'Species Info',
      key: 'species',
      width: 280,
      render: (_: unknown, record: SafetySearchResult) => {
        // Use safety_by_species if available, otherwise fallback to speciesSafety
        const speciesData =
          record.safety_by_species ||
          record.speciesSafety?.map(s => ({
            id: s.species,
            species: s.species,
            safety: s.safety as 'safe' | 'caution' | 'dangerous' | 'avoid' | 'unknown',
            risks: [],
            emergency: false,
          })) ||
          [];

        if (speciesData.length === 0) {
          return <span className='text-sm text-gray-500'>No species data</span>;
        }

        const displayCount = Math.min(3, speciesData.length);
        const totalRisks = speciesData.reduce((sum, s) => sum + (s.risks?.length || 0), 0);
        const hasEmergency = speciesData.some(s => s.emergency);

        return (
          <div className='space-y-1'>
            {hasEmergency && (
              <div className='flex items-center gap-1 mb-1'>
                <ExclamationCircleOutlined className='text-red-500 text-xs' />
                <span className='text-xs text-red-600 font-semibold'>Emergency Risk</span>
              </div>
            )}
            {speciesData.slice(0, displayCount).map((safety, index) => {
              const risksCount = safety.risks?.length || 0;
              return (
                <div key={safety.id || index} className='flex items-center gap-2 text-sm'>
                  <Badge
                    color={
                      safety.safety === 'safe'
                        ? 'success'
                        : safety.safety === 'caution'
                          ? 'warning'
                          : 'error'
                    }
                    text={`${safety.species}: ${safety.safety}`}
                  />
                  {risksCount > 0 && (
                    <Tag color='red' className='text-xs'>
                      {risksCount} risk{risksCount > 1 ? 's' : ''}
                    </Tag>
                  )}
                </div>
              );
            })}
            {speciesData.length > displayCount && (
              <div className='text-xs text-gray-500'>
                +{speciesData.length - displayCount} more species
              </div>
            )}
            {totalRisks > 0 && (
              <div className='text-xs text-gray-500 mt-1'>
                Total: {totalRisks} risk{totalRisks > 1 ? 's' : ''} across {speciesData.length}{' '}
                species
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Critical Info',
      key: 'notes_markdown',
      width: 300,
      render: (notes_markdown: string) => {
        console.log(notes_markdown);
        // const notes = notes_markdown;
        // const truncatedNotes =
        //   notes && notes.length > 100 ? `${notes.substring(0, 100)}...` : notes;

        // return notes ? (
        //   <div className='text-xs'>
        //     <div className='bg-yellow-50 p-2 rounded border border-yellow-200'>
        //       <Text className='text-xs leading-relaxed'>{truncatedNotes}</Text>
        //     </div>
        //   </div>
        // ) : (
        return <span className='text-xs text-gray-400'>No notes available</span>;
        // );
      },
    },
    {
      title: 'Added',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: Date) => <span className='text-sm text-gray-500'>{formatDate(date)}</span>,
    },
    {
      title: 'Details',
      key: 'actions',
      width: 80,
      align: 'center' as const,
      render: (_: unknown, record: SafetySearchResult) => (
        <Button type='text' icon={<EyeOutlined />} size='small' onClick={() => onView(record)} />
      ),
    },
  ];

  return (
    <Card>
      <div className='flex justify-between items-center mb-4'>
        <Title level={4}>
          {activeTab === 'all'
            ? `All Items (${totalCount})`
            : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Items (${totalCount})`}
        </Title>
        <div className='flex items-center gap-4'>
          <Tag color='blue' className='text-sm'>
            📊 Showing detailed safety information
          </Tag>
          <Text type='secondary'>
            Page {currentPage} of {Math.ceil(totalCount / pageSize)}
          </Text>
        </div>
      </div>
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <Spin size='large' />
          <Text className='ml-2'>Loading safety information...</Text>
        </div>
      ) : results.length === 0 ? (
        <div className='text-center py-12'>
          <Text type='secondary' className='block mb-4'>
            {activeTab === 'all'
              ? 'No items found matching your criteria'
              : `No ${activeTab} items found for the selected filters`}
          </Text>
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={results}
            rowKey='id'
            pagination={false}
            scroll={{ x: 1400 }}
            size='middle'
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

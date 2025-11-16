import { Button, Space, Table, Tag, Tooltip, Typography } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  HeartOutlined,
  LinkOutlined,
  MailOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  StarFilled,
  TeamOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';

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
      width: 250,
      render: (name: string, record: Clinic) => (
        <div className='flex items-center space-x-3 p-2 rounded-lg bg-white border border-slate-100 hover:shadow-sm transition-shadow'>
          <div
            className='w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0'
            style={{ backgroundColor: '#06b6d4' }}
          >
            <MedicineBoxOutlined className='text-lg' />
          </div>
          <div className='flex-1 min-w-0'>
            <Link
              className='font-semibold text-slate-800 hover:text-slate-900 block'
              href={`${ROUTES.CLINICS}/${record.id}`}
            >
              <Text ellipsis={{ tooltip: name }} className='text-base'>
                {name}
              </Text>
            </Link>
            <Text className='text-xs text-slate-500 block'>ID: {record.id}</Text>
          </div>
        </div>
      ),
    },
    {
      title: t('clinicTable.location'),
      key: 'location',
      width: 280,
      render: (_, record: Clinic) => (
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-sm font-medium text-slate-800'>
            <EnvironmentOutlined className='text-slate-500' />
            <Text ellipsis={{ tooltip: record.address }} className='truncate'>
              {record.address}
            </Text>
          </div>
          <div className='flex items-center gap-2 text-xs text-slate-600'>
            <span className='text-slate-500'>•</span>
            <Text ellipsis={{ tooltip: `${record.city}, ${record.state || ''}` }}>
              {record.city}
              {record.state && `, ${record.state}`}
            </Text>
          </div>
          {record.postal_code && (
            <div className='flex items-center gap-2 text-xs text-slate-600'>
              <span className='text-slate-500'>•</span>
              <Text>{record.postal_code}</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('clinicTable.contact'),
      key: 'contact',
      width: 320,
      render: (_, record: Clinic) => (
        <div className='space-y-2 text-sm'>
          {/* Phone */}
          {record.phone && (
            <div className='flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200'>
              <PhoneOutlined className='text-slate-500' />
              <Text className='text-slate-700 font-medium'>{record.phone}</Text>
            </div>
          )}

          {/* Email */}
          {record.email && (
            <div className='flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200'>
              <MailOutlined className='text-slate-500' />
              <Text className='text-slate-700 font-medium'>{record.email}</Text>
            </div>
          )}

          {/* Website */}
          {record.website && (
            <div className='flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-200'>
              <LinkOutlined className='text-blue-500' />
              <Link
                href={record.website}
                target='_blank'
                className='text-blue-700 font-medium hover:text-blue-800'
              >
                <Text ellipsis={{ tooltip: record.website }} className='text-sm'>
                  Visit Website
                </Text>
              </Link>
            </div>
          )}

          {/* Social Media */}
          {(record.facebook_url ||
            record.twitter_url ||
            record.instagram_url ||
            record.linkedin_url ||
            record.youtube_url ||
            record.tiktok_url) && (
            <div className='p-2'>
              <SocialMediaLinks
                facebook_url={record.facebook_url}
                twitter_url={record.twitter_url}
                instagram_url={record.instagram_url}
                linkedin_url={record.linkedin_url}
                youtube_url={record.youtube_url}
                tiktok_url={record.tiktok_url}
                size='small'
                className='gap-1'
              />
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('clinicTable.rating'),
      dataIndex: 'rating',
      key: 'rating',
      sorter: true,
      width: 180,
      render: (rating: number) => (
        <div className='flex items-center space-x-3'>
          {/* Rating Badge */}
          <div
            className={`px-3 py-1.5 rounded-full font-bold text-sm shadow-sm flex items-center gap-1 ${
              rating >= 4
                ? 'bg-green-100 text-green-800 border border-green-200'
                : rating >= 3
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            <StarFilled
              className={`text-xs ${rating >= 4 ? 'text-green-600' : rating >= 3 ? 'text-yellow-600' : 'text-red-600'}`}
            />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
      ),
    },
    {
      title: t('clinicTable.services'),
      key: 'services',
      width: 200,
      render: (_, record: Clinic) =>
        record.services.length > 3 && (
          <Tag
            className='!border-0 !px-2.5 !py-1 !rounded-full text-xs font-medium shadow-sm'
            style={{
              backgroundColor: '#f1f5f9',
              color: '#475569',
              border: '1px solid #cbd5e1',
            }}
          >
            +{record.services.length - 3} more
          </Tag>
        ),
    },
    {
      title: t('clinicTable.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 140,
      align: 'center',
      render: (isActive: boolean) => (
        <div
          className={`px-3 py-1.5 rounded-full font-medium text-sm shadow-sm flex items-center justify-center ${
            isActive
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          {isActive ? (
            <>
              <CheckCircleOutlined className='text-green-600 mr-1 text-xs' />
              Active
            </>
          ) : (
            <>
              <ClockCircleOutlined className='text-slate-500 mr-1 text-xs' />
              Inactive
            </>
          )}
        </div>
      ),
    },
    {
      title: t('clinicTable.actions'),
      key: 'actions',
      width: 160,
      align: 'center',
      fixed: 'right' as const,
      render: (_, record: Clinic) => (
        <Space size='middle' className='p-1'>
          {/* View Details */}
          <Tooltip title={t('clinicTable.viewDetails')}>
            <Button
              type='text'
              icon={<EyeOutlined className='text-blue-500' />}
              size='small'
              className='hover:bg-blue-50 rounded-full p-2 transition-colors'
              onClick={() => onView && onView(record)}
              title={t('clinicTable.viewDetails')}
            />
          </Tooltip>

          {/* View Staff */}
          <Tooltip title={t('clinicTable.viewStaffVeterinarians')}>
            <Button
              type='text'
              icon={<TeamOutlined className='text-green-500' />}
              size='small'
              className='hover:bg-green-50 rounded-full p-2 transition-colors'
              onClick={() => onViewStaff && onViewStaff(record)}
              title={t('clinicTable.viewStaffVeterinarians')}
            />
          </Tooltip>

          {/* View Pet Cases */}
          <Tooltip title={t('clinicTable.viewPetCases')}>
            <Button
              type='text'
              icon={<HeartOutlined className='text-pink-500' />}
              size='small'
              className='hover:bg-pink-50 rounded-full p-2 transition-colors'
              onClick={() => handleViewPetCases(record)}
              title={t('clinicTable.viewPetCases')}
            />
          </Tooltip>

          {/* Edit */}
          <Tooltip title={t('clinicTable.editClinic')}>
            <Button
              type='text'
              icon={<EditOutlined className='text-orange-500' />}
              size='small'
              className='hover:bg-orange-50 rounded-full p-2 transition-colors'
              onClick={() => onEdit(record)}
              title={t('clinicTable.editClinic')}
            />
          </Tooltip>

          {/* Delete */}
          <Tooltip title={t('clinicTable.deleteClinic')}>
            <Button
              type='text'
              icon={<DeleteOutlined className='text-red-500' />}
              size='small'
              danger
              className='hover:bg-red-50 rounded-full p-2 transition-colors'
              onClick={() => onDelete(record.id)}
              title={t('clinicTable.deleteClinic')}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
      <Table
        columns={columns}
        dataSource={clinics}
        rowKey='id'
        loading={loading}
        pagination={pagination}
        rowSelection={rowSelection}
        onChange={onChange}
        className='clinic-table'
        scroll={{ x: 1400 }}
        rowClassName='hover:bg-slate-50 transition-colors duration-200'
        locale={{
          emptyText: (
            <div className='text-center py-12'>
              <MedicineBoxOutlined className='text-5xl text-slate-300 mb-4' />
              <div className='text-xl font-medium text-slate-500 mb-2'>No Clinics Found</div>
              <div className='text-slate-400'>No clinic data available at the moment</div>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default ClinicTable;

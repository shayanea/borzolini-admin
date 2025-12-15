import { BaseModal } from '@/components/common';
import type { Clinic, ClinicStaff, User } from '@/types';
import { Alert, Avatar, Empty, Table, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import ClinicsService from '@/services/clinics';
import type { ColumnsType } from 'antd/es/table';

interface ClinicStaffWithUser extends ClinicStaff {
  user?: User | null;
}

interface ClinicStaffModalProps {
  visible: boolean;
  clinic: Clinic | null;
  onClose: () => void;
}

const { Text } = Typography;

const roleColorMap: Record<ClinicStaff['role'], string> = {
  veterinarian: 'green',
  nurse: 'blue',
  receptionist: 'purple',
  technician: 'gold',
};

const ClinicStaffModal = ({ visible, clinic, onClose }: ClinicStaffModalProps) => {
  const [staff, setStaff] = useState<ClinicStaffWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!visible || !clinic) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await ClinicsService.getClinicStaff(clinic.id);
        setStaff(response.staff);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to load clinic staff';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [visible, clinic]);

  const columns: ColumnsType<ClinicStaffWithUser> = useMemo(
    () => [
      {
        title: 'Member',
        key: 'member',
        render: (_, record) => (
          <div className='flex items-center space-x-2'>
            <Avatar size={28} className='bg-primary-navy/10 text-primary-navy'>
              {record.user?.firstName?.[0]?.toUpperCase() || record.user?.id?.toUpperCase()}
            </Avatar>
            <div className='flex flex-col'>
              <Text
                className='text-text-primary'
                ellipsis={{
                  tooltip:
                    `${record.user?.firstName ?? ''} ${record.user?.lastName ?? ''}`.trim() ||
                    record.userId,
                }}
              >
                {(record.user && `${record.user.firstName} ${record.user.lastName}`.trim()) ||
                  record.userId}
              </Text>
              {record.user?.email && (
                <Text
                  className='text-text-secondary text-xs'
                  ellipsis={{ tooltip: record.user.email }}
                >
                  {record.user.email}
                </Text>
              )}
            </div>
          </div>
        ),
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (role: ClinicStaff['role']) => <Tag bordered={false} color={roleColorMap[role]}>{role}</Tag>,
      },
      {
        title: 'Specialization',
        dataIndex: 'specialization',
        key: 'specialization',
        render: (value?: string) =>
          value ? <Tag bordered={false} color='default'>{value}</Tag> : <Text type='secondary'>-</Text>,
      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        render: (isActive: boolean) => (
          <Tag bordered={false} color={isActive ? 'success' : 'default'}>{isActive ? 'Active' : 'Inactive'}</Tag>
        ),
      },
      {
        title: 'Joined',
        dataIndex: 'hire_date',
        key: 'hire_date',
        render: (value: string) => {
          if (!value) return <Text type='secondary'>-</Text>;
          const date = new Date(value);
          if (isNaN(date.getTime())) return <Text type='secondary'>Invalid Date</Text>;
          return date.toLocaleDateString();
        },
        sorter: (a, b) => {
          const dateA = new Date(a.joinedAt);
          const dateB = new Date(b.joinedAt);
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
          if (isNaN(dateA.getTime())) return 1;
          if (isNaN(dateB.getTime())) return -1;
          return dateA.getTime() - dateB.getTime();
        },
      },
    ],
    []
  );

  // Don't render the modal if clinic is null
  if (!clinic) {
    return null;
  }

  return (
    <BaseModal
      title={
        <div className='flex items-start justify-between'>
          <div className='flex flex-col'>
            <Text className='!mb-0 !text-text-primary text-lg font-semibold'>
              Clinic Staff & Veterinarians
            </Text>
            <Text className='text-text-secondary text-sm'>Clinic: {clinic.name}</Text>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      onOk={onClose}
      okText='Close'
      cancelButtonProps={{ style: { display: 'none' } }}
      className='admin-card'
      width={900}
      centered
      destroyOnHidden
      maskClosable
      styles={{ body: { paddingTop: 8, paddingBottom: 8 } }}
      style={{ maxWidth: '100%' }}
    >
      {error && <Alert type='error' message={error} showIcon className='mb-3' />}
      <div className='w-full'>
        <Table
          columns={columns}
          dataSource={staff}
          rowKey={row => `${row.userId}-${row.id}`}
          loading={loading}
          locale={{ emptyText: <Empty description='No staff found' /> }}
          pagination={{ pageSize: 8, position: ['bottomCenter'] }}
          size='small'
          scroll={{ x: true }}
        />
      </div>
    </BaseModal>
  );
};

export { ClinicStaffModal };
export default ClinicStaffModal;

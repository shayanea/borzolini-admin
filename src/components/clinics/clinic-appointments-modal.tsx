import { Alert, Empty, Modal, Table, Tag, Typography } from 'antd';
import type { Appointment, Clinic } from '@/types';
import { useEffect, useMemo, useState } from 'react';

import AppointmentsService from '@/services/appointments';
import type { ColumnsType } from 'antd/es/table';

interface ClinicAppointmentsModalProps {
  visible: boolean;
  clinic: Clinic | null;
  onClose: () => void;
}

const { Text } = Typography;

const ClinicAppointmentsModal = ({ visible, clinic, onClose }: ClinicAppointmentsModalProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!visible || !clinic) return;
      setLoading(true);
      setError(null);
      try {
        const data = await AppointmentsService.getByClinic(clinic.id);
        // Sort by scheduled_date desc to show latest first
        const sorted = [...data].sort(
          (a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime()
        );
        setAppointments(sorted);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to load appointments';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [visible, clinic]);

  const renderRowKey = (row: Appointment) => row.id;

  const columns: ColumnsType<Appointment> = useMemo(
    () => [
      {
        title: 'Scheduled',
        dataIndex: 'scheduled_date',
        key: 'scheduled_date',
        render: (value: string) => new Date(value).toLocaleString(),
      },
      {
        title: 'Type',
        dataIndex: 'appointment_type',
        key: 'appointment_type',
        render: (type: string) => <Tag bordered={false} color='blue'>{type}</Tag>,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
          <Tag bordered={false} color={status === 'completed' ? 'green' : status === 'cancelled' ? 'red' : 'gold'}>
            {status}
          </Tag>
        ),
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        render: (priority: string) => (
          <Tag bordered={false} color={priority === 'urgent' || priority === 'emergency' ? 'red' : 'default'}>
            {priority}
          </Tag>
        ),
      },
      {
        title: 'Telemedicine',
        dataIndex: 'is_telemedicine',
        key: 'is_telemedicine',
        render: (isTele: boolean) => (
          <Tag bordered={false} color={isTele ? 'purple' : 'default'}>{isTele ? 'Yes' : 'No'}</Tag>
        ),
      },
    ],
    []
  );

  return (
    <Modal
      title={
        <div className='flex items-start justify-between'>
          <div className='flex flex-col'>
            <Text className='!mb-0 !text-text-primary text-lg font-semibold'>
              Latest Appointments
            </Text>
            {clinic && <Text className='text-text-secondary text-sm'>Clinic: {clinic.name}</Text>}
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
          dataSource={appointments}
          rowKey={renderRowKey}
          loading={loading}
          locale={{ emptyText: <Empty description='No appointments found' /> }}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            position: ['bottomCenter'],
          }}
          size='small'
          scroll={{ x: true }}
        />
      </div>
    </Modal>
  );
};

export { ClinicAppointmentsModal };
export default ClinicAppointmentsModal;

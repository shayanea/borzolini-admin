import { Button, Dropdown, Modal, Space, Table, Tag, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  MessageOutlined,
  MoreOutlined,
} from '@ant-design/icons';

import type { ColumnsType } from 'antd/es/table';
import type { Contact } from '@/types';
import { useTranslation } from 'react-i18next';

interface ContactTableProps {
  contacts: Contact[];
  loading: boolean;
  onEdit: (contact: Contact) => void;
  onView: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Contact['status']) => void;
  onRespond: (contact: Contact) => void;
}

const getStatusColor = (status: Contact['status']) => {
  switch (status) {
    case 'pending':
      return 'orange';
    case 'in_progress':
      return 'blue';
    case 'resolved':
      return 'green';
    case 'closed':
      return 'gray';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: Contact['status']) => {
  switch (status) {
    case 'pending':
      return <ClockCircleOutlined />;
    case 'in_progress':
      return <ExclamationCircleOutlined />;
    case 'resolved':
      return <CheckCircleOutlined />;
    case 'closed':
      return <CloseCircleOutlined />;
    default:
      return null;
  }
};

export const ContactTable = ({
  contacts,
  loading,
  onEdit,
  onView,
  onDelete,
  onUpdateStatus,
  onRespond,
}: ContactTableProps) => {
  const { t } = useTranslation('components');

  const getStatusLabel = (status: Contact['status']) => {
    switch (status) {
      case 'pending':
        return t('contactTable.pending');
      case 'in_progress':
        return t('contactTable.inProgress');
      case 'resolved':
        return t('contactTable.resolved');
      case 'closed':
        return t('contactTable.closed');
      default:
        return status;
    }
  };

  const handleStatusChange = (id: string, status: Contact['status']) => {
    Modal.confirm({
      title: t('contactTable.updateStatus'),
      content: t('contactTable.confirmStatusChange', { status: getStatusLabel(status) }),
      onOk: () => onUpdateStatus(id, status),
    });
  };

  const columns: ColumnsType<Contact> = [
    {
      title: t('contactTable.name'),
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: string, record: Contact) => (
        <div>
          <div className='font-medium'>{text}</div>
          <div className='text-sm text-gray-500'>{record.email}</div>
        </div>
      ),
    },
    {
      title: t('contactTable.subject'),
      dataIndex: 'subject',
      key: 'subject',
      width: 200,
      ellipsis: true,
    },
    {
      title: t('contactTable.message'),
      dataIndex: 'message',
      key: 'message',
      width: 300,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: t('contactTable.status'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: Contact['status']) => (
        <Tag bordered={false} color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {getStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: t('contactTable.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('contactTable.actions'),
      key: 'actions',
      width: 120,
      render: (_, record: Contact) => (
        <Space size='small'>
          <Tooltip title={t('contactTable.viewDetails')}>
            <Button type='text' icon={<EyeOutlined />} onClick={() => onView(record)} />
          </Tooltip>
          <Tooltip title={t('contactTable.respond')}>
            <Button type='text' icon={<MessageOutlined />} onClick={() => onRespond(record)} />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  label: t('contactTable.edit'),
                  icon: <EditOutlined />,
                  onClick: () => onEdit(record),
                },
                {
                  key: 'status-pending',
                  label: t('contactTable.markAsPending'),
                  onClick: () => handleStatusChange(record.id, 'pending'),
                },
                {
                  key: 'status-in-progress',
                  label: t('contactTable.markAsInProgress'),
                  onClick: () => handleStatusChange(record.id, 'in_progress'),
                },
                {
                  key: 'status-resolved',
                  label: t('contactTable.markAsResolved'),
                  onClick: () => handleStatusChange(record.id, 'resolved'),
                },
                {
                  key: 'status-closed',
                  label: t('contactTable.markAsClosed'),
                  onClick: () => handleStatusChange(record.id, 'closed'),
                },
                {
                  type: 'divider',
                },
                {
                  key: 'delete',
                  label: t('contactTable.delete'),
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => onDelete(record.id),
                },
              ],
            }}
            trigger={['click']}
          >
            <Button type='text' icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className='contact-table'>
      <Table
        columns={columns}
        dataSource={contacts}
        loading={loading}
        rowKey='id'
        pagination={false}
        scroll={{ x: 1000 }}
        size='small'
      />
    </div>
  );
};

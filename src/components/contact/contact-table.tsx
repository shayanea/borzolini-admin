import { Button, Space, Tag, Tooltip, Dropdown, Modal, Table } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  MoreOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Contact } from '@/types';

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
  const handleStatusChange = (id: string, status: Contact['status']) => {
    Modal.confirm({
      title: 'Update Status',
      content: `Are you sure you want to change the status to ${status}?`,
      onOk: () => onUpdateStatus(id, status),
    });
  };

  const columns: ColumnsType<Contact> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: string, record: Contact) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Message',
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: Contact['status']) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record: Contact) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Respond">
            <Button
              type="text"
              icon={<MessageOutlined />}
              onClick={() => onRespond(record)}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  label: 'Edit',
                  icon: <EditOutlined />,
                  onClick: () => onEdit(record),
                },
                {
                  key: 'status-pending',
                  label: 'Mark as Pending',
                  onClick: () => handleStatusChange(record.id, 'pending'),
                },
                {
                  key: 'status-in-progress',
                  label: 'Mark as In Progress',
                  onClick: () => handleStatusChange(record.id, 'in_progress'),
                },
                {
                  key: 'status-resolved',
                  label: 'Mark as Resolved',
                  onClick: () => handleStatusChange(record.id, 'resolved'),
                },
                {
                  key: 'status-closed',
                  label: 'Mark as Closed',
                  onClick: () => handleStatusChange(record.id, 'closed'),
                },
                {
                  type: 'divider',
                },
                {
                  key: 'delete',
                  label: 'Delete',
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => onDelete(record.id),
                },
              ],
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="contact-table">
      <Table
        columns={columns}
        dataSource={contacts}
        loading={loading}
        rowKey="id"
        pagination={false}
        scroll={{ x: 1000 }}
        size="small"
      />
    </div>
  );
};

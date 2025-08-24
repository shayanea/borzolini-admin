import React from 'react';
import { Card, Space } from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const QuickActions: React.FC = () => {
  const handleNewAppointment = () => {
    // TODO: Navigate to new appointment form
  };

  const handleAddPatient = () => {
    // TODO: Navigate to add patient form
  };

  const handleAddClinic = () => {
    // TODO: Navigate to add clinic form
  };

  const handleManageStaff = () => {
    // TODO: Navigate to manage staff page
  };

  const actions = [
    {
      icon: <CalendarOutlined className="text-white" />,
      title: 'New Appointment',
      description: 'Schedule a new visit',
      bgColor: 'bg-primary-navy',
      onClick: handleNewAppointment,
    },
    {
      icon: <UserOutlined className="text-white" />,
      title: 'Add Patient',
      description: 'Register new patient',
      bgColor: 'bg-primary-orange',
      onClick: handleAddPatient,
    },
    {
      icon: <HomeOutlined className="text-white" />,
      title: 'Add Clinic',
      description: 'Register new clinic',
      bgColor: 'bg-health-excellent',
      onClick: handleAddClinic,
    },
    {
      icon: <TeamOutlined className="text-white" />,
      title: 'Manage Staff',
      description: 'Update team members',
      bgColor: 'bg-purple-500',
      onClick: handleManageStaff,
    },
  ];

  return (
    <Card title="Quick Actions" className="admin-card">
      <Space direction="vertical" className="w-full" size="middle">
        {actions.map((action, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-navy cursor-pointer transition-colors"
            onClick={action.onClick}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center`}>
                {action.icon}
              </div>
              <div>
                <div className="font-medium text-text-primary">{action.title}</div>
                <div className="text-sm text-text-light">{action.description}</div>
              </div>
            </div>
          </div>
        ))}
      </Space>
    </Card>
  );
};

export default QuickActions;

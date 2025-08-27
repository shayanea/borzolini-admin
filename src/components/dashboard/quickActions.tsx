import React from 'react';
import { Card, Space } from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  HomeOutlined,
} from '@ant-design/icons';

const QuickActions = () => {
  const handleNewAppointment = () => {
    // TODO: Navigate to new appointment form
  };

  const handleAddPatient = () => {
    // TODO: Navigate to add patient form
  };

  const handleAddClinic = () => {
    // TODO: Navigate to add clinic form
  };

  const actions = [
    {
      icon: <CalendarOutlined className="text-white text-lg" />,
      title: 'New Appointment',
      description: 'Schedule a new visit',
      bgColor: 'bg-primary-navy',
      onClick: handleNewAppointment,
    },
    {
      icon: <UserOutlined className="text-white text-lg" />,
      title: 'Add Patient',
      description: 'Register new patient',
      bgColor: 'bg-primary-orange',
      onClick: handleAddPatient,
    },
    {
      icon: <HomeOutlined className="text-white text-lg" />,
      title: 'Add Clinic',
      description: 'Register new clinic',
      bgColor: 'bg-health-excellent',
      onClick: handleAddClinic,
    },
  ];

  return (
    <Card title="Quick Actions" className="admin-card border-0 shadow-sm">
      <Space direction="vertical" className="w-full" size="middle">
        {actions.map((action, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-navy hover:shadow-md cursor-pointer transition-all duration-200 bg-white"
            onClick={action.onClick}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center shadow-sm`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-text-primary text-base">{action.title}</div>
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

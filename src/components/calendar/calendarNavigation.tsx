import React from 'react';
import { Button, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { CalendarNavigationProps } from '@/types/calendar';

const { Title } = Typography;

const CalendarNavigation = ({
  currentDate,
  onPreviousDay,
  onNextDay,
  onToday,
}) => {
  return (
    <div className='flex items-center justify-between mb-6'>
      <div className='flex items-center space-x-4'>
        <Button icon={<LeftOutlined />} onClick={onPreviousDay} className='border-gray-300' />
        <Title level={3} className='!mb-0'>
          {currentDate.format('MMMM D, YYYY')}
        </Title>
        <Button icon={<RightOutlined />} onClick={onNextDay} className='border-gray-300' />
        <Button onClick={onToday} className='text-primary-navy border-primary-navy'>
          Today
        </Button>
      </div>
    </div>
  );
};

export default CalendarNavigation;

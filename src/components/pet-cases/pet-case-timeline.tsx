// Pet Case Timeline Component
import {
  AlertOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Select, Space, Timeline, message } from 'antd';
import React, { useState } from 'react';

import dayjs from 'dayjs';
import { useCaseTimeline } from '../../hooks/use-pet-cases';
import { TimelineEventType } from '../../types/pet-cases';

const { Option } = Select;
const { TextArea } = Input;

interface PetCaseTimelineProps {
  caseId: string;
  clinicId: string;
}

interface AddEventFormData {
  event_type: TimelineEventType;
  title: string;
  description: string;
  metadata?: string;
}

const PetCaseTimeline: React.FC<PetCaseTimelineProps> = ({ caseId, clinicId }) => {
  const { timeline, isLoading, addEvent, isAddingEvent } = useCaseTimeline(clinicId, caseId);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm<AddEventFormData>();

  const getEventIcon = (eventType: TimelineEventType) => {
    switch (eventType) {
      case 'case_created':
        return <FileTextOutlined />;
      case 'symptoms_updated':
        return <AlertOutlined />;
      case 'vital_signs_recorded':
        return <HeartOutlined />;
      case 'consultation_scheduled':
      case 'consultation_completed':
        return <UserOutlined />;
      case 'visit_scheduled':
      case 'visit_completed':
        return <ClockCircleOutlined />;
      case 'diagnosis_made':
      case 'treatment_prescribed':
        return <MedicineBoxOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getEventColor = (eventType: TimelineEventType) => {
    switch (eventType) {
      case 'case_created':
        return 'green';
      case 'diagnosis_made':
      case 'treatment_prescribed':
        return 'blue';
      case 'consultation_completed':
      case 'visit_completed':
        return 'green';
      case 'case_resolved':
      case 'case_closed':
        return 'green';
      case 'case_escalated':
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatEventType = (eventType: TimelineEventType) => {
    return eventType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleAddEvent = async (values: AddEventFormData) => {
    try {
      await addEvent({
        event_type: values.event_type,
        title: values.title,
        description: values.description,
        ...(values.metadata && { metadata: JSON.parse(values.metadata) }),
      });
      setIsModalVisible(false);
      form.resetFields();
      message.success('Timeline event added successfully');
    } catch (error) {
      message.error('Failed to add timeline event');
    }
  };

  const timelineItems = timeline.map((event: any) => ({
    color: getEventColor(event.event_type),
    dot: getEventIcon(event.event_type),
    children: (
      <div className='ml-4'>
        <div className='flex items-center justify-between mb-2'>
          <h4 className='font-medium text-gray-900'>{event.title}</h4>
          <span className='text-sm text-gray-500'>
            {dayjs(event.timestamp).format('MMM DD, YYYY HH:mm')}
          </span>
        </div>
        <p className='text-gray-700 mb-2'>{event.description}</p>
        <div className='flex items-center space-x-4 text-xs text-gray-500'>
          <span>Type: {formatEventType(event.event_type)}</span>
          {event.user_name && <span>By: {event.user_name}</span>}
        </div>
        {event.metadata && Object.keys(event.metadata).length > 0 && (
          <div className='mt-2 p-2 bg-gray-50 rounded text-xs'>
            <strong>Additional Details:</strong>
            <pre className='mt-1 text-gray-600 whitespace-pre-wrap'>
              {JSON.stringify(event.metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    ),
  }));

  return (
    <Card
      title='Case Timeline'
      extra={
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          size='small'
        >
          Add Event
        </Button>
      }
      loading={isLoading}
    >
      {timeline.length > 0 ? (
        <Timeline items={timelineItems} mode='left' />
      ) : (
        <div className='text-center py-8 text-gray-500'>
          <ClockCircleOutlined className='text-4xl mb-4' />
          <p>No timeline events yet</p>
          <p className='text-sm'>Case activity will appear here as events occur</p>
        </div>
      )}

      {/* Add Event Modal */}
      <Modal
        title='Add Timeline Event'
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout='vertical' onFinish={handleAddEvent}>
          <Form.Item
            label='Event Type'
            name='event_type'
            rules={[{ required: true, message: 'Please select an event type' }]}
          >
            <Select placeholder='Select event type'>
              <Option value='note_added'>Note Added</Option>
              <Option value='symptoms_updated'>Symptoms Updated</Option>
              <Option value='vital_signs_recorded'>Vital Signs Recorded</Option>
              <Option value='follow_up_scheduled'>Follow-up Scheduled</Option>
              <Option value='ai_insight_generated'>AI Insight Generated</Option>
              <Option value='status_changed'>Status Changed</Option>
              <Option value='priority_changed'>Priority Changed</Option>
              <Option value='file_attached'>File Attached</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label='Title'
            name='title'
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder='Brief title for the event' />
          </Form.Item>

          <Form.Item
            label='Description'
            name='description'
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea rows={4} placeholder='Detailed description of the event' />
          </Form.Item>

          <Form.Item
            label='Additional Metadata (JSON)'
            name='metadata'
            help='Optional JSON data for additional event details'
          >
            <TextArea rows={3} placeholder='{"key": "value"}' />
          </Form.Item>

          <Form.Item className='mb-0 text-right'>
            <Space>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type='primary' htmlType='submit' loading={isAddingEvent}>
                Add Event
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default PetCaseTimeline;

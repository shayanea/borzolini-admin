import { Checkbox, DatePicker, Form, InputNumber, Select, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { FC } from 'react';

import { SchedulingSectionProps } from './types';

const { Option } = Select;

export const SchedulingSection: FC<SchedulingSectionProps> = ({
	priorities,
	statuses
}) => {
	return (
		<div className='space-y-4'>
			<Form.Item
				label='Date'
				name='scheduled_date'
				rules={[{ required: true, message: 'Please select date' }]}
			>
				<DatePicker
					className='w-full'
					format='YYYY-MM-DD'
					disabledDate={current => current && current < dayjs().startOf('day')}
				/>
			</Form.Item>

			<Form.Item
				label='Time'
				name='scheduled_time'
				rules={[{ required: true, message: 'Please select time' }]}
			>
				<TimePicker className='w-full' format='HH:mm' minuteStep={15} showNow={false} />
			</Form.Item>

			<Form.Item label='Duration (minutes)' name='duration_minutes'>
				<InputNumber className='w-full' min={15} max={480} step={15} placeholder='30' />
			</Form.Item>

			<Form.Item label='Priority' name='priority'>
				<Select placeholder='Select priority'>
					{priorities.map(priority => (
						<Option key={priority.value} value={priority.value}>
							{priority.label}
						</Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item label='Status' name='status'>
				<Select placeholder='Select status'>
					{statuses.map(status => (
						<Option key={status.value} value={status.value}>
							{status.label}
						</Option>
					))}
				</Select>
			</Form.Item>

			<div className='pt-2 border-t border-gray-100'>
				<h4 className='mb-3 text-sm font-medium'>Reminder Settings</h4>
				<div className='flex flex-wrap gap-4 mb-4'>
					<Form.Item name={['reminder_settings', 'email_reminder']} valuePropName='checked' noStyle>
						<Checkbox>Email</Checkbox>
					</Form.Item>
					<Form.Item name={['reminder_settings', 'sms_reminder']} valuePropName='checked' noStyle>
						<Checkbox>SMS</Checkbox>
					</Form.Item>
					<Form.Item name={['reminder_settings', 'push_reminder']} valuePropName='checked' noStyle>
						<Checkbox>Push Notification</Checkbox>
					</Form.Item>
				</div>

				<Form.Item
					label='Remind Before (Hours)'
					name={['reminder_settings', 'reminder_hours_before']}
					help='How many hours before the appointment to send reminders'
				>
					<InputNumber className='w-full' min={1} max={72} step={1} />
				</Form.Item>
			</div>
		</div>
	);
};

export default SchedulingSection;

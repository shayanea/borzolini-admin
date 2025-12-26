import type { CreateFAQDto, FAQ, UpdateFAQDto } from '@/types';
import { Form, Input, InputNumber, Modal, Switch } from 'antd';
import { useEffect } from 'react';

const { TextArea } = Input;

interface FAQFormModalProps {
	visible: boolean;
	faq: FAQ | null;
	onSubmit: (data: CreateFAQDto | UpdateFAQDto) => Promise<void>;
	onCancel: () => void;
	loading?: boolean;
}

export const FAQFormModal = ({ visible, faq, onSubmit, onCancel, loading }: FAQFormModalProps) => {
	const [form] = Form.useForm();
	const isEdit = !!faq;

	useEffect(() => {
		if (visible && faq) {
			form.setFieldsValue({
				question: faq.question,
				answer: faq.answer,
				category: faq.category,
				order: faq.order,
				is_active: faq.is_active,
			});
		} else if (visible) {
			form.resetFields();
			form.setFieldsValue({
				is_active: true,
				order: 0,
			});
		}
	}, [visible, faq, form]);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			await onSubmit(values);
			form.resetFields();
		} catch (error) {
			console.error('Form validation failed:', error);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		onCancel();
	};

	return (
		<Modal
			title={isEdit ? 'Edit FAQ' : 'Create FAQ'}
			open={visible}
			onOk={handleSubmit}
			onCancel={handleCancel}
			confirmLoading={loading}
			width={700}
			okText={isEdit ? 'Update' : 'Create'}
			cancelText="Cancel"
		>
			<Form form={form} layout="vertical" className="mt-4">
				<Form.Item
					name="question"
					label="Question"
					rules={[
						{ required: true, message: 'Please enter the question' },
						{ min: 5, message: 'Question must be at least 5 characters' },
					]}
				>
					<Input placeholder="Enter the FAQ question" size="large" />
				</Form.Item>

				<Form.Item
					name="answer"
					label="Answer"
					rules={[
						{ required: true, message: 'Please enter the answer' },
						{ min: 10, message: 'Answer must be at least 10 characters' },
					]}
				>
					<TextArea
						placeholder="Enter the FAQ answer"
						rows={6}
						size="large"
						showCount
						maxLength={1000}
					/>
				</Form.Item>

				<Form.Item
					name="category"
					label="Category"
					rules={[{ required: false }]}
				>
					<Input placeholder="e.g., General, Appointments, Billing" size="large" />
				</Form.Item>

				<Form.Item
					name="order"
					label="Display Order"
					rules={[{ required: false }]}
					tooltip="Lower numbers appear first"
				>
					<InputNumber
						placeholder="0"
						min={0}
						max={9999}
						size="large"
						style={{ width: '100%' }}
					/>
				</Form.Item>

				<Form.Item name="is_active" label="Active" valuePropName="checked">
					<Switch checkedChildren="Active" unCheckedChildren="Inactive" />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FAQFormModal;

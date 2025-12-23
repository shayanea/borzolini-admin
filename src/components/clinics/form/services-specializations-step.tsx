import { Card, Col, Form, Row, Select } from 'antd';
import { FC } from 'react';

interface ServicesSpecializationsStepProps {
	serviceOptions: string[];
	specializationOptions: string[];
	insuranceProviderOptions: string[];
	paymentMethodOptions: string[];
}

const ServicesSpecializationsStep: FC<ServicesSpecializationsStepProps> = ({
	serviceOptions,
	specializationOptions,
	insuranceProviderOptions,
	paymentMethodOptions,
}) => {
	return (
		<Card title='Services, Specializations & Payment' className='mb-6'>
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item name='services' label='Services Offered'>
						<Select
							mode='multiple'
							placeholder='Select services offered'
							options={serviceOptions.map(service => ({ label: service, value: service }))}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name='specializations' label='Specializations'>
						<Select
							mode='multiple'
							placeholder='Select specializations'
							options={specializationOptions.map(spec => ({ label: spec, value: spec }))}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={12}>
					<Form.Item name='insurance_providers' label='Accepted Insurance Providers'>
						<Select
							mode='multiple'
							placeholder='Select accepted insurance providers'
							options={insuranceProviderOptions.map(provider => ({ label: provider, value: provider }))}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name='payment_methods' label='Payment Methods'>
						<Select
							mode='multiple'
							placeholder='Select accepted payment methods'
							options={paymentMethodOptions.map(method => ({ label: method, value: method }))}
						/>
					</Form.Item>
				</Col>
			</Row>
		</Card>
	);
};

export { ServicesSpecializationsStep };
export default ServicesSpecializationsStep;

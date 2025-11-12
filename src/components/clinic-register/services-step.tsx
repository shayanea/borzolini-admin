import { Form, Select, Typography, Tag, Space } from 'antd';
import { MedicineBoxOutlined, HeartOutlined, StarOutlined } from '@ant-design/icons';
import { SERVICE_OPTIONS, SPECIALIZATION_OPTIONS } from './constants';

const { Title, Text, Paragraph } = Typography;

export const ServicesStep: React.FC = () => {
  return (
    <div className='space-y-8'>
      {/* Section Header */}
      <div className='border-l-4 border-indigo-500 pl-4'>
        <Title level={3} className='!mb-1'>
          Services & Specializations
        </Title>
        <Text type='secondary'>
          Let pet owners know what services you offer and your areas of expertise. This helps them
          find the right care for their pets.
        </Text>
      </div>

      {/* Services Section */}
      <div className='space-y-6'>
        <div className='bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100'>
          <div className='mb-4'>
            <Title level={5} className='!mb-2 flex items-center gap-2'>
              <MedicineBoxOutlined className='text-blue-500' />
              Services Offered
            </Title>
            <Paragraph type='secondary' className='!mb-4'>
              Select all the services your clinic provides to help pet owners understand your
              capabilities.
            </Paragraph>
          </div>

          <Form.Item
            name='services'
            label={<span className='text-base font-medium'>Available Services</span>}
            extra={
              <Space size={4} wrap className='mt-2'>
                <Text type='secondary' className='text-xs'>Popular choices:</Text>
                <Tag color='blue'>Vaccinations</Tag>
                <Tag color='blue'>Surgery</Tag>
                <Tag color='blue'>Wellness Exams</Tag>
                <Tag color='blue'>Emergency Care</Tag>
              </Space>
            }
          >
            <Select
              mode='multiple'
              placeholder='Select all services your clinic offers...'
              size='large'
              className='rounded-lg'
              options={SERVICE_OPTIONS.map(service => ({ 
                label: service, 
                value: service,
              }))}
              maxTagCount='responsive'
              showSearch
              optionFilterProp='label'
            />
          </Form.Item>
        </div>

        {/* Specializations Section */}
        <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100'>
          <div className='mb-4'>
            <Title level={5} className='!mb-2 flex items-center gap-2'>
              <StarOutlined className='text-purple-500' />
              Specializations
            </Title>
            <Paragraph type='secondary' className='!mb-4'>
              Highlight your clinic's specialized areas of veterinary medicine to attract specific
              cases.
            </Paragraph>
          </div>

          <Form.Item
            name='specializations'
            label={<span className='text-base font-medium'>Areas of Expertise</span>}
            extra={
              <Space size={4} wrap className='mt-2'>
                <Text type='secondary' className='text-xs'>Common specializations:</Text>
                <Tag color='purple'>Feline Medicine</Tag>
                <Tag color='purple'>Canine Medicine</Tag>
                <Tag color='purple'>Surgery</Tag>
                <Tag color='purple'>Emergency Medicine</Tag>
              </Space>
            }
          >
            <Select
              mode='multiple'
              placeholder='Select your clinic specializations...'
              size='large'
              className='rounded-lg'
              options={SPECIALIZATION_OPTIONS.map(spec => ({ 
                label: spec, 
                value: spec,
              }))}
              maxTagCount='responsive'
              showSearch
              optionFilterProp='label'
            />
          </Form.Item>
        </div>

        {/* Info Card */}
        <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100'>
          <div className='flex items-start gap-3'>
            <HeartOutlined className='text-2xl text-green-500 mt-1' />
            <div>
              <Title level={5} className='!mb-2 text-green-800'>
                Why this matters
              </Title>
              <Paragraph type='secondary' className='!mb-0'>
                Services and specializations help pet owners quickly understand if your clinic can
                meet their pet's needs. The more specific you are, the better we can match you with
                the right clients.
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Card, Col, Row, Space } from 'antd';

import { DownloadOutlined } from '@ant-design/icons';
import type { ReportCategoriesProps } from '@/types/reports';

const ReportCategories = ({ categories }: ReportCategoriesProps) => {
  return (
    <Row gutter={[24, 24]}>
      {categories.map(category => (
        <Col xs={24} lg={12} key={category.title}>
          <Card title={category.title} className='admin-card'>
            <Space direction='vertical' className='w-full' size='middle'>
              {category.reports.map(report => (
                <div
                  key={report.title}
                  className='p-4 border border-gray-200 rounded-lg hover:border-primary-navy cursor-pointer transition-colors'
                  onClick={report.onClick}
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='font-medium'>{report.title}</div>
                      <div className='text-sm text-text-light'>{report.description}</div>
                    </div>
                    <DownloadOutlined className='text-primary-navy' />
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export { ReportCategories };
export default ReportCategories;

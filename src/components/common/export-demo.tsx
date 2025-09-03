import { Card, Space, Typography } from 'antd';
import { ExportButton } from './export-button';

const { Title, Text } = Typography;

/**
 * Demo component showing how to use the ExportButton
 * This can be used as a reference for implementing export functionality
 */
export const ExportDemo: React.FC = () => {
  // Example export functions - these would typically come from your service layer
  const handleExportCSV = async (): Promise<Blob> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create a sample CSV blob
    const csvContent =
      'Name,Email,Role,Status\nJohn Doe,john@example.com,Admin,Active\nJane Smith,jane@example.com,User,Active';
    return new Blob([csvContent], { type: 'text/csv' });
  };

  const handleExportExcel = async (): Promise<Blob> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create a sample Excel blob (simplified)
    const excelContent =
      'Name\tEmail\tRole\tStatus\nJohn Doe\tjohn@example.com\tAdmin\tActive\nJane Smith\tjane@example.com\tUser\tActive';
    return new Blob([excelContent], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  };

  const sampleFilters = {
    search: 'john',
    role: 'admin',
    isActive: true,
    date_from: '2024-01-01',
    date_to: '2024-12-31',
  };

  return (
    <Card title='Export Functionality Demo' className='mb-6'>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <div>
          <Title level={4}>Basic Export Button</Title>
          <Text type='secondary'>Simple export button with CSV and Excel options</Text>
          <div className='mt-2'>
            <ExportButton
              entityType='users'
              exportCSV={handleExportCSV}
              exportExcel={handleExportExcel}
            />
          </div>
        </div>

        <div>
          <Title level={4}>Export with Filters</Title>
          <Text type='secondary'>
            Export button showing applied filters and estimated record count
          </Text>
          <div className='mt-2'>
            <ExportButton
              entityType='users'
              exportCSV={handleExportCSV}
              exportExcel={handleExportExcel}
              filters={sampleFilters}
              estimatedRecordCount={1250}
            />
          </div>
        </div>

        <div>
          <Title level={4}>Large Dataset Export</Title>
          <Text type='secondary'>Export button with confirmation for large datasets</Text>
          <div className='mt-2'>
            <ExportButton
              entityType='appointments'
              exportCSV={handleExportCSV}
              exportExcel={handleExportExcel}
              filters={{ status: 'completed' }}
              estimatedRecordCount={15000}
              showConfirmation={true}
              maxRecordsWithoutConfirmation={1000}
            />
          </div>
        </div>

        <div>
          <Title level={4}>Custom Styled Export</Title>
          <Text type='secondary'>Export button with custom styling and text</Text>
          <div className='mt-2'>
            <ExportButton
              entityType='clinics'
              exportCSV={handleExportCSV}
              exportExcel={handleExportExcel}
              buttonText='Download Data'
              type='primary'
              size='large'
            />
          </div>
        </div>
      </Space>
    </Card>
  );
};

export default ExportDemo;

import { generateExportFilename, handleExport } from '@/utils/export.utils';
import { DownloadOutlined, FileExcelOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Dropdown, Modal, Space, Typography, message } from 'antd';

import type { MenuProps } from 'antd';
import { useState } from 'react';

const { Text } = Typography;

export interface ExportButtonProps {
  /** The type of entity being exported (e.g., 'clinics', 'users', 'pets', 'appointments') */
  entityType: string;
  /** The export function for CSV format */
  exportCSV: () => Promise<Blob>;
  /** The export function for Excel format */
  exportExcel: () => Promise<Blob>;
  /** Current filters applied to the data */
  filters?: Record<string, unknown>;
  /** Whether the export button is disabled */
  disabled?: boolean;
  /** Custom loading state */
  loading?: boolean;
  /** Button size */
  size?: 'small' | 'middle' | 'large';
  /** Button type */
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  /** Custom button text */
  buttonText?: string;
  /** Show confirmation modal for large exports */
  showConfirmation?: boolean;
  /** Maximum records before showing confirmation */
  maxRecordsWithoutConfirmation?: number;
  /** Estimated record count */
  estimatedRecordCount?: number;
}

export function ExportButton({
  entityType,
  exportCSV,
  exportExcel,
  filters = {},
  disabled = false,
  loading = false,
  size = 'middle',
  type = 'default',
  buttonText = 'Export',
  showConfirmation = true,
  maxRecordsWithoutConfirmation = 1000,
  estimatedRecordCount = 0,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | null>(null);

  const handleExportClick = async (format: 'csv' | 'xlsx') => {
    if (showConfirmation && estimatedRecordCount > maxRecordsWithoutConfirmation) {
      setExportFormat(format);
      return;
    }

    await performExport(format);
  };

  const performExport = async (format: 'csv' | 'xlsx') => {
    const exportFunction = format === 'csv' ? exportCSV : exportExcel;
    const filename = generateExportFilename(entityType, format, filters);

    await handleExport(
      exportFunction,
      filename,
      () => {
        setIsExporting(true);
        message.loading({
          content: `Exporting ${entityType} to ${format.toUpperCase()}...`,
          key: 'export',
        });
      },
      () => {
        setIsExporting(false);
        message.success({ content: `Export completed successfully!`, key: 'export' });
      },
      error => {
        setIsExporting(false);
        message.error({ content: `Export failed: ${error.message}`, key: 'export' });
      }
    );
  };

  const handleConfirmExport = () => {
    if (exportFormat) {
      performExport(exportFormat);
      setExportFormat(null);
    }
  };

  const handleCancelExport = () => {
    setExportFormat(null);
  };

  const items: MenuProps['items'] = [
    {
      key: 'csv',
      label: 'Export as CSV',
      icon: <FileTextOutlined />,
      onClick: () => handleExportClick('csv'),
    },
    {
      key: 'excel',
      label: 'Export as Excel',
      icon: <FileExcelOutlined />,
      onClick: () => handleExportClick('xlsx'),
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} trigger={['click']} disabled={disabled || isExporting || loading}>
        <Button
          type={type}
          size={size}
          loading={isExporting || loading}
          icon={<DownloadOutlined />}
        >
          {buttonText}
        </Button>
      </Dropdown>

      <Modal
        title='Confirm Export'
        open={!!exportFormat}
        onOk={handleConfirmExport}
        onCancel={handleCancelExport}
        okText='Export'
        cancelText='Cancel'
        okButtonProps={{ loading: isExporting }}
      >
        <Space direction='vertical' style={{ width: '100%' }}>
          <Text>
            You are about to export <strong>{estimatedRecordCount.toLocaleString()}</strong>{' '}
            {entityType} records to <strong>{exportFormat?.toUpperCase()}</strong> format.
          </Text>

          {estimatedRecordCount > 5000 && (
            <Text type='warning'>
              ⚠️ Large exports may take several minutes to complete. Please be patient.
            </Text>
          )}

          {filters && Object.keys(filters).length > 0 && (
            <div>
              <Text strong>Applied filters:</Text>
              <br />
              <Text type='secondary'>
                {Object.entries(filters)
                  .filter(([, value]) => value !== undefined && value !== null && value !== '')
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ')}
              </Text>
            </div>
          )}
        </Space>
      </Modal>
    </>
  );
}

export default ExportButton;

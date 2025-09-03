/**
 * Utility functions for handling file exports and downloads
 */

/**
 * Downloads a blob as a file with the specified filename
 * @param blob - The blob data to download
 * @param filename - The name of the file to download
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Generates a filename with timestamp for exports
 * @param entityType - The type of entity being exported (e.g., 'clinics', 'users')
 * @param format - The file format (e.g., 'csv', 'xlsx')
 * @param filters - Optional filters to include in filename
 * @returns A formatted filename
 */
export const generateExportFilename = (
  entityType: string,
  format: 'csv' | 'xlsx',
  filters?: Record<string, any>
): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  const extension = format === 'csv' ? 'csv' : 'xlsx';

  let filename = `${entityType}_export_${timestamp}`;

  // Add filter information to filename if provided
  if (filters) {
    const filterParts: string[] = [];

    if (filters.search) filterParts.push(`search-${filters.search}`);
    if (filters.role) filterParts.push(`role-${filters.role}`);
    if (filters.status) filterParts.push(`status-${filters.status}`);
    if (filters.species) filterParts.push(`species-${filters.species}`);
    if (filters.city) filterParts.push(`city-${filters.city}`);
    if (filters.isActive !== undefined) filterParts.push(`active-${filters.isActive}`);
    if (filters.date_from && filters.date_to) {
      filterParts.push(`date-${filters.date_from}_to_${filters.date_to}`);
    }

    if (filterParts.length > 0) {
      filename += `_${filterParts.join('_')}`;
    }
  }

  return `${filename}.${extension}`;
};

/**
 * Handles export with loading state and error handling
 * @param exportFunction - The async function that returns a blob
 * @param filename - The filename for the download
 * @param onStart - Optional callback when export starts
 * @param onSuccess - Optional callback when export succeeds
 * @param onError - Optional callback when export fails
 */
export const handleExport = async (
  exportFunction: () => Promise<Blob>,
  filename: string,
  onStart?: () => void,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<void> => {
  try {
    onStart?.();

    const blob = await exportFunction();
    downloadBlob(blob, filename);

    onSuccess?.();
  } catch (error) {
    const errorMessage = error instanceof Error ? error : new Error('Export failed');
    onError?.(errorMessage);
    throw errorMessage;
  }
};

/**
 * Formats filter values for display in UI
 * @param filters - The filter object
 * @returns A formatted string of active filters
 */
export const formatActiveFilters = (filters: Record<string, any>): string => {
  const activeFilters: string[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          activeFilters.push(`${key}: ${value.join(', ')}`);
        }
      } else {
        activeFilters.push(`${key}: ${value}`);
      }
    }
  });

  return activeFilters.join(', ');
};

/**
 * Validates export parameters
 * @param params - The export parameters
 * @returns True if parameters are valid
 */
export const validateExportParams = (params: Record<string, any>): boolean => {
  // Check for reasonable limits
  if (params.limit && (params.limit < 1 || params.limit > 50000)) {
    return false;
  }

  // Check date ranges
  if (params.date_from && params.date_to) {
    const fromDate = new Date(params.date_from);
    const toDate = new Date(params.date_to);

    if (fromDate > toDate) {
      return false;
    }

    // Check if date range is not too large (more than 1 year)
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 365) {
      return false;
    }
  }

  return true;
};

/**
 * Gets the appropriate MIME type for the export format
 * @param format - The export format
 * @returns The MIME type
 */
export const getMimeType = (format: 'csv' | 'xlsx'): string => {
  return format === 'csv'
    ? 'text/csv'
    : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
};

/**
 * Estimates the file size based on record count and format
 * @param recordCount - Number of records
 * @param format - Export format
 * @returns Estimated file size in bytes
 */
export const estimateFileSize = (recordCount: number, format: 'csv' | 'xlsx'): number => {
  // Rough estimates based on average record sizes
  const avgRecordSize = format === 'csv' ? 200 : 300; // bytes per record
  const overhead = format === 'csv' ? 100 : 2000; // file overhead

  return recordCount * avgRecordSize + overhead;
};

/**
 * Formats file size for display
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

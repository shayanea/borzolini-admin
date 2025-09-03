# Export Functionality - Admin Frontend

This document describes the export functionality implemented in the admin frontend, which allows users to export data from various entities (clinics, users, pets, appointments) in CSV and Excel formats.

## Overview

The export functionality provides:

- **Multiple Formats**: Support for both CSV and Excel (.xlsx) export formats
- **Comprehensive Filtering**: All existing filter options are available for exports
- **Role-Based Access**: Different access levels based on user roles
- **Large Dataset Support**: Optimized for exporting large amounts of data with confirmation dialogs
- **User-Friendly Interface**: Intuitive export buttons with loading states and progress feedback

## Components

### 1. ExportButton Component

The main export component that provides a dropdown menu with CSV and Excel export options.

**Location**: `src/components/common/export-button.tsx`

**Props**:

```typescript
interface ExportButtonProps {
  entityType: string; // Type of entity (e.g., 'clinics', 'users')
  exportCSV: () => Promise<Blob>; // Function to export CSV data
  exportExcel: () => Promise<Blob>; // Function to export Excel data
  filters?: Record<string, any>; // Current filters applied
  disabled?: boolean; // Whether button is disabled
  loading?: boolean; // Custom loading state
  size?: 'small' | 'middle' | 'large'; // Button size
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'; // Button type
  buttonText?: string; // Custom button text
  showConfirmation?: boolean; // Show confirmation for large exports
  maxRecordsWithoutConfirmation?: number; // Max records before confirmation
  estimatedRecordCount?: number; // Estimated number of records
}
```

**Usage Example**:

```tsx
import { ExportButton } from '@/components/common';

<ExportButton
  entityType='clinics'
  exportCSV={handleExportCSV}
  exportExcel={handleExportExcel}
  filters={{ search: 'veterinary', city: 'New York' }}
  estimatedRecordCount={500}
/>;
```

### 2. Export Utilities

Utility functions for handling file downloads and export operations.

**Location**: `src/utils/export.utils.ts`

**Key Functions**:

- `downloadBlob(blob: Blob, filename: string)`: Downloads a blob as a file
- `generateExportFilename(entityType: string, format: 'csv' | 'xlsx', filters?: Record<string, any>)`: Generates formatted filenames
- `handleExport(exportFunction, filename, onStart?, onSuccess?, onError?)`: Handles export with loading states
- `formatActiveFilters(filters: Record<string, any>)`: Formats filters for display
- `validateExportParams(params: Record<string, any>)`: Validates export parameters

## Service Layer Integration

### Updated Services

All service files have been updated to include export methods:

#### ClinicsService

```typescript
// Export to CSV
static async exportClinicsToCSV(params: ClinicsQueryParams = {}): Promise<Blob>

// Export to Excel
static async exportClinicsToExcel(params: ClinicsQueryParams = {}): Promise<Blob>
```

#### UsersService

```typescript
// Export to CSV
static async exportUsersToCSV(params: UsersQueryParams = {}): Promise<Blob>

// Export to Excel
static async exportUsersToExcel(params: UsersQueryParams = {}): Promise<Blob>
```

#### PetsService

```typescript
// Export to CSV
static async exportPetsToCSV(params: PetsQueryParams = {}): Promise<Blob>

// Export to Excel
static async exportPetsToExcel(params: PetsQueryParams = {}): Promise<Blob>
```

#### AppointmentsService

```typescript
// Export to CSV
static async exportToCSV(filters: AppointmentsFilters = {}): Promise<Blob>

// Export to Excel
static async exportToExcel(filters: AppointmentsFilters = {}): Promise<Blob>
```

## Hook Integration

### Updated Hooks

The management hooks have been updated to provide export functions:

#### useClinicManagement

```typescript
const {
  handleExportCSV, // () => Promise<Blob>
  handleExportExcel, // () => Promise<Blob>
  // ... other properties
} = useClinicManagement();
```

#### useUserManagement

```typescript
const {
  handleExportCSV, // () => Promise<Blob>
  handleExportExcel, // () => Promise<Blob>
  // ... other properties
} = useUserManagement();
```

## Page Integration

### Updated Pages

The following pages have been updated to include export functionality:

#### Clinics Page (`src/pages/clinics.tsx`)

- Integrated ExportButton in ClinicPageHeader
- Passes current filters and record count
- Uses clinic-specific export functions

#### Users Page (`src/pages/users.tsx`)

- Integrated ExportButton in UserPageHeader
- Supports both regular users and veterinarians
- Passes role-specific filters

## API Endpoints

The export functionality connects to the following API endpoints:

### Clinics

- `GET /clinics/export/csv` - Export clinics to CSV
- `GET /clinics/export/excel` - Export clinics to Excel

### Users

- `GET /users/export/csv` - Export users to CSV (Admin only)
- `GET /users/export/excel` - Export users to Excel (Admin only)

### Pets

- `GET /pets/export/csv` - Export pets to CSV
- `GET /pets/export/excel` - Export pets to Excel

### Appointments

- `GET /appointments/export/csv` - Export appointments to CSV
- `GET /appointments/export/excel` - Export appointments to Excel

## Features

### 1. Filter Support

All export endpoints support the same filtering options as their respective list endpoints:

- Search terms
- Date ranges
- Status filters
- Role filters
- Location filters
- And more...

### 2. Large Dataset Handling

- Confirmation dialogs for exports with >1000 records
- Progress indicators during export
- Estimated file size warnings
- Timeout handling for long-running exports

### 3. File Naming

Exports are automatically named with:

- Entity type (e.g., "clinics", "users")
- Export date
- Applied filters (when applicable)
- File extension (.csv or .xlsx)

Example: `clinics_export_2024-01-15_search-veterinary_city-New York.csv`

### 4. Error Handling

- Network error handling
- Authentication error handling
- File size limit warnings
- User-friendly error messages

### 5. Loading States

- Button loading indicators
- Progress messages
- Disabled states during export
- Success/error notifications

## Usage Examples

### Basic Export Button

```tsx
<ExportButton entityType='clinics' exportCSV={handleExportCSV} exportExcel={handleExportExcel} />
```

### Export with Filters

```tsx
<ExportButton
  entityType='users'
  exportCSV={handleExportCSV}
  exportExcel={handleExportExcel}
  filters={{
    search: searchText,
    role: selectedRole,
    isActive: selectedStatus,
  }}
  estimatedRecordCount={totalRecords}
/>
```

### Custom Styled Export

```tsx
<ExportButton
  entityType='appointments'
  exportCSV={handleExportCSV}
  exportExcel={handleExportExcel}
  buttonText='Download Report'
  type='primary'
  size='large'
  showConfirmation={true}
  maxRecordsWithoutConfirmation={500}
/>
```

## Security Considerations

- **Authentication**: All export endpoints require valid authentication
- **Authorization**: Role-based access control (Admin, Veterinarian, Staff)
- **Data Privacy**: Sensitive data is handled according to privacy policies
- **Rate Limiting**: Export requests are subject to rate limiting
- **Audit Logging**: Export activities are logged for compliance

## Performance Considerations

- **Pagination**: Large datasets are handled efficiently
- **Streaming**: File downloads use streaming for better performance
- **Caching**: Export results may be cached for repeated requests
- **Timeout Handling**: Long-running exports have appropriate timeouts
- **Memory Management**: Large exports are handled with memory efficiency

## Testing

### Unit Tests

- Export utility functions
- Export button component
- Service layer methods

### Integration Tests

- End-to-end export workflows
- API endpoint integration
- Error handling scenarios

### Manual Testing

- Different file formats
- Various filter combinations
- Large dataset exports
- Error scenarios

## Future Enhancements

### Planned Features

- **Scheduled Exports**: Automated export scheduling
- **Export History**: Track and manage export history
- **Additional Formats**: Support for JSON, XML, and other formats
- **Custom Templates**: User-defined export templates
- **Email Delivery**: Send exports via email
- **Cloud Storage**: Direct upload to cloud storage services

### Performance Improvements

- **Background Processing**: Queue-based export processing
- **Compression**: Compressed file downloads
- **Chunked Downloads**: Streaming for very large files
- **Progress Tracking**: Real-time progress updates

## Troubleshooting

### Common Issues

1. **Export Fails with 401 Error**
   - Check authentication status
   - Verify user permissions
   - Refresh authentication token

2. **Large Export Times Out**
   - Reduce filter scope
   - Use date range filters
   - Contact administrator for assistance

3. **File Download Issues**
   - Check browser download settings
   - Verify file size limits
   - Try different browser

4. **Missing Data in Export**
   - Verify filter settings
   - Check user permissions
   - Review data access policies

### Support

For technical support or questions about the export functionality:

- Check the API documentation
- Review the service layer implementation
- Contact the development team
- Submit an issue in the project repository

## Conclusion

The export functionality provides a comprehensive solution for data export needs in the admin frontend. It offers flexibility, security, and user-friendly features while maintaining high performance and reliability. The modular design allows for easy extension and customization as requirements evolve.

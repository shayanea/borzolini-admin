import type { User, UserRole } from './index';

import type { Dayjs } from 'dayjs';

export interface UserTableProps {
  users: User[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  selectedRowKeys: string[];
  onTableChange: (pagination: any, filters: any, sorter: any) => void;
  onRowSelectionChange?: (
    selectedKeys: (string | number)[],
    selectedRows: User[],
    info: unknown
  ) => void;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onToggleActive?: (user: User, isActive: boolean) => void;
}

export interface UserFiltersProps {
  searchText: string;
  selectedRole: UserRole | null;
  selectedIsActive: boolean | null;
  dateRange: [string, string] | null;
  onSearch: (value: string) => void;
  onRoleFilter: (value: UserRole | null) => void;
  onIsActiveFilter: (value: boolean | null) => void;
  onDateRangeChange: (dates: [Dayjs, Dayjs] | null) => void;
  onClearFilters: () => void;
}

export interface UserFormModalProps {
  isVisible: boolean;
  editingUser: User | null;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

export interface UserPageHeaderProps {
  onRefresh: () => void;
  onAddUser: () => void;
  loading: boolean;
  onExportCSV: () => Promise<Blob>;
  onExportExcel: () => Promise<Blob>;
  filters?: Record<string, unknown>;
  estimatedRecordCount?: number;
  stats?: {
    total: number;
    activeCount: number;
    inactiveCount: number;
    roleCounts: Record<UserRole, number>;
  };
  onQuickRoleFilter?: (role: UserRole | null) => void;
  onQuickStatusFilter?: (isActive: boolean | null) => void;
}

export interface UserBulkActionsProps {
  selectedCount: number;
  loading: boolean;
  onBulkDelete: () => void;
}

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  role: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  dateOfBirth?: string;
  avatar?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  clinic_id?: string;
}

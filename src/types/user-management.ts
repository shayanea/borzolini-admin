import type { User, UserRole } from './index';

export interface UserTableProps {
  users: User[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  selectedRowKeys: string[];
  onTableChange: (pagination: any, filters: any, sorter: any) => void;
  onRowSelectionChange: (selectedKeys: any, selectedRows: User[], info: any) => void;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export interface UserFiltersProps {
  searchText: string;
  selectedRole: UserRole | null;
  selectedIsActive: boolean | null;
  onSearch: (value: string) => void;
  onRoleFilter: (value: UserRole | null) => void;
  onIsActiveFilter: (value: boolean | null) => void;
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
  onExport: () => void;
  onAddUser: () => void;
  loading: boolean;
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
}

import { DEFAULT_SORT_FIELD, DEFAULT_SORT_ORDER } from '@/constants/user-management';
import UsersService, {
  type CreateUserData,
  type UpdateUserData,
  type UsersQueryParams,
} from '@/services/users';
import type { PaginatedResponse, User, UserRole } from '@/types';
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { message as antMessage } from 'antd';
import { useCallback, useState } from 'react';
import { FilterValue, useFilterManagement } from '../common/use-filter-management';
import { useTableManagement } from '../common/use-table-management';

/**
 * User-specific filters
 */
interface UserFilters {
  [key: string]: FilterValue;
  role: UserRole | null;
  isActive: boolean | null;
  dateRange: [string, string] | null;
}

interface UseUserManagementReturn {
  // State
  users: User[];
  loading: boolean;
  total: number;
  selectedRowKeys: string[];
  currentPage: number;
  pageSize: number;
  searchText: string;
  selectedRole: UserRole | null;
  selectedIsActive: boolean | null;
  dateRange: [string, string] | null;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';

  userStats: {
    total: number;
    activeCount: number;
    inactiveCount: number;
    roleCounts: Record<UserRole, number>;
  };

  isModalVisible: boolean;
  editingUser: User | null;
  modalLoading: boolean;
  isViewModalVisible: boolean;
  viewingUser: User | null;

  // Actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  handleSearch: (value: string) => void;
  handleRoleFilter: (value: UserRole | null) => void;
  handleIsActiveFilter: (value: boolean | null) => void;
  handleDateRangeChange: (dates: any) => void;
  clearFilters: () => void;
  handleTableChange: (pagination: any, filters: any, sorter: any) => void;
  handleRowSelectionChange: (
    selectedKeys: (string | number)[],
    selectedRows: User[],
    info: unknown
  ) => void;
  showModal: (user?: User) => void;
  hideModal: () => void;
  showViewModal: (user: User) => void;
  hideViewModal: () => void;
  handleSubmit: (values: any) => Promise<void>;
  handleDeleteUser: (userId: string) => Promise<void>;

  handleUpdateUserStatus: (userId: string, isActive: boolean) => Promise<void>;
  handleBulkUpdateStatus: (userIds: string[], isActive: boolean) => Promise<void>;
  handleBulkDeleteUsers: (userIds: string[]) => Promise<void>;

  handleExportCSV: () => Promise<Blob>;
  handleExportExcel: () => Promise<Blob>;

  // Utils
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<PaginatedResponse<User>, Error>>;
}

/**
 * Hook for managing user data with table, filters, modals, and CRUD operations
 *
 * @param roleFilter - Optional role filter to apply by default
 */
export function useUserManagement(roleFilter?: UserRole): UseUserManagementReturn {
  const queryClient = useQueryClient();

  // Use reusable table management hook
  const table = useTableManagement({
    initialSortBy: DEFAULT_SORT_FIELD,
    initialSortOrder: DEFAULT_SORT_ORDER,
  });

  // Use reusable filter management hook
  const filterManager = useFilterManagement<UserFilters>({
    initialFilters: {
      role: null,
      isActive: null,
      dateRange: null,
    },
    resetToPage1: () => table.setCurrentPage(1),
  });

  // Modal states (not part of shared hooks as they're feature-specific)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // Query for users
  const {
    data: usersResponse,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: [
      'users',
      table.currentPage,
      table.pageSize,
      filterManager.searchText,
      roleFilter,
      filterManager.filters.role,
      filterManager.filters.isActive,
      filterManager.filters.dateRange,
      table.sortBy,
      table.sortOrder,
    ],
    queryFn: async () => {
      const params: UsersQueryParams = {
        page: table.currentPage,
        limit: table.pageSize,
        search: filterManager.searchText || undefined,
        role: roleFilter || filterManager.filters.role || undefined,
        isActive:
          filterManager.filters.isActive !== null ? filterManager.filters.isActive : undefined,
        dateRange: filterManager.filters.dateRange || undefined,
        sortBy: table.sortBy,
        sortOrder: table.sortOrder,
      };

      return await UsersService.getUsers(params);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutations

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: UsersService.createUser,
    onSuccess: () => {
      antMessage.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      hideModal();
    },
    onError: error => {
      console.error('Error creating user:', error);
      antMessage.error('Failed to create user');
      throw error;
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserData }) =>
      UsersService.updateUser(userId, data),
    onSuccess: () => {
      antMessage.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      hideModal();
    },
    onError: error => {
      console.error('Error updating user:', error);
      antMessage.error('Failed to update user');
      throw error;
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: UsersService.deleteUser,
    onSuccess: () => {
      antMessage.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: error => {
      console.error('Error deleting user:', error);
      antMessage.error('Failed to delete user');
      throw error;
    },
  });

  const bulkUpdateUsersMutation = useMutation({
    mutationFn: ({ userIds, updates }: { userIds: string[]; updates: Partial<UpdateUserData> }) =>
      UsersService.bulkUpdateUsers(userIds, updates),
    onSuccess: (_result, variables) => {
      antMessage.success(`${variables.userIds.length} users updated successfully`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: error => {
      console.error('Error bulk updating users:', error);
      antMessage.error('Failed to update users');
      throw error;
    },
  });

  const bulkDeleteUsersMutation = useMutation({
    mutationFn: (userIds: string[]) => UsersService.bulkDeleteUsers(userIds),
    onSuccess: (_result, userIds) => {
      antMessage.success(`${userIds.length} users deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: error => {
      console.error('Error bulk deleting users:', error);
      antMessage.error('Failed to delete users');
      throw error;
    },
  });

  // Extract data from query
  const users = usersResponse?.data || [];
  const total = usersResponse?.total || 0;

  const activeCount = users.filter(user => user.isActive).length;
  const inactiveCount = total - activeCount;

  const roleCounts = users.reduce<Record<UserRole, number>>(
    (acc, user) => {
      const role = user.role as UserRole;
      acc[role] = (acc[role] ?? 0) + 1;
      return acc;
    },
    {
      admin: 0,
      veterinarian: 0,
      staff: 0,
      patient: 0,
      clinic_admin: 0,
    }
  );

  const userStats = {
    total,
    activeCount,
    inactiveCount,
    roleCounts,
  };

  // Custom filter handlers (map to filter manager)
  const handleRoleFilter = useCallback(
    (value: UserRole | null) => {
      filterManager.setFilter('role', value);
    },
    [filterManager]
  );

  const handleIsActiveFilter = useCallback(
    (value: boolean | null) => {
      filterManager.setFilter('isActive', value);
    },
    [filterManager]
  );

  const handleDateRangeChange = useCallback(
    (dates: any) => {
      if (dates) {
        filterManager.setFilter('dateRange', [dates[0].toISOString(), dates[1].toISOString()]);
      } else {
        filterManager.setFilter('dateRange', null);
      }
    },
    [filterManager]
  );

  const handleRowSelectionChange = useCallback(
    (selectedKeys: (string | number)[]) => {
      table.setSelectedRowKeys(selectedKeys.map(key => String(key)));
    },
    [table]
  );

  // Modal handlers
  const showModal = useCallback((user?: User) => {
    setEditingUser(user || null);
    setIsModalVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsModalVisible(false);
    setEditingUser(null);
  }, []);

  const showViewModal = useCallback((user: User) => {
    setViewingUser(user);
    setIsViewModalVisible(true);
  }, []);

  const hideViewModal = useCallback(() => {
    setIsViewModalVisible(false);
    setViewingUser(null);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: any) => {
      // Convert dateOfBirth if it's a dayjs object
      const dateOfBirth = values.dateOfBirth
        ? typeof values.dateOfBirth === 'string'
          ? values.dateOfBirth
          : values.dateOfBirth.format('YYYY-MM-DD')
        : undefined;

      if (editingUser) {
        // Update existing user
        const updateData: UpdateUserData = {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          address: values.address,
          city: values.city,
          country: values.country,
          postalCode: values.postalCode,
          dateOfBirth: dateOfBirth,
          avatar: values.avatar,
          role: values.role,
          isActive: values.isActive,
          isEmailVerified: values.isEmailVerified,
        };

        await updateUserMutation.mutateAsync({ userId: editingUser.id, data: updateData });
      } else {
        // Create new user
        const createData: CreateUserData = {
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          role: values.role,
          address: values.address,
          city: values.city,
          country: values.country,
        };

        await createUserMutation.mutateAsync(createData);
      }
    },
    [editingUser, updateUserMutation, createUserMutation]
  );

  // Handle user deletion
  const handleDeleteUser = useCallback(
    async (userId: string) => {
      await deleteUserMutation.mutateAsync(userId);
    },
    [deleteUserMutation]
  );

  const handleUpdateUserStatus = useCallback(
    async (userId: string, isActive: boolean) => {
      const updateData: UpdateUserData = {
        isActive,
      };
      await updateUserMutation.mutateAsync({ userId, data: updateData });
    },
    [updateUserMutation]
  );

  const handleBulkUpdateStatus = useCallback(
    async (userIds: string[], isActive: boolean) => {
      const updates: Partial<UpdateUserData> = { isActive };
      await bulkUpdateUsersMutation.mutateAsync({ userIds, updates });
    },
    [bulkUpdateUsersMutation]
  );

  const handleBulkDeleteUsers = useCallback(
    async (userIds: string[]) => {
      await bulkDeleteUsersMutation.mutateAsync(userIds);
    },
    [bulkDeleteUsersMutation]
  );

  // Export handlers
  const handleExportCSV = useCallback(async () => {
    const params: UsersQueryParams = {
      search: filterManager.searchText || undefined,
      role: filterManager.filters.role || undefined,
      isActive:
        filterManager.filters.isActive !== null ? filterManager.filters.isActive : undefined,
      dateRange: filterManager.filters.dateRange || undefined,
    };

    return await UsersService.exportUsersToCSV(params);
  }, [filterManager.searchText, filterManager.filters]);

  const handleExportExcel = useCallback(async () => {
    const params: UsersQueryParams = {
      search: filterManager.searchText || undefined,
      role: filterManager.filters.role || undefined,
      isActive:
        filterManager.filters.isActive !== null ? filterManager.filters.isActive : undefined,
      dateRange: filterManager.filters.dateRange || undefined,
    };

    return await UsersService.exportUsersToExcel(params);
  }, [filterManager.searchText, filterManager.filters]);

  return {
    // State from query
    users,
    loading,
    total,

    // State from table management
    currentPage: table.currentPage,
    pageSize: table.pageSize,
    selectedRowKeys: table.selectedRowKeys,
    sortBy: table.sortBy,
    sortOrder: table.sortOrder,

    // State from filter management
    searchText: filterManager.searchText,
    selectedRole: filterManager.filters.role,
    selectedIsActive: filterManager.filters.isActive,
    dateRange: filterManager.filters.dateRange,

    userStats,

    // Modal state
    isModalVisible,
    editingUser,
    modalLoading: createUserMutation.isPending || updateUserMutation.isPending,
    isViewModalVisible,
    viewingUser,

    // Actions from table management
    setCurrentPage: table.setCurrentPage,
    setPageSize: table.setPageSize,
    handleTableChange: table.handleTableChange,
    handleRowSelectionChange,

    // Actions from filter management
    handleSearch: filterManager.handleSearch,
    clearFilters: filterManager.clearAllFilters,

    // Custom filter handlers
    handleRoleFilter,
    handleIsActiveFilter,
    handleDateRangeChange,

    // Modal actions
    showModal,
    hideModal,
    showViewModal,
    hideViewModal,

    // CRUD operations
    handleSubmit,
    handleDeleteUser,
    handleUpdateUserStatus,
    handleBulkUpdateStatus,
    handleBulkDeleteUsers,
    handleExportCSV,
    handleExportExcel,

    // Utils
    refetch,
  };
}

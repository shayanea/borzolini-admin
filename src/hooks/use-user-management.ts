import type { AccountStatus, User, UserRole } from '@/types';
import { DEFAULT_SORT_FIELD, DEFAULT_SORT_ORDER } from '@/constants/user-management';
import { Modal, message as antMessage } from 'antd';
import UsersService, {
  CreateUserData,
  UpdateUserData,
  UsersQueryParams,
} from '@/services/users.service';
import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UseUserManagementReturn {
  // State
  users: User[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  searchText: string;
  selectedRole: UserRole | null;
  selectedStatus: AccountStatus | null;
  dateRange: [string, string] | null;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  selectedRowKeys: string[];
  bulkLoading: boolean;
  isModalVisible: boolean;
  editingUser: User | null;
  modalLoading: boolean;

  // Actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  handleSearch: (value: string) => void;
  handleRoleFilter: (value: UserRole | null) => void;
  handleStatusFilter: (value: AccountStatus | null) => void;
  handleDateRangeChange: (dates: any) => void;
  clearFilters: () => void;
  handleTableChange: (pagination: any, filters: any, sorter: any) => void;
  showModal: (user?: User) => void;
  hideModal: () => void;
  handleSubmit: (values: any) => Promise<void>;
  handleDeleteUser: (userId: string) => Promise<void>;
  handleBulkDelete: () => Promise<void>;
  handleExport: () => Promise<void>;
  setSelectedRowKeys: (keys: string[]) => void;
}

export const useUserManagement = (roleFilter?: UserRole): UseUserManagementReturn => {
  // Basic state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AccountStatus | null>(null);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [sortBy, setSortBy] = useState<string>(DEFAULT_SORT_FIELD);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(DEFAULT_SORT_ORDER);

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Bulk operations
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // Query for users
  const {
    data: usersResponse,
    isLoading: loading,
  } = useQuery({
    queryKey: ['users', currentPage, pageSize, searchText, roleFilter, selectedRole, selectedStatus, dateRange, sortBy, sortOrder],
    queryFn: async () => {
      const params: UsersQueryParams = {
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        role: roleFilter || selectedRole || undefined,
        status: selectedStatus || undefined,
        dateRange: dateRange || undefined,
        sortBy,
        sortOrder,
      };

      return await UsersService.getUsers(params);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: UsersService.createUser,
    onSuccess: () => {
      antMessage.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      hideModal();
    },
    onError: (error) => {
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
    onError: (error) => {
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
    onError: (error) => {
      console.error('Error deleting user:', error);
      antMessage.error('Failed to delete user');
      throw error;
    },
  });

  const bulkDeleteUsersMutation = useMutation({
    mutationFn: UsersService.bulkDeleteUsers,
    onSuccess: (_, variables) => {
      antMessage.success(`${variables.length} users deleted successfully`);
      setSelectedRowKeys([]);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Error bulk deleting users:', error);
      antMessage.error('Failed to delete selected users');
      throw error;
    },
  });

  // Extract data from query
  const users = usersResponse?.data || [];
  const total = usersResponse?.total || 0;

  // Handle search
  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  }, []);

  // Handle role filter
  const handleRoleFilter = useCallback((value: UserRole | null) => {
    setSelectedRole(value);
    setCurrentPage(1);
  }, []);

  // Handle status filter
  const handleStatusFilter = useCallback((value: AccountStatus | null) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  }, []);

  // Handle date range filter
  const handleDateRangeChange = useCallback((dates: any) => {
    if (dates) {
      setDateRange([dates[0].toISOString(), dates[1].toISOString()]);
    } else {
      setDateRange(null);
    }
    setCurrentPage(1);
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchText('');
    setSelectedRole(null);
    setSelectedStatus(null);
    setDateRange(null);
    setSortBy(DEFAULT_SORT_FIELD);
    setSortOrder(DEFAULT_SORT_ORDER);
    setCurrentPage(1);
  }, []);

  // Handle table change (pagination, sorting)
  const handleTableChange = useCallback(
    (pagination: any, _filters: any, sorter: any) => {
      if (pagination.current !== currentPage) {
        setCurrentPage(pagination.current);
      }
      if (pagination.pageSize !== pageSize) {
        setPageSize(pagination.pageSize);
        setCurrentPage(1);
      }
      if (sorter.field && sorter.order) {
        setSortBy(sorter.field);
        setSortOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC');
      }
    },
    [currentPage, pageSize]
  );

  // Show modal for creating/editing user
  const showModal = useCallback((user?: User) => {
    setEditingUser(user || null);
    setIsModalVisible(true);
  }, []);

  // Hide modal
  const hideModal = useCallback(() => {
    setIsModalVisible(false);
    setEditingUser(null);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: any) => {
      if (editingUser) {
        // Update existing user
        const updateData: UpdateUserData = {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          address: values.address,
          city: values.city,
          country: values.country,
          role: values.role,
          accountStatus: values.accountStatus,
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

  // Handle bulk operations
  const handleBulkDelete = useCallback(async () => {
    if (selectedRowKeys.length === 0) {
      antMessage.warning('Please select users to delete');
      return;
    }

    Modal.confirm({
      title: 'Delete Selected Users',
      content: `Are you sure you want to delete ${selectedRowKeys.length} selected users? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        await bulkDeleteUsersMutation.mutateAsync(selectedRowKeys);
      },
    });
  }, [selectedRowKeys, bulkDeleteUsersMutation]);

  // Handle export
  const handleExport = useCallback(async () => {
    try {
      const params: UsersQueryParams = {
        search: searchText || undefined,
        role: selectedRole || undefined,
        status: selectedStatus || undefined,
        dateRange: dateRange || undefined,
      };

      const blob = await UsersService.exportUsers(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      antMessage.success('Users exported successfully');
    } catch (error) {
      console.error('Error exporting users:', error);
      antMessage.error('Failed to export users');
    }
  }, [searchText, selectedRole, selectedStatus, dateRange]);

  return {
    // State
    users,
    loading,
    total,
    currentPage,
    pageSize,
    searchText,
    selectedRole,
    selectedStatus,
    dateRange,
    sortBy,
    sortOrder,
    selectedRowKeys,
    bulkLoading: bulkDeleteUsersMutation.isPending,
    isModalVisible,
    editingUser,
    modalLoading: createUserMutation.isPending || updateUserMutation.isPending,

    // Actions
    setCurrentPage,
    setPageSize,
    handleSearch,
    handleRoleFilter,
    handleStatusFilter,
    handleDateRangeChange,
    clearFilters,
    handleTableChange,
    showModal,
    hideModal,
    handleSubmit,
    handleDeleteUser,
    handleBulkDelete,
    handleExport,
    setSelectedRowKeys,
  };
};

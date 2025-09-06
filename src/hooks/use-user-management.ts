import { DEFAULT_SORT_FIELD, DEFAULT_SORT_ORDER } from '@/constants/user-management';
import type { PaginatedResponse, User, UserRole } from '@/types';
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import UsersService, {
  CreateUserData,
  UpdateUserData,
  UsersQueryParams,
} from '@/services/users.service';
import { useCallback, useState } from 'react';

import { message as antMessage } from 'antd';

interface UseUserManagementReturn {
  // State
  users: User[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  searchText: string;
  selectedRole: UserRole | null;
  selectedIsActive: boolean | null;
  dateRange: [string, string] | null;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';

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
  showModal: (user?: User) => void;
  hideModal: () => void;
  showViewModal: (user: User) => void;
  hideViewModal: () => void;
  handleSubmit: (values: any) => Promise<void>;
  handleDeleteUser: (userId: string) => Promise<void>;

  handleExportCSV: () => Promise<Blob>;
  handleExportExcel: () => Promise<Blob>;

  // Utils
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<PaginatedResponse<User>, Error>>;
}

export const useUserManagement = (roleFilter?: UserRole): UseUserManagementReturn => {
  // Basic state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedIsActive, setSelectedIsActive] = useState<boolean | null>(null);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [sortBy, setSortBy] = useState<string>(DEFAULT_SORT_FIELD);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(DEFAULT_SORT_ORDER);

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  const queryClient = useQueryClient();

  // Query for users
  const {
    data: usersResponse,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: [
      'users',
      currentPage,
      pageSize,
      searchText,
      roleFilter,
      selectedRole,
      selectedIsActive,
      dateRange,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      const params: UsersQueryParams = {
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        role: roleFilter || selectedRole || undefined,
        isActive: selectedIsActive !== null ? selectedIsActive : undefined,
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

  // Handle isActive filter
  const handleIsActiveFilter = useCallback((value: boolean | null) => {
    setSelectedIsActive(value);
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
    setSelectedIsActive(null);
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

  // Show view modal
  const showViewModal = useCallback((user: User) => {
    setViewingUser(user);
    setIsViewModalVisible(true);
  }, []);

  // Hide view modal
  const hideViewModal = useCallback(() => {
    setIsViewModalVisible(false);
    setViewingUser(null);
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

  // Handle export to CSV
  const handleExportCSV = useCallback(async () => {
    const params: UsersQueryParams = {
      search: searchText || undefined,
      role: selectedRole || undefined,
      isActive: selectedIsActive !== null ? selectedIsActive : undefined,
      dateRange: dateRange || undefined,
    };

    return await UsersService.exportUsersToCSV(params);
  }, [searchText, selectedRole, selectedIsActive, dateRange]);

  // Handle export to Excel
  const handleExportExcel = useCallback(async () => {
    const params: UsersQueryParams = {
      search: searchText || undefined,
      role: selectedRole || undefined,
      isActive: selectedIsActive !== null ? selectedIsActive : undefined,
      dateRange: dateRange || undefined,
    };

    return await UsersService.exportUsersToExcel(params);
  }, [searchText, selectedRole, selectedIsActive, dateRange]);

  return {
    // State
    users,
    loading,
    total,
    currentPage,
    pageSize,
    searchText,
    selectedRole,
    selectedIsActive,
    dateRange,
    sortBy,
    sortOrder,

    isModalVisible,
    editingUser,
    modalLoading: createUserMutation.isPending || updateUserMutation.isPending,
    isViewModalVisible,
    viewingUser,

    // Actions
    setCurrentPage,
    setPageSize,
    handleSearch,
    handleRoleFilter,
    handleIsActiveFilter,
    handleDateRangeChange,
    clearFilters,
    handleTableChange,
    showModal,
    hideModal,
    showViewModal,
    hideViewModal,
    handleSubmit,
    handleDeleteUser,

    handleExportCSV,
    handleExportExcel,

    // Utils
    refetch,
  };
};

import { FAQService } from '@/services/faq';
import type { CreateFAQDto, FAQQueryParams, UpdateFAQDto } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useCallback, useMemo, useState } from 'react';

// Query keys factory
const faqKeys = {
  all: ['faqs'] as const,
  lists: () => [...faqKeys.all, 'list'] as const,
  list: (params: FAQQueryParams) => [...faqKeys.lists(), params] as const,
  details: () => [...faqKeys.all, 'detail'] as const,
  detail: (id: string) => [...faqKeys.details(), id] as const,
};

export const useFAQManagement = () => {
  // Filter and pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // Build query params
  const queryParams = useMemo<FAQQueryParams>(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: searchText || undefined,
      category: selectedCategory,
      is_active: selectedStatus,
      sortBy,
      sortOrder,
    }),
    [currentPage, pageSize, searchText, selectedCategory, selectedStatus, sortBy, sortOrder]
  );

  // Fetch FAQs with React Query
  const {
    data: faqResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: faqKeys.list(queryParams),
    queryFn: () => FAQService.getFAQs(queryParams),
    staleTime: 30000, // 30 seconds
  });

  // Create FAQ mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateFAQDto) => FAQService.createFAQ(data),
    onSuccess: () => {
      message.success('FAQ created successfully');
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to create FAQ');
    },
  });

  // Update FAQ mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFAQDto }) =>
      FAQService.updateFAQ(id, data),
    onSuccess: () => {
      message.success('FAQ updated successfully');
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update FAQ');
    },
  });

  // Delete FAQ mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => FAQService.deleteFAQ(id),
    onSuccess: () => {
      message.success('FAQ deleted successfully');
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete FAQ');
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => FAQService.bulkDeleteFAQs(ids),
    onSuccess: (_, ids) => {
      message.success(`${ids.length} FAQ(s) deleted successfully`);
      setSelectedRowKeys([]);
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete FAQs');
    },
  });

  // Handler functions
  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  }, []);

  const handleCategoryFilter = useCallback((value: string | undefined) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilter = useCallback((value: boolean | undefined) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchText('');
    setSelectedCategory(undefined);
    setSelectedStatus(undefined);
    setSortBy(undefined);
    setSortOrder(undefined);
    setCurrentPage(1);
  }, []);

  const handleTableChange = useCallback((pagination: any, _filters: any, sorter: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);

    if (sorter.field) {
      setSortBy(sorter.field);
      setSortOrder(
        sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : undefined
      );
    }
  }, []);

  const handleCreateFAQ = useCallback(
    async (data: CreateFAQDto) => {
      await createMutation.mutateAsync(data);
    },
    [createMutation]
  );

  const handleUpdateFAQ = useCallback(
    async (id: string, data: UpdateFAQDto) => {
      await updateMutation.mutateAsync({ id, data });
    },
    [updateMutation]
  );

  const handleDeleteFAQ = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const handleBulkDelete = useCallback(async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select FAQs to delete');
      return;
    }
    await bulkDeleteMutation.mutateAsync(selectedRowKeys);
  }, [selectedRowKeys, bulkDeleteMutation]);

  return {
    // State
    faqs: faqResponse?.data ?? [],
    loading: isLoading,
    total: faqResponse?.total ?? 0,
    currentPage,
    pageSize,
    searchText,
    selectedCategory,
    selectedStatus,
    sortBy,
    sortOrder,
    selectedRowKeys,
    bulkLoading: bulkDeleteMutation.isPending,

    // Actions
    handleSearch,
    handleCategoryFilter,
    handleStatusFilter,
    clearFilters,
    handleTableChange,
    handleCreateFAQ,
    handleUpdateFAQ,
    handleDeleteFAQ,
    handleBulkDelete,
    setSelectedRowKeys,

    // Utils
    refetch,
  };
};

export default useFAQManagement;

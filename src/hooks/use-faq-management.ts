import { FAQService } from '@/services/faq';
import type { CreateFAQDto, FAQ, FAQQueryParams, UpdateFAQDto } from '@/types';
import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';

export const useFAQManagement = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchFAQs = useCallback(async () => {
    setLoading(true);
    try {
      const params: FAQQueryParams = {
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        category: selectedCategory,
        is_active: selectedStatus,
        sortBy,
        sortOrder,
      };

      const response = await FAQService.getFAQs(params);
      setFaqs(response.data);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.limit);
    } catch (error: any) {
      message.error(error.message || 'Failed to fetch FAQs');
      setFaqs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchText, selectedCategory, selectedStatus, sortBy, sortOrder]);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

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
      try {
        await FAQService.createFAQ(data);
        message.success('FAQ created successfully');
        fetchFAQs();
      } catch (error: any) {
        message.error(error.message || 'Failed to create FAQ');
        throw error;
      }
    },
    [fetchFAQs]
  );

  const handleUpdateFAQ = useCallback(
    async (id: string, data: UpdateFAQDto) => {
      try {
        await FAQService.updateFAQ(id, data);
        message.success('FAQ updated successfully');
        fetchFAQs();
      } catch (error: any) {
        message.error(error.message || 'Failed to update FAQ');
        throw error;
      }
    },
    [fetchFAQs]
  );

  const handleDeleteFAQ = useCallback(
    async (id: string) => {
      try {
        await FAQService.deleteFAQ(id);
        message.success('FAQ deleted successfully');
        fetchFAQs();
      } catch (error: any) {
        message.error(error.message || 'Failed to delete FAQ');
      }
    },
    [fetchFAQs]
  );

  const handleBulkDelete = useCallback(async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select FAQs to delete');
      return;
    }

    setBulkLoading(true);
    try {
      await FAQService.bulkDeleteFAQs(selectedRowKeys);
      message.success(`${selectedRowKeys.length} FAQ(s) deleted successfully`);
      setSelectedRowKeys([]);
      fetchFAQs();
    } catch (error: any) {
      message.error(error.message || 'Failed to delete FAQs');
    } finally {
      setBulkLoading(false);
    }
  }, [selectedRowKeys, fetchFAQs]);

  return {
    // State
    faqs,
    loading,
    total,
    currentPage,
    pageSize,
    searchText,
    selectedCategory,
    selectedStatus,
    sortBy,
    sortOrder,
    selectedRowKeys,
    bulkLoading,

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
    refetch: fetchFAQs,
  };
};

export default useFAQManagement;

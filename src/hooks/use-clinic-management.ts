import type { Clinic } from '@/types';
import { Modal, message as antMessage } from 'antd';
import ClinicsService, {
  UpdateClinicData,
  ClinicsQueryParams,
} from '@/services/clinics.service';
import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UseClinicManagementReturn {
  // State
  clinics: Clinic[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  searchText: string;
  selectedCity: string | null;
  selectedStatus: boolean | null;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  selectedRowKeys: string[];
  bulkLoading: boolean;
  isModalVisible: boolean;
  editingClinic: Clinic | null;
  modalLoading: boolean;

  // Actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  handleSearch: (value: string) => void;
  handleCityFilter: (value: string | null) => void;
  handleStatusFilter: (value: boolean | null) => void;
  clearFilters: () => void;
  handleTableChange: (pagination: any, filters: any, sorter: any) => void;
  showModal: (clinic?: Clinic) => void;
  hideModal: () => void;
  handleSubmit: (values: any) => Promise<void>;
  handleDeleteClinic: (clinicId: string) => Promise<void>;
  handleBulkDelete: () => Promise<void>;
  handleExport: () => Promise<void>;
  setSelectedRowKeys: (keys: string[]) => void;
}

export const useClinicManagement = (): UseClinicManagementReturn => {
  // Basic state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);

  // Bulk operations
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // Query for clinics
  const {
    data: clinicsResponse,
    isLoading: loading,
  } = useQuery({
    queryKey: ['clinics', currentPage, pageSize, searchText, selectedCity, selectedStatus, sortBy, sortOrder],
    queryFn: async () => {
      const params: ClinicsQueryParams = {
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        city: selectedCity || undefined,
        isActive: selectedStatus !== null ? selectedStatus : undefined,
        sortBy,
        sortOrder,
      };

      return await ClinicsService.getClinics(params);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutations
  const createClinicMutation = useMutation({
    mutationFn: ClinicsService.createClinic,
    onSuccess: () => {
      antMessage.success('Clinic created successfully');
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
      hideModal();
    },
    onError: (error: any) => {
      antMessage.error(error?.response?.data?.message || 'Failed to create clinic');
    },
  });

  const updateClinicMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClinicData }) =>
      ClinicsService.updateClinic(id, data),
    onSuccess: () => {
      antMessage.success('Clinic updated successfully');
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
      hideModal();
    },
    onError: (error: any) => {
      antMessage.error(error?.response?.data?.message || 'Failed to update clinic');
    },
  });

  const deleteClinicMutation = useMutation({
    mutationFn: ClinicsService.deleteClinic,
    onSuccess: () => {
      antMessage.success('Clinic deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
    },
    onError: (error: any) => {
      antMessage.error(error?.response?.data?.message || 'Failed to delete clinic');
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: ClinicsService.bulkDeleteClinics,
    onSuccess: () => {
      antMessage.success('Clinics deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
      setSelectedRowKeys([]);
    },
    onError: (error: any) => {
      antMessage.error(error?.response?.data?.message || 'Failed to delete clinics');
    },
  });

  // Computed values
  const clinics = clinicsResponse?.data || [];
  const total = clinicsResponse?.total || 0;

  // Handlers
  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  }, []);

  const handleCityFilter = useCallback((value: string | null) => {
    setSelectedCity(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilter = useCallback((value: boolean | null) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchText('');
    setSelectedCity(null);
    setSelectedStatus(null);
    setCurrentPage(1);
  }, []);

  const handleTableChange = useCallback((pagination: any, _filters: any, sorter: any) => {
    if (pagination.current !== currentPage) {
      setCurrentPage(pagination.current);
    }
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrentPage(1);
    }
    if (sorter.field !== sortBy || sorter.order !== sortOrder) {
      setSortBy(sorter.field || 'name');
      setSortOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC');
    }
  }, [currentPage, pageSize, sortBy, sortOrder]);

  const showModal = useCallback((clinic?: Clinic) => {
    setEditingClinic(clinic || null);
    setIsModalVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsModalVisible(false);
    setEditingClinic(null);
  }, []);

  const handleSubmit = useCallback(async (values: any) => {
    if (editingClinic) {
      await updateClinicMutation.mutateAsync({
        id: editingClinic.id,
        data: values,
      });
    } else {
      await createClinicMutation.mutateAsync(values);
    }
  }, [editingClinic, updateClinicMutation, createClinicMutation]);

  const handleDeleteClinic = useCallback(async (clinicId: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this clinic?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        await deleteClinicMutation.mutateAsync(clinicId);
      },
    });
  }, [deleteClinicMutation]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedRowKeys.length === 0) return;

    Modal.confirm({
      title: `Are you sure you want to delete ${selectedRowKeys.length} clinic(s)?`,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        await bulkDeleteMutation.mutateAsync(selectedRowKeys);
      },
    });
  }, [selectedRowKeys, bulkDeleteMutation]);

  const handleExport = useCallback(async () => {
    try {
      const blob = await ClinicsService.exportClinics({
        search: searchText || undefined,
        city: selectedCity || undefined,
        isActive: selectedStatus !== null ? selectedStatus : undefined,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clinics-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      antMessage.success('Clinics exported successfully');
    } catch (error: any) {
      antMessage.error(error?.response?.data?.message || 'Failed to export clinics');
    }
  }, [searchText, selectedCity, selectedStatus]);

  return {
    // State
    clinics,
    loading,
    total,
    currentPage,
    pageSize,
    searchText,
    selectedCity,
    selectedStatus,
    sortBy,
    sortOrder,
    selectedRowKeys,
    bulkLoading: bulkDeleteMutation.isPending,
    isModalVisible,
    editingClinic,
    modalLoading: createClinicMutation.isPending || updateClinicMutation.isPending,

    // Actions
    setCurrentPage,
    setPageSize,
    handleSearch,
    handleCityFilter,
    handleStatusFilter,
    clearFilters,
    handleTableChange,
    showModal,
    hideModal,
    handleSubmit,
    handleDeleteClinic,
    handleBulkDelete,
    handleExport,
    setSelectedRowKeys,
  };
};

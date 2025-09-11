import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { ContactService } from '@/services/contact.service';
import type { 
  Contact, 
  ContactFilters, 
  ContactStats, 
  UpdateContactData,
  CreateContactResponseData,
  UpdateContactResponseData 
} from '@/types';

interface UseContactsParams {
  filters?: ContactFilters;
  page?: number;
  limit?: number;
}

interface UseContactsReturn {
  contacts: Contact[];
  loading: boolean;
  error: Error | null;
  filters: ContactFilters;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  stats: ContactStats | null;
  statsLoading: boolean;
  
  handleFilters: (newFilters: ContactFilters) => void;
  handlePagination: (page: number, pageSize: number) => void;
  handleUpdateContact: (id: string, data: UpdateContactData) => Promise<Contact>;
  handleDeleteContact: (id: string) => Promise<void>;
  handleExport: (filters?: ContactFilters) => Promise<void>;
  handleCreateResponse: (contactId: string, data: CreateContactResponseData) => Promise<void>;
  handleUpdateResponse: (contactId: string, responseId: string, data: UpdateContactResponseData) => Promise<void>;
  handleDeleteResponse: (contactId: string, responseId: string) => Promise<void>;
  clearError: () => void;
}

export const useContacts = (params: UseContactsParams = {}): UseContactsReturn => {
  const { filters = {}, page = 1, limit = 10 } = params;
  const queryClient = useQueryClient();

  // Fetch contacts
  const {
    data: contactsData,
    isLoading: contactsLoading,
    error: contactsError,
  } = useQuery({
    queryKey: ['contacts', filters, page, limit],
    queryFn: () => ContactService.getAll(filters, page, limit),
  });

  // Fetch stats
  const {
    data: stats,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ['contact-stats'],
    queryFn: ContactService.getStats,
  });

  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactData }) =>
      ContactService.update(id, data),
    onSuccess: () => {
      message.success('Contact updated successfully');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact-stats'] });
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to update contact');
    },
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: ContactService.delete,
    onSuccess: () => {
      message.success('Contact deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact-stats'] });
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to delete contact');
    },
  });

  // Export contacts mutation
  const exportMutation = useMutation({
    mutationFn: ContactService.export,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success('Contacts exported successfully');
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to export contacts');
    },
  });

  // Create response mutation
  const createResponseMutation = useMutation({
    mutationFn: ({ contactId, data }: { contactId: string; data: CreateContactResponseData }) =>
      ContactService.createResponse(contactId, data),
    onSuccess: () => {
      message.success('Response sent successfully');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to send response');
    },
  });

  // Update response mutation
  const updateResponseMutation = useMutation({
    mutationFn: ({ contactId, responseId, data }: { contactId: string; responseId: string; data: UpdateContactResponseData }) =>
      ContactService.updateResponse(contactId, responseId, data),
    onSuccess: () => {
      message.success('Response updated successfully');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to update response');
    },
  });

  // Delete response mutation
  const deleteResponseMutation = useMutation({
    mutationFn: ({ contactId, responseId }: { contactId: string; responseId: string }) =>
      ContactService.deleteResponse(contactId, responseId),
    onSuccess: () => {
      message.success('Response deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to delete response');
    },
  });

  const handleFilters = (newFilters: ContactFilters) => {
    // This would typically update URL params or state
    console.log('Update filters:', newFilters);
  };

  const handlePagination = (newPage: number, newPageSize: number) => {
    // This would typically update URL params or state
    console.log('Update pagination:', newPage, newPageSize);
  };

  const handleUpdateContact = async (id: string, data: UpdateContactData): Promise<Contact> => {
    return updateContactMutation.mutateAsync({ id, data });
  };

  const handleDeleteContact = async (id: string): Promise<void> => {
    await deleteContactMutation.mutateAsync(id);
  };

  const handleExport = async (exportFilters?: ContactFilters): Promise<void> => {
    await exportMutation.mutateAsync(exportFilters || filters);
  };

  const handleCreateResponse = async (contactId: string, data: CreateContactResponseData): Promise<void> => {
    await createResponseMutation.mutateAsync({ contactId, data });
  };

  const handleUpdateResponse = async (contactId: string, responseId: string, data: UpdateContactResponseData): Promise<void> => {
    await updateResponseMutation.mutateAsync({ contactId, responseId, data });
  };

  const handleDeleteResponse = async (contactId: string, responseId: string): Promise<void> => {
    await deleteResponseMutation.mutateAsync({ contactId, responseId });
  };

  const clearError = () => {
    // Clear any error state
  };

  return {
    contacts: contactsData?.data || [],
    loading: contactsLoading,
    error: contactsError as Error | null,
    filters,
    pagination: {
      current: page,
      pageSize: limit,
      total: contactsData?.total || 0,
    },
    stats,
    statsLoading,
    handleFilters,
    handlePagination,
    handleUpdateContact,
    handleDeleteContact,
    handleExport,
    handleCreateResponse,
    handleUpdateResponse,
    handleDeleteResponse,
    clearError,
  };
};

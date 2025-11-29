import {
	ResourceFormModal,
	ResourceViewModal,
	ResourcesFilters,
	ResourcesPageHeader,
	ResourcesTable,
} from '@/components/resources';
import { Button, Card, Typography, message } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useResourceForm, useResources } from '@/hooks/resources';
import type { Resource } from '@/types/resources';
import { ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

function ResourcesPage() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedIsActive, setSelectedIsActive] = useState<boolean | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const {
    createResource,
    getResources,
    getResource,
    updateResource,
    deleteResource,
    bulkDeleteResources,
    loading: apiLoading,
    error,
  } = useResources();

  const createForm = useResourceForm();
  const editForm = useResourceForm(selectedResource || undefined);

  const [resources, setResources] = useState<Resource[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadResources = async () => {
    setLoading(true);
    const result = await getResources(
      currentPage,
      pageSize,
      selectedType || undefined,
      selectedIsActive
    );
    if (result) {
      setResources(result.data);
      setTotalCount(result.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadResources();
  }, [currentPage, pageSize, selectedType, selectedIsActive]);

  const filteredResources = useMemo(() => {
    return resources?.filter(
      resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [resources, searchTerm]);

  const handleCreate = async (): Promise<boolean> => {
    const success = await createForm.handleSubmit(async data => {
      const result = await createResource(data as Parameters<typeof createResource>[0]);
      if (result) {
        setShowCreateModal(false);
        createForm.resetForm();
        await loadResources();
        message.success('Resource created successfully');
      }
    });
    return success ?? false;
  };

  const handleEdit = async (): Promise<boolean> => {
    if (!selectedResource) return false;
    const success = await editForm.handleSubmit(async data => {
      const result = await updateResource(selectedResource.id, data);
      if (result) {
        setShowEditModal(false);
        setSelectedResource(null);
        editForm.resetForm();
        await loadResources();
        message.success('Resource updated successfully');
      }
    });
    return success ?? false;
  };

  const handleDelete = async (id: string) => {
    const success = await deleteResource(id);
    if (success) {
      await loadResources();
      setSelectedIds(prev => prev.filter(idToRemove => idToRemove !== id));
      message.success('Resource deleted successfully');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const success = await bulkDeleteResources(selectedIds);
    if (success) {
      await loadResources();
      setSelectedIds([]);
      message.success(`${selectedIds.length} resources deleted successfully`);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  const handleIsActiveChange = (value: boolean | undefined) => {
    setSelectedIsActive(value);
    setCurrentPage(1);
  };

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedIsActive(undefined);
    setCurrentPage(1);
  }, []);

  const getTypeColor = useCallback((type: string) => {
    const colorMap: Record<string, 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'default'> = {
      video: 'blue',
      discord: 'green',
      audio: 'orange',
    };
    return colorMap[type.toLowerCase()] || 'default';
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(filteredResources.map(r => r.id));
      } else {
        setSelectedIds([]);
      }
    },
    [filteredResources]
  );

  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  }, []);

  const handleViewResource = useCallback(
    async (resource: Resource) => {
      const resourceData = await getResource(resource.id);
      setSelectedResource(resourceData || null);
      setShowViewModal(true);
    },
    [getResource]
  );

  const handleEditResource = useCallback(
    async (resource: Resource) => {
      const resourceData = await getResource(resource.id);
      setSelectedResource(resourceData || null);
      if (resourceData) {
        editForm.resetForm(resourceData);
      }
      setShowEditModal(true);
    },
    [getResource, editForm]
  );

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Card>
          <div className='text-center'>
            <Text type='danger' className='block mb-4'>
              Error: {error.message}
            </Text>
            <Button onClick={loadResources} icon={<ReloadOutlined />}>
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <ResourcesPageHeader
        onCreate={() => setShowCreateModal(true)}
        selectedCount={selectedIds.length}
        onBulkDelete={handleBulkDelete}
        loading={apiLoading}
      />

      <ResourcesFilters
        searchTerm={searchTerm}
        selectedType={selectedType}
        selectedIsActive={selectedIsActive}
        onSearch={handleSearch}
        onTypeChange={handleTypeChange}
        onIsActiveChange={handleIsActiveChange}
        onClearFilters={handleClearFilters}
      />

      <ResourcesTable
        resources={filteredResources}
        loading={loading}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        selectedIds={selectedIds}
        onPageChange={setCurrentPage}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onView={handleViewResource}
        onEdit={handleEditResource}
        onDelete={handleDelete}
        getTypeColor={getTypeColor}
      />

      <ResourceFormModal
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
          createForm.resetForm();
        }}
        onSubmit={handleCreate}
        form={createForm}
        isLoading={apiLoading || createForm.isSubmitting}
        isEdit={false}
      />

      <ResourceFormModal
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          setSelectedResource(null);
          editForm.resetForm();
        }}
        onSubmit={handleEdit}
        form={editForm}
        isLoading={apiLoading || editForm.isSubmitting}
        isEdit={true}
        resource={selectedResource}
      />

      <ResourceViewModal
        resource={selectedResource}
        open={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedResource(null);
        }}
        getTypeColor={getTypeColor}
      />
    </div>
  );
}

export { ResourcesPage };
export default ResourcesPage;

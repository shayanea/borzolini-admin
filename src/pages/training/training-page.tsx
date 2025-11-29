import {
	TrainingDetailsModal,
	TrainingFilters,
	TrainingFormModal,
	TrainingPageHeader,
	TrainingTable,
} from '@/components/training';
import { useTraining, useTrainingForm } from '@/hooks/training';
import type { TrainingActivity, TrainingSearchParams } from '@/types/training';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Card, message } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

function TrainingPage() {
  const [selectedActivity, setSelectedActivity] = useState<TrainingActivity | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const {
    createTrainingActivity,
    getTrainingActivities,
    getTrainingActivity,
    updateTrainingActivity,
    deleteTrainingActivity,
    bulkDeleteTrainingActivities,
    loading: apiLoading,
    error,
  } = useTraining();

  const createForm = useTrainingForm();
  const editForm = useTrainingForm(selectedActivity || undefined);

  const [activities, setActivities] = useState<TrainingActivity[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadActivities = async () => {
    setLoading(true);
    const params: TrainingSearchParams = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchTerm) params.q = searchTerm;
    if (selectedSpecies.length > 0) params.species = selectedSpecies.join(',');
    if (selectedDifficulty)
      params.difficulty = selectedDifficulty as 'easy' | 'moderate' | 'advanced';
    if (selectedTags.length > 0) params.tags = selectedTags.join(',');

    const result = await getTrainingActivities(
      params.page!,
      params.limit!,
      params.q,
      params.species,
      params.difficulty,
      'created_at',
      'DESC'
    );

    if (result) {
      setActivities(result.data);
      setTotalCount(result.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    pageSize,
    searchTerm,
    selectedSpecies,
    selectedDifficulty,
    selectedTags,
  ]);

  const filteredActivities = useMemo(() => {
    return activities.filter(
      (activity: TrainingActivity) =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activities, searchTerm]);

  const handleCreate = async (): Promise<boolean> => {
    const success = await createForm.handleSubmit(async data => {
      const result = await createTrainingActivity(
        data as Parameters<typeof createTrainingActivity>[0]
      );
      if (result) {
        setShowCreateModal(false);
        createForm.resetForm();
        await loadActivities();
      }
    });
    return success ?? false;
  };

  const handleEdit = async (): Promise<boolean> => {
    if (!selectedActivity) return false;
    const success = await editForm.handleSubmit(async data => {
      const result = await updateTrainingActivity(selectedActivity.id, data);
      if (result) {
        setShowEditModal(false);
        setSelectedActivity(null);
        editForm.resetForm();
        await loadActivities();
      }
    });
    return success ?? false;
  };

  const handleDelete = async (id: string) => {
    const success = await deleteTrainingActivity(id);
    if (success) {
      await loadActivities();
      setSelectedIds(prev => prev.filter(activityId => activityId !== id));
      message.success('Training activity deleted successfully');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const success = await bulkDeleteTrainingActivities(selectedIds);
    if (success) {
      await loadActivities();
      setSelectedIds([]);
      message.success(`${selectedIds.length} training activities deleted successfully`);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSpeciesChange = useCallback((value: string) => {
    setSelectedSpecies(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
    setCurrentPage(1);
  }, []);

  const handleDifficultyChange = useCallback((value: string) => {
    setSelectedDifficulty(value || '');
    setCurrentPage(1);
  }, []);

  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);
    setSelectedTags(tags.slice(0, 3));
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedSpecies([]);
    setSelectedDifficulty('');
    setSelectedTags([]);
    setCurrentPage(1);
  }, []);

  const handleViewActivity = useCallback(
    async (activity: TrainingActivity) => {
      try {
        // Use existing activity data first, then fetch fresh data in background
        setSelectedActivity(activity);
        setShowViewModal(true);
        
        // Fetch fresh data to ensure we have the latest
        const activityData = await getTrainingActivity(activity.id);
        if (activityData) {
          setSelectedActivity(activityData);
        }
      } catch (err) {
        console.error('Failed to fetch training activity:', err);
        message.error('Failed to load training activity details');
      }
    },
    [getTrainingActivity]
  );

  const handleEditActivity = useCallback(
    async (activity: TrainingActivity) => {
      try {
        // Use existing activity data first, then fetch fresh data
        setSelectedActivity(activity);
        editForm.resetForm(activity);
        
        // Fetch fresh data to ensure we have the latest
        const activityData = await getTrainingActivity(activity.id);
        if (activityData) {
          setSelectedActivity(activityData);
          editForm.resetForm(activityData);
        }
        setShowEditModal(true);
      } catch (err) {
        console.error('Failed to fetch training activity:', err);
        message.error('Failed to load training activity for editing');
      }
    },
    [getTrainingActivity, editForm]
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(filteredActivities.map((r: TrainingActivity) => r.id));
      } else {
        setSelectedIds([]);
      }
    },
    [filteredActivities]
  );

  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  }, []);

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Card>
          <div className='text-center'>
            <Alert
              message='Error'
              description={error.message}
              type='error'
              showIcon
              icon={<ExclamationCircleOutlined />}
              action={<Button onClick={loadActivities}>Retry</Button>}
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <TrainingPageHeader
        onCreate={() => setShowCreateModal(true)}
        selectedCount={selectedIds.length}
        onBulkDelete={handleBulkDelete}
        loading={apiLoading}
      />

      <TrainingFilters
        searchTerm={searchTerm}
        selectedSpecies={selectedSpecies}
        selectedDifficulty={selectedDifficulty}
        onSearch={handleSearch}
        onSpeciesChange={handleSpeciesChange}
        onDifficultyChange={handleDifficultyChange}
        onTagsChange={handleTagsChange}
        onClearFilters={handleClearFilters}
      />

      <TrainingTable
        activities={filteredActivities}
        loading={loading}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        selectedIds={selectedIds}
        onPageChange={setCurrentPage}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onView={handleViewActivity}
        onEdit={handleEditActivity}
        onDelete={handleDelete}
      />

      <TrainingFormModal
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
          createForm.resetForm();
        }}
        onSubmit={handleCreate}
        form={createForm}
        isLoading={apiLoading}
        isEdit={false}
      />

      <TrainingFormModal
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          setSelectedActivity(null);
          editForm.resetForm();
        }}
        onSubmit={handleEdit}
        form={editForm}
        isLoading={apiLoading}
        isEdit={true}
        activity={selectedActivity || undefined}
      />

      <TrainingDetailsModal
        activity={selectedActivity}
        open={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedActivity(null);
        }}
      />
    </div>
  );
}

export { TrainingPage };
export default TrainingPage;

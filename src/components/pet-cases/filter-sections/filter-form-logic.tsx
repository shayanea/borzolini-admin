import { CaseFilters } from '../../../types/pet-cases';
// Filter Form Logic Hook
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useCallback } from 'react';

interface UseFilterFormLogicProps {
  filters: CaseFilters;
  onFiltersChange: (filters: CaseFilters) => void;
  onReset: () => void;
}

const cleanFilters = (filters: CaseFilters): CaseFilters => {
  const cleaned = { ...filters };
  Object.keys(cleaned).forEach(key => {
    const typedKey = key as keyof CaseFilters;
    if (cleaned[typedKey] === undefined || cleaned[typedKey] === null) {
      delete cleaned[typedKey];
    }
  });
  return cleaned;
};

const getInitialValues = (filters: CaseFilters) => ({
  status: filters.status || [],
  priority: filters.priority || [],
  case_type: filters.case_type || [],
  pet_id: filters.pet_id || '',
  owner_id: filters.owner_id || '',
  vet_id: filters.vet_id || '',
  is_urgent: filters.is_urgent || false,
  is_resolved: filters.is_resolved || false,
  dateRange:
    filters.date_from && filters.date_to
      ? [dayjs(filters.date_from), dayjs(filters.date_to)]
      : undefined,
});

export const useFilterFormLogic = ({
  filters,
  onFiltersChange,
  onReset,
}: UseFilterFormLogicProps) => {
  const [form] = Form.useForm();

  const handleValuesChange = useCallback(
    (_changedValues: any, allValues: any) => {
      const newFilters: CaseFilters = {
        ...filters,
        ...allValues,
        date_from: allValues.dateRange?.[0]?.toISOString(),
        date_to: allValues.dateRange?.[1]?.toISOString(),
      };

      const cleanedFilters = cleanFilters(newFilters);
      onFiltersChange(cleanedFilters);
    },
    [filters, onFiltersChange]
  );

  const handleReset = useCallback(() => {
    form.resetFields();
    onReset();
  }, [form, onReset]);

  const initialValues = getInitialValues(filters);

  return {
    form,
    handleValuesChange,
    handleReset,
    initialValues,
  };
};

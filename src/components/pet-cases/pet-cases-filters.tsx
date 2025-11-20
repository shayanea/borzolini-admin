import { Button, Form, Space } from 'antd';
// Pet Cases Filters Component
import { ClearOutlined, FilterOutlined } from '@ant-design/icons';
import { InputFilters, QuickFilters, SelectFilters } from './filter-sections';

import { CaseFilters } from '../../types/pet-cases';
import { useFilterFormLogic } from './filter-sections/filter-form-logic';

interface PetCasesFiltersProps {
  filters: CaseFilters;
  onFiltersChange: (filters: CaseFilters) => void;
  onReset: () => void;
  loading?: boolean;
}

function PetCasesFilters({
  filters,
  onFiltersChange,
  onReset,
  loading = false,
}: PetCasesFiltersProps) {
  const { form, handleValuesChange, handleReset, initialValues } = useFilterFormLogic({
    filters,
    onFiltersChange,
    onReset,
  });

  return (
    <div className='admin-card p-6 mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-gray-900'>Filter Cases</h3>
        <Space>
          <Button
            type='primary'
            icon={<FilterOutlined />}
            loading={loading}
            className='bg-primary-navy hover:bg-primary-navy/90'
          >
            Apply Filters
          </Button>
          <Button
            icon={<ClearOutlined />}
            onClick={handleReset}
            disabled={loading}
            className='border-gray-300 text-gray-700 hover:border-gray-400'
          >
            Reset
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout='vertical'
        onValuesChange={handleValuesChange}
        initialValues={initialValues}
        className='admin-filters'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          <SelectFilters loading={loading} />
          <InputFilters />
          <QuickFilters />
        </div>
      </Form>
    </div>
  );
}

export { PetCasesFilters };
export default PetCasesFilters;

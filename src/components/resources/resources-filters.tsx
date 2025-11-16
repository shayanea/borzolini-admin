import { Button, Card, Input, Select, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React from 'react';
import { ResourceType } from '@/types/resources';

const { Option } = Select;
const { Title, Text } = Typography;

interface ResourcesFiltersProps {
  searchTerm: string;
  selectedType: string;
  selectedIsActive?: boolean;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (value: string) => void;
  onIsActiveChange: (value: boolean | undefined) => void;
  onClearFilters: () => void;
}

export const ResourcesFilters: React.FC<ResourcesFiltersProps> = ({
  searchTerm,
  selectedType,
  selectedIsActive,
  onSearch,
  onTypeChange,
  onIsActiveChange,
  onClearFilters,
}) => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>Filters</Title>
        <Button 
          type="default"
          size="small"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Text strong>Search Resources</Text>
          <Input
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={onSearch}
            prefix={<SearchOutlined />}
            className="mt-1"
          />
        </div>
        <div className="flex-1">
          <Text strong>Type</Text>
          <Select 
            value={selectedType} 
            onChange={onTypeChange}
            className="w-full mt-1"
            placeholder="All types"
          >
            <Option value="">All Types</Option>
            <Option value={ResourceType.VIDEO}>Video</Option>
            <Option value={ResourceType.DISCORD}>Discord</Option>
            <Option value={ResourceType.AUDIO}>Audio</Option>
          </Select>
        </div>
        <div className="flex-1">
          <Text strong>Status</Text>
          <Select 
            value={selectedIsActive === undefined ? '' : selectedIsActive.toString()} 
            onChange={(value) => onIsActiveChange(value === '' ? undefined : value === 'true')}
            className="w-full mt-1"
            placeholder="All statuses"
          >
            <Option value="">All Statuses</Option>
            <Option value="true">Active</Option>
            <Option value="false">Inactive</Option>
          </Select>
        </div>
      </div>
    </Card>
  );
};


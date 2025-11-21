import { Button, Card, Input, Select, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React from 'react';
import { PetSpecies } from '@/types/breeds';

const { Option } = Select;
const { Title, Text } = Typography;

interface BreedsFiltersProps {
  searchTerm: string;
  selectedSpecies: string;
  selectedIsActive?: boolean;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSpeciesChange: (value: string) => void;
  onIsActiveChange: (value: boolean | undefined) => void;
  onClearFilters: () => void;
}

export function BreedsFilters({
  searchTerm,
  selectedSpecies,
  selectedIsActive,
  onSearch,
  onSpeciesChange,
  onIsActiveChange,
  onClearFilters,
}: BreedsFiltersProps) {
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
          <Text strong>Search Breeds</Text>
          <Input
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={onSearch}
            prefix={<SearchOutlined />}
            className="mt-1"
          />
        </div>
        <div className="flex-1">
          <Text strong>Species</Text>
          <Select 
            value={selectedSpecies} 
            onChange={onSpeciesChange}
            className="w-full mt-1"
            placeholder="All species"
          >
            <Option value="">All Species</Option>
            <Option value={PetSpecies.DOG}>Dog</Option>
            <Option value={PetSpecies.CAT}>Cat</Option>
            <Option value={PetSpecies.BIRD}>Bird</Option>
            <Option value={PetSpecies.RABBIT}>Rabbit</Option>
            <Option value={PetSpecies.HAMSTER}>Hamster</Option>
            <Option value={PetSpecies.FISH}>Fish</Option>
            <Option value={PetSpecies.REPTILE}>Reptile</Option>
            <Option value={PetSpecies.HORSE}>Horse</Option>
            <Option value={PetSpecies.OTHER}>Other</Option>
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
}


import { Card, Input, Select, Tabs, Typography } from 'antd';

import { SPECIES_OPTIONS } from '@/types/household-safety';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

interface HouseholdSafetyFiltersProps {
  activeTab: string;
  searchTerm: string;
  selectedSpecies: string;
  onTabChange: (key: string) => void;
  onSearchChange: (value: string) => void;
  onSpeciesChange: (value: string) => void;
}

export function HouseholdSafetyFilters({
  activeTab,
  searchTerm,
  selectedSpecies,
  onTabChange,
  onSearchChange,
  onSpeciesChange,
}: HouseholdSafetyFiltersProps) {
  const tabItems = [
    {
      key: 'all',
      label: 'All Items',
      children: (
        <div className='space-y-4 mt-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='md:col-span-2'>
              <Text strong>Search items</Text>
              <Input
                placeholder='Search for foods, plants, or household items...'
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                prefix={<SearchOutlined />}
                className='mt-1'
              />
            </div>
            <div>
              <Text strong>Filter by species</Text>
              <Select value={selectedSpecies} onChange={onSpeciesChange} className='w-full mt-1'>
                {SPECIES_OPTIONS.map(species => (
                  <Option key={species.value} value={species.value}>
                    {species.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'foods',
      label: '🍎 Foods',
      children: (
        <div className='space-y-4 mt-4'>
          <div>
            <Text strong>Filter by species</Text>
            <Select value={selectedSpecies} onChange={onSpeciesChange} className='w-full mt-1'>
              {SPECIES_OPTIONS.map(species => (
                <Option key={species.value} value={species.value}>
                  {species.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      ),
    },
    {
      key: 'plants',
      label: '🌿 Plants',
      children: (
        <div className='space-y-4 mt-4'>
          <div>
            <Text strong>Filter by species</Text>
            <Select value={selectedSpecies} onChange={onSpeciesChange} className='w-full mt-1'>
              {SPECIES_OPTIONS.map(species => (
                <Option key={species.value} value={species.value}>
                  {species.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      ),
    },
    {
      key: 'household',
      label: '🏠 Household',
      children: (
        <div className='space-y-4 mt-4'>
          <div>
            <Text strong>Filter by species</Text>
            <Select value={selectedSpecies} onChange={onSpeciesChange} className='w-full mt-1'>
              {SPECIES_OPTIONS.map(species => (
                <Option key={species.value} value={species.value}>
                  {species.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <Tabs activeKey={activeTab} onChange={onTabChange} items={tabItems} />
    </Card>
  );
}

import { Button, Card, Col, Input, Row, Select, Segmented, Space, Tooltip } from 'antd';
import { COMMON_BREEDS, PET_GENDERS, PET_SIZES, PET_SPECIES } from '@/constants/pets';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

import type { PetFiltersProps } from '@/types';
import { useTranslation } from 'react-i18next';

const { Search } = Input;
const { Option } = Select;

// Get values from constants
const petSpecies = Object.values(PET_SPECIES);
const genders = Object.values(PET_GENDERS);
const sizes = Object.values(PET_SIZES);

// Common breeds based on API examples - using first few from each species
const breeds = [
  ...COMMON_BREEDS[PET_SPECIES.CAT].slice(0, 3),
  ...COMMON_BREEDS[PET_SPECIES.DOG].slice(0, 6),
];

const PetFilters = ({
  searchText,
  selectedSpecies,
  selectedBreed,
  selectedGender,
  selectedSize,
  isActiveFilter,
  onSearch,
  onSpeciesFilter,
  onBreedFilter,
  onGenderFilter,
  onSizeFilter,
  onActiveFilter,
  onClearFilters,
}: PetFiltersProps) => {
  const { t } = useTranslation('components');

  return (
    <Card className='admin-card admin-filters'>
      {/* Primary controls */}
      <Row gutter={[12, 12]} align='middle' className='mb-3'>
        <Col xs={24} md={8}>
          <Search
            placeholder={t('petManagement.searchPlaceholder')}
            allowClear
            value={searchText}
            onSearch={onSearch}
            prefix={<SearchOutlined />}
            className='w-full'
          />
        </Col>
        <Col xs={24} md={8}>
          <Space size='small' className='w-full' direction='horizontal'>
            <Tooltip title={t('petManagement.species')}>
              <Segmented
                className='w-full'
                options={petSpecies.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))}
                value={selectedSpecies}
                onChange={val => onSpeciesFilter(val as string)}
              />
            </Tooltip>
          </Space>
        </Col>
        <Col xs={24} md={8}>
          <Space size='small' className='w-full' direction='horizontal'>
            <Tooltip title={t('petManagement.gender')}>
              <Segmented
                className='w-full'
                options={genders.map(g => ({ label: g.charAt(0).toUpperCase() + g.slice(1), value: g }))}
                value={selectedGender}
                onChange={val => onGenderFilter(val as string)}
              />
            </Tooltip>
          </Space>
        </Col>
      </Row>

      {/* Advanced controls */}
      <Row gutter={[12, 12]} align='middle'>
        <Col xs={24} md={6}>
          <Select
            showSearch
            optionFilterProp='children'
            placeholder={t('petManagement.breed')}
            allowClear
            value={selectedBreed}
            onChange={onBreedFilter}
            className='w-full'
          >
            {breeds.map(breed => (
              <Option key={breed} value={breed}>
                {breed}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={6}>
          <Select
            placeholder={t('petManagement.size')}
            allowClear
            value={selectedSize}
            onChange={onSizeFilter}
            className='w-full'
          >
            {sizes.map(size => (
              <Option key={size} value={size}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={6}>
          <Select
            placeholder={t('userManagement.status')}
            allowClear
            value={isActiveFilter}
            onChange={onActiveFilter}
            className='w-full'
          >
            <Option value={true}>{t('userManagement.active')}</Option>
            <Option value={false}>{t('userManagement.inactive')}</Option>
          </Select>
        </Col>
        <Col xs={24} md={6}>
          <div className='flex md:justify-end'>
            <Button icon={<FilterOutlined />} onClick={onClearFilters}>
              {t('petManagement.clearFilters')}
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default PetFilters;

import { Button, Card, Col, Input, Row, Select } from 'antd';
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
      {/* First Row */}
      <Row gutter={[16, 16]} className='mb-4'>
        <Col xs={24} sm={12} md={6}>
          <Search
            placeholder={t('petManagement.searchPlaceholder')}
            allowClear
            value={searchText}
            onSearch={onSearch}
            prefix={<SearchOutlined />}
            className='w-full'
          />
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Select
            placeholder={t('petManagement.species')}
            allowClear
            value={selectedSpecies}
            onChange={onSpeciesFilter}
            className='w-full'
          >
            {petSpecies.map(species => (
              <Option key={species} value={species}>
                {species.charAt(0).toUpperCase() + species.slice(1)}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Select
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
        <Col xs={24} sm={12} md={4}>
          <Select
            placeholder={t('petManagement.gender')}
            allowClear
            value={selectedGender}
            onChange={onGenderFilter}
            className='w-full'
          >
            {genders.map(gender => (
              <Option key={gender} value={gender}>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={4}>
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
      </Row>

      {/* Second Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={4}>
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
        <Col xs={24} sm={12} md={4}>
          <Button icon={<FilterOutlined />} onClick={onClearFilters} className='w-full'>
            {t('petManagement.clearFilters')}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export { PetFilters };
export default PetFilters;

import { COMMON_BREEDS, PET_SIZES, PET_SPECIES } from '@/constants/pets';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Select } from 'antd';

import type { PetFiltersProps } from '@/types';
import { useTranslation } from 'react-i18next';

const { Search } = Input;

// Get values from constants
const petSpecies = Object.values(PET_SPECIES);
const sizes = Object.values(PET_SIZES);

// Common breeds based on API examples
const breeds = [
	...COMMON_BREEDS[PET_SPECIES.CAT].slice(0, 3),
	...COMMON_BREEDS[PET_SPECIES.DOG].slice(0, 6),
];

const PetFilters = ({
	searchText,
	selectedSpecies,
	selectedBreed,
	selectedSize,
	onSearch,
	onSpeciesFilter,
	onBreedFilter,
	onSizeFilter,
}: PetFiltersProps) => {
	const { t } = useTranslation('components');

	const speciesOptions = [
		{ label: 'All Species', value: null },
		...petSpecies.map(species => ({
			label: species.charAt(0).toUpperCase() + species.slice(1),
			value: species,
		})),
	];

	const breedOptions = [
		{ label: 'All Breeds', value: null },
		...breeds.map(breed => ({
			label: breed,
			value: breed,
		})),
	];

	const sizeOptions = [
		{ label: 'All Sizes', value: null },
		...sizes.map(size => ({
			label: size.charAt(0).toUpperCase() + size.slice(1),
			value: size,
		})),
	];

	return (
		<div className='bg-white rounded-lg border border-gray-200 p-3 mb-4'>
			<div className='flex items-center gap-3'>
				<div className='flex-1'>
					<Search
						placeholder={t('petManagement.searchPlaceholder')}
						allowClear
						value={searchText}
						onChange={(e) => onSearch(e.target.value)}
						onSearch={onSearch}
						prefix={<SearchOutlined />}
						className='w-full'
					/>
				</div>
				<div className='w-40'>
					<Select
						placeholder='Species'
						value={selectedSpecies}
						onChange={onSpeciesFilter}
						options={speciesOptions}
						className='w-full'
					/>
				</div>
				<div className='w-40'>
					<Select
						placeholder='Breed'
						value={selectedBreed}
						onChange={onBreedFilter}
						options={breedOptions}
						className='w-full'
					/>
				</div>
				<div className='w-32'>
					<Select
						placeholder='Size'
						value={selectedSize}
						onChange={onSizeFilter}
						options={sizeOptions}
						className='w-full'
					/>
				</div>
			</div>
		</div>
	);
};

export { PetFilters };
export default PetFilters;

import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import type { PetPageHeaderProps } from '@/types';
import { useTranslation } from 'react-i18next';

const PetPageHeader = ({
	onAddPet,
	onRefresh,
	loading = false,
	stats,
	onQuickGenderFilter,
}: PetPageHeaderProps) => {
	const { t } = useTranslation('components');

	return (
		<div className='bg-white rounded-lg border border-gray-200 p-4 mb-4'>
			<div className='flex items-center justify-between gap-4'>
				<div>
					<h1 className='text-xl font-bold text-gray-900 mb-0.5'>
						{t('petManagement.title')}
					</h1>
					<p className='text-sm text-gray-500'>
						{t('petManagement.subtitle')}
					</p>
				</div>

				<div className='flex items-center gap-2'>
					<Button
						type='text'
						icon={<ReloadOutlined />}
						onClick={onRefresh}
						loading={loading}
						className='text-gray-600'
					>
						{t('petManagement.refresh')}
					</Button>

					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={onAddPet}
						className='bg-pink-600 hover:bg-pink-700'
					>
						{t('petManagement.addPet')}
					</Button>
				</div>
			</div>

			{stats && (
				<div className='flex flex-wrap items-center gap-2 mt-3'>
					<button
						type='button'
						onClick={() => onQuickGenderFilter?.(null)}
						className='px-3 py-1 rounded-md text-xs font-medium bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-colors'
					>
						All <span className='ml-1 font-semibold'>{stats.total}</span>
					</button>

					<button
						type='button'
						onClick={() => onQuickGenderFilter?.('male')}
						className='px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors'
					>
						Male <span className='ml-1 font-semibold'>{stats.maleCount}</span>
					</button>

					<button
						type='button'
						onClick={() => onQuickGenderFilter?.('female')}
						className='px-3 py-1 rounded-md text-xs font-medium bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors'
					>
						Female <span className='ml-1 font-semibold'>{stats.femaleCount}</span>
					</button>
				</div>
			)}
		</div>
	);
};

export { PetPageHeader };
export default PetPageHeader;

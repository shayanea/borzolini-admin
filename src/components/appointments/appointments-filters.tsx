import { APPOINTMENT_PRIORITIES, APPOINTMENT_TYPES } from '@/constants';
import type {
	AppointmentsFiltersProps,
	AppointmentsFilters as AppointmentsFiltersType
} from '@/types';
import {
	DeleteOutlined,
	SaveOutlined,
	SearchOutlined,
	StarOutlined,
	TagOutlined
} from '@ant-design/icons';
import {
	Button,
	DatePicker,
	Dropdown,
	Input,
	MenuProps,
	Modal,
	Select,
	Tooltip,
	message
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { Search } = Input;
const { RangePicker } = DatePicker;

interface SavedFilter {
	name: string;
	filters: Partial<AppointmentsFiltersType>;
}

const STORAGE_KEY = 'appointments_saved_filters';

const AppointmentsFilters = ({
	searchText,
	onSearch,
	onFilters,
	onExport,
}: AppointmentsFiltersProps) => {
	const { t } = useTranslation('components');
	const [filters, setFilters] = useState<Partial<AppointmentsFiltersType>>({});
	const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
	const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
	const [newFilterName, setNewFilterName] = useState('');

	// Load saved filters on mount
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				setSavedFilters(JSON.parse(saved));
			} catch (e) {
				console.error('Failed to parse saved filters', e);
			}
		}
	}, []);

	const handleFilterChange = (
		key: keyof AppointmentsFiltersType,
		value: any
	) => {
		const newFilters = { ...filters, [key]: value };
		// Remove undefined keys
		if (value === undefined || value === null) {
			delete newFilters[key];
		}
		setFilters(newFilters);
		onFilters(newFilters);
	};

	const clearFilters = () => {
		setFilters({});
		onFilters({});
	};

	// Preset Logic
	const applyPreset = (presetFilters: Partial<AppointmentsFiltersType>) => {
		setFilters(presetFilters);
		onFilters(presetFilters);
	};

	// Saved Filters Logic
	const saveFilter = () => {
		if (!newFilterName.trim()) {
			message.error(t('forms.common.enterPlaceholder') + ' Name');
			return;
		}
		const newSaved = [...savedFilters, { name: newFilterName, filters }];
		setSavedFilters(newSaved);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
		setIsSaveModalOpen(false);
		setNewFilterName('');
		message.success(t('messages.saved'));
	};

	const deleteSavedFilter = (index: number) => {
		const newSaved = savedFilters.filter((_, i) => i !== index);
		setSavedFilters(newSaved);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
		message.success(t('messages.deleted'));
	};

	const formatOptionLabel = (value: string) => {
		return value
			.split('_')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	const savedFiltersMenu: MenuProps['items'] = savedFilters.map((sf, index) => ({
		key: index,
		label: (
			<div className='flex items-center justify-between w-full min-w-[150px]'>
				<span onClick={() => applyPreset(sf.filters)}>{sf.name}</span>
				<DeleteOutlined
					className='text-red-500 ml-2 hover:bg-red-50 p-1 rounded'
					onClick={e => {
						e.stopPropagation();
						deleteSavedFilter(index);
					}}
				/>
			</div>
		),
	}));

	if (savedFilters.length === 0) {
		savedFiltersMenu.push({
			key: 'empty',
			label: <span className='text-gray-400 italic'>No saved filters</span>,
			disabled: true,
		});
	}

	return (
		<div className='bg-white rounded-lg border border-gray-200 p-3 mb-4'>
			<div className='flex flex-wrap items-center gap-3'>
				<div className='flex-1 min-w-[200px]'>
					<Search
						placeholder={t('appointments.searchPlaceholder')}
						allowClear
						value={searchText}
						onChange={e => onSearch(e.target.value)}
						onSearch={onSearch} // Handles Enter/Click
						prefix={<SearchOutlined />}
						className='w-full'
					/>
				</div>

				<div className='w-40'>
					<Select
						placeholder={t('appointments.type')}
						className='w-full'
						value={filters.type}
						onChange={value => handleFilterChange('type', value)}
						allowClear
						showSearch
						filterOption={(input, option) =>
							(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
						}
					>
						{Object.entries(APPOINTMENT_TYPES).map(([, value]) => (
							<Select.Option key={value} value={value}>
								{formatOptionLabel(value)}
							</Select.Option>
						))}
					</Select>
				</div>

				<div className='w-40'>
					<Select
						placeholder={t('appointments.priority')}
						className='w-full'
						value={filters.priority}
						onChange={value => handleFilterChange('priority', value)}
						allowClear
						showSearch
						filterOption={(input, option) =>
							(option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
						}
					>
						{Object.entries(APPOINTMENT_PRIORITIES).map(([, value]) => (
							<Select.Option key={value} value={value}>
								{formatOptionLabel(value)}
							</Select.Option>
						))}
					</Select>
				</div>

				<div className='w-64'>
					<RangePicker
						value={
							filters.dateRange
								? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])]
								: undefined
						}
						onChange={dates => {
							if (dates && dates.length === 2) {
								const dateRange: [string, string] = [
									dates[0]?.toISOString() || '',
									dates[1]?.toISOString() || '',
								];
								handleFilterChange('dateRange', dateRange);
							} else {
								handleFilterChange('dateRange', undefined);
							}
						}}
						placeholder={[t('appointments.startDate'), t('appointments.endDate')]}
						className='w-full'
					/>
				</div>

				<div className='flex items-center gap-1 ml-auto'>
					{Object.keys(filters).length > 0 && (
						<Tooltip title="Clear Filters">
							<Button
								type='text'
								danger
								icon={<DeleteOutlined />}
								onClick={clearFilters}
							/>
						</Tooltip>
					)}
					<Dropdown menu={{ items: savedFiltersMenu }} placement='bottomRight'>
						<Tooltip title="Saved Filters">
							<Button icon={<StarOutlined />} />
						</Tooltip>
					</Dropdown>

					<Tooltip title="Save Current View">
						<Button onClick={() => setIsSaveModalOpen(true)} icon={<SaveOutlined />} />
					</Tooltip>

					<Tooltip title="Export">
						<Button onClick={onExport} icon={<TagOutlined className="rotate-90" />} />
					</Tooltip>
				</div>
			</div>

			<Modal
				title='Save Filter Preset'
				open={isSaveModalOpen}
				onOk={saveFilter}
				onCancel={() => setIsSaveModalOpen(false)}
				okText={t('actions.save')}
				cancelText={t('actions.cancel')}
			>
				<p className='mb-2'>Give your filter a name:</p>
				<Input
					placeholder='e.g. My Morning Routine'
					value={newFilterName}
					onChange={e => setNewFilterName(e.target.value)}
					onPressEnter={saveFilter}
				/>
			</Modal>
		</div>
	);
};

export { AppointmentsFilters };
export default AppointmentsFilters;

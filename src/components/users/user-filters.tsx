import { SearchOutlined } from '@ant-design/icons';
import { DatePicker, Input, Select } from 'antd';
import dayjs from 'dayjs';

import type { UserFiltersProps } from '@/types/user-management';

const { Search } = Input;
const { RangePicker } = DatePicker;

const UserFilters = ({
	searchText,
	selectedRole,
	dateRange,
	onSearch,
	onRoleFilter,
	onDateRangeChange,
}: UserFiltersProps) => {
	const roleOptions = [
		{ label: 'All Roles', value: null },
		{ label: 'Admin', value: 'admin' },
		{ label: 'Veterinarian', value: 'veterinarian' },
		{ label: 'Staff', value: 'staff' },
		{ label: 'Patient', value: 'patient' },
		{ label: 'Clinic Admin', value: 'clinic_admin' },
	];

	return (
		<div className='bg-white rounded-lg border border-gray-200 p-3 mb-4'>
			<div className='flex items-center gap-3'>
				<div className='flex-1'>
					<Search
						placeholder='Search users...'
						allowClear
						value={searchText}
						onChange={(e) => onSearch(e.target.value)}
						onSearch={onSearch}
						prefix={<SearchOutlined />}
						className='w-full'
					/>
				</div>
				<div className='w-48'>
					<Select
						placeholder='Role'
						value={selectedRole}
						onChange={onRoleFilter}
						options={roleOptions}
						className='w-full'
					/>
				</div>
				<div className='w-80'>
					<RangePicker
						className='w-full'
						onChange={values => onDateRangeChange(values ? [values[0]!, values[1]!] : null)}
						value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
						placeholder={['Start date', 'End date']}
					/>
				</div>
			</div>
		</div>
	);
};

export { UserFilters };
export default UserFilters;

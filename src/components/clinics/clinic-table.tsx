import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	DeleteOutlined,
	DownOutlined,
	EditOutlined,
	EnvironmentOutlined,
	EyeOutlined,
	HeartOutlined,
	LinkOutlined,
	MailOutlined,
	MedicineBoxOutlined,
	PhoneOutlined,
	StarFilled,
	TeamOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Table, Tooltip, Typography } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';

import { TableSkeleton } from '@/components/shared';
import { ROUTES } from '@/constants/routes';
import type { Clinic } from '@/types';
import type { TablePaginationConfig } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const { Text, Link } = Typography;

interface ClinicTableProps {
	clinics: Clinic[];
	loading?: boolean;
	pagination?: TablePaginationConfig;
	rowSelection?: TableProps<Clinic>['rowSelection'];
	onChange?: TableProps<Clinic>['onChange'];
	onEdit: (clinic: Clinic) => void;
	onDelete: (clinicId: string) => void;
	onView?: (clinic: Clinic) => void;
	onViewStaff?: (clinic: Clinic) => void;
}

const ClinicTable = ({
	clinics,
	loading = false,
	pagination,
	rowSelection,
	onChange,
	onEdit,
	onDelete,
	onView,
	onViewStaff,
}: ClinicTableProps) => {
	const navigate = useNavigate();
	const { t } = useTranslation('components');

	if (loading && clinics.length === 0) {
		return <TableSkeleton />;
	}

	const handleViewPetCases = (clinic: Clinic) => {
		navigate(`${ROUTES.PET_CASES}?clinicId=${clinic.id}`);
	};

	const columns: ColumnsType<Clinic> = [
		{
			title: t('clinicTable.name'),
			dataIndex: 'name',
			key: 'name',
			sorter: true,
			render: (name: string, record: Clinic) => (
				<div className='flex items-center gap-2 py-1'>
					<div
						className='w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0'
						style={{ backgroundColor: '#06b6d4' }}
					>
						<MedicineBoxOutlined className='text-sm' />
					</div>
					<div className='flex-1 min-w-0'>
						<Link
							className='font-medium text-sm text-gray-900 hover:text-blue-600 block'
							href={`${ROUTES.CLINICS}/${record.id}`}
						>
							<Text ellipsis={{ tooltip: name }}>
								{name}
							</Text>
						</Link>
					</div>
				</div>
			),
		},
		{
			title: t('clinicTable.location'),
			key: 'location',
			width: 180,
			render: (_, record: Clinic) => (
				<div className='text-xs text-gray-600'>
					<div className='flex items-center gap-1 mb-0.5'>
						<EnvironmentOutlined className='text-[10px] text-gray-400' />
						<Text ellipsis={{ tooltip: record.address }} className='text-xs'>
							{record.address}
						</Text>
					</div>
					<div className='text-xs text-gray-500'>
						{record.city}{record.state && `, ${record.state}`}
					</div>
				</div>
			),
		},
		{
			title: t('clinicTable.contact'),
			key: 'contact',
			width: 200,
			render: (_, record: Clinic) => (
				<div className='space-y-1 text-xs'>
					{record.phone && (
						<div className='flex items-center gap-1 text-gray-600'>
							<PhoneOutlined className='text-[10px]' />
							<Text className='text-xs'>{record.phone}</Text>
						</div>
					)}
					{record.email && (
						<div className='flex items-center gap-1 text-gray-600'>
							<MailOutlined className='text-[10px]' />
							<Text ellipsis={{ tooltip: record.email }} className='text-xs'>{record.email}</Text>
						</div>
					)}
					{record.website && (
						<div className='flex items-center gap-1'>
							<LinkOutlined className='text-[10px] text-blue-500' />
							<Link
								href={record.website}
								target='_blank'
								className='text-xs text-blue-600 hover:text-blue-700'
							>
								Website
							</Link>
						</div>
					)}
				</div>
			),
		},
		{
			title: t('clinicTable.rating'),
			dataIndex: 'rating',
			key: 'rating',
			sorter: true,
			width: 100,
			align: 'center',
			render: (rating: number) => (
				<div
					className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${rating >= 4
						? 'bg-green-100 text-green-700 border-green-200'
						: rating >= 3
							? 'bg-yellow-100 text-yellow-700 border-yellow-200'
							: 'bg-red-100 text-red-700 border-red-200'
						}`}
				>
					<StarFilled className='text-[10px]' />
					<span>{rating.toFixed(1)}</span>
				</div>
			),
		},
		{
			title: t('clinicTable.services'),
			key: 'services',
			width: 100,
			align: 'center',
			render: (_, record: Clinic) => (
				<Tooltip
					title={
						<div className='flex flex-col gap-1'>
							{record.services.map((service, index) => (
								<span key={index}>{service}</span>
							))}
						</div>
					}
				>
					<span className='text-xs text-gray-600 cursor-help border-b border-dashed border-gray-400'>
						{record.services.length} {record.services.length === 1 ? 'service' : 'services'}
					</span>
				</Tooltip>
			),
		},
		{
			title: t('clinicTable.status'),
			dataIndex: 'isActive',
			key: 'isActive',
			width: 100,
			align: 'center',
			render: (isActive: boolean) => (
				<span
					className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${isActive
						? 'bg-green-100 text-green-700 border-green-200'
						: 'bg-gray-100 text-gray-600 border-gray-200'
						}`}
				>
					{isActive ? (
						<>
							<CheckCircleOutlined className='text-[10px]' />
							Active
						</>
					) : (
						<>
							<ClockCircleOutlined className='text-[10px]' />
							Inactive
						</>
					)}
				</span>
			),
		},
		{
			render: (_, record: Clinic) => {
				const items = [
					{
						key: 'view',
						label: t('clinicTable.viewDetails'),
						icon: <EyeOutlined className='text-blue-600' />,
						onClick: () => onView && onView(record),
					},
					{
						key: 'staff',
						label: t('clinicTable.viewStaffVeterinarians'),
						icon: <TeamOutlined className='text-green-600' />,
						onClick: () => onViewStaff && onViewStaff(record),
					},
					{
						key: 'pet-cases',
						label: t('clinicTable.viewPetCases'),
						icon: <HeartOutlined className='text-pink-600' />,
						onClick: () => handleViewPetCases(record),
					},
					{
						key: 'edit',
						label: t('clinicTable.editClinic'),
						icon: <EditOutlined className='text-orange-600' />,
						onClick: () => onEdit(record),
					},
					{
						key: 'delete',
						label: t('clinicTable.deleteClinic'),
						icon: <DeleteOutlined className='text-red-500' />,
						danger: true,
						onClick: () => onDelete(record.id),
					},
				];

				return (
					<Dropdown menu={{ items }} trigger={['click']}>
						<Button type='text' size='small' className='flex items-center gap-1 text-gray-500 hover:text-gray-700'>
							Actions
							<DownOutlined className='text-xs' />
						</Button>
					</Dropdown>
				);
			},
		},
	];

	return (
		<div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
			<Table
				columns={columns}
				dataSource={clinics}
				rowKey='id'
				loading={loading}
				pagination={pagination}
				rowSelection={rowSelection}
				onChange={onChange}
				size='small'
				className='compact-table'
				scroll={{ x: 1000 }}
				rowClassName='hover:bg-gray-50 transition-colors cursor-pointer'
				locale={{
					emptyText: loading ? null : (
						<div className='text-center py-12'>
							<MedicineBoxOutlined className='text-4xl text-gray-300 mb-2' />
							<div className='text-sm text-gray-500'>No clinics found</div>
						</div>
					),
				}}
			/>
		</div>
	);
};

export { ClinicTable };
export default ClinicTable;

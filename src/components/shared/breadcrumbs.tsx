import { ROUTES } from '@/constants';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
	const location = useLocation();
	const { t } = useTranslation();

	// Don't show breadcrumbs on dashboard or login
	if (location.pathname === ROUTES.DASHBOARD || location.pathname === ROUTES.LOGIN || location.pathname === '/') {
		return null;
	}

	const pathSnippets = location.pathname.split('/').filter(i => i);

	const extraBreadcrumbItems = pathSnippets.map((_, index) => {
		const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
		const isLast = index === pathSnippets.length - 1;
		const name = pathSnippets[index];

		const routeNameMap: Record<string, string> = {
			dashboard: 'Dashboard',
			appointments: 'Appointments',
			create: 'Create',
			edit: 'Edit',
			calendar: 'Calendar',
			reports: 'Reports',
			settings: 'Settings',
			users: 'Users',
			profile: 'Profile',
			veterinarians: 'Veterinarians',
			staff: 'Staff',
			patients: 'Patients',
			contacts: 'Contacts',
			clinics: 'Clinics',
			pets: 'Pets',
			'pet-cases': 'Pet Cases',
			reviews: 'Reviews',
			'role-demo': 'Role Demo',
			resources: 'Resources',
			training: 'Training',
			'household-safety': 'Household Safety',
			breeds: 'Breeds',
			admin: 'Admin',
		};

		if (pathSnippets[index - 1] === 'edit') {
			// Let's just try to formatted it if it's not in the map
		}

		const title = routeNameMap[name] || (name.charAt(0).toUpperCase() + name.slice(1));

		return {
			key: url,
			title: isLast ? (
				<span className="font-bold text-primary-orange">{title}</span>
			) : (
				<Link to={url} className="text-slate-500 hover:text-primary-orange">
					{title}
				</Link>
			),
		};
	});

	const breadcrumbItems = [
		{
			key: 'home',
			title: (
				<Link to={ROUTES.DASHBOARD} className="flex items-center gap-2 text-slate-500 hover:text-primary-orange">
					<HomeOutlined className="mr-2" />
					<span>{t('common.home', 'Home page')}</span>
				</Link>
			),
		},
		...extraBreadcrumbItems,
	];

	return (
		<div className="mb-4">
			<Breadcrumb items={breadcrumbItems} separator="/" />
		</div>
	);
};

export default Breadcrumbs;

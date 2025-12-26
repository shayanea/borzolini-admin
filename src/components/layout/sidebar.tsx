import {
	BarChart,
	BookOpen,
	Building2,
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	ClipboardList,
	FileText,
	FlaskConical,
	HeartPulse,
	Home,
	Layers,
	LayoutDashboard,
	Mail,
	MessageSquare,
	Monitor,
	PawPrint,
	Settings as SettingsIcon,
	Stethoscope,
	Users,
} from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getMenuItemsForRole } from '@/constants/menu-permissions';
import { useAuthStore } from '@/stores/auth.store';
import { Tooltip } from 'antd';

// Icon mapping for menu items
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
	'/dashboard': LayoutDashboard,
	'/appointments': ClipboardList,
	'/calendar': CalendarDays,
	'/clinics': Building2,
	'/users': Users,
	'/staff': Users,
	'/veterinarians': HeartPulse,
	'/patients': Users,
	'/pets': PawPrint,
	'/pet-cases': Stethoscope,
	'/reports': BarChart,
	'/reviews': MessageSquare,
	'/contacts': Mail,
	'/api-health': Monitor,
	'/role-demo': FlaskConical,
	'/settings': SettingsIcon,
	'/admin/resources': FileText,
	'/admin/training': BookOpen,
	'/admin/household-safety': Home,
	'/admin/breeds': Layers,
};

interface SidebarProps {
	collapsed?: boolean;
}

function Sidebar({ collapsed = false }: SidebarProps) {
	const { user } = useAuthStore();
	const [isCollapsed, setIsCollapsed] = useState<boolean>(collapsed);
	const location = useLocation();
	const navigate = useNavigate();

	// Get role-based menu items
	const userRole =
		(user?.role as 'admin' | 'veterinarian' | 'staff' | 'patient' | 'clinic_admin') || 'admin';
	const roleMenuItems = getMenuItemsForRole(userRole);

	const isActive = (href: string): boolean => {
		return location.pathname === href || location.pathname.startsWith(`${href}/`);
	};

	const handleNavClick = (href: string): void => {
		navigate(href);
	};

	return (
		<aside
			className={`${isCollapsed ? 'w-20' : 'w-56'
				} bg-white border-r border-slate-200 transition-all duration-500 ease-in-out shadow-lg flex flex-col transform-gpu relative z-50 my-2 ml-2 rounded-2xl`}
		>
			{/* Scrollable Menu Content */}
			<div className='flex-1 overflow-y-auto overflow-x-hidden sidebar-scrollbar pt-4'>
				{/* Main Navigation */}
				<nav className='p-3 space-y-1'>
					{roleMenuItems
						.filter(
							item =>
								item.key !== '/settings' && item.key !== '/profile' && item.key !== '/role-demo'
						)
						.map(item => {
							if (item.hidden) return null;

							const active = isActive(item.key);
							const IconComponent = iconMap[item.key] || FileText;
							const labelText = typeof item.label === 'string' ? (item.label as string) : undefined;

							const buttonEl = (
								<button
									key={item.key}
									onClick={() => handleNavClick(item.key)}
									className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'
										} px-3 py-3 rounded-xl transition-all duration-300 group ${active
											? 'bg-[#D5992A] text-white shadow-md'
											: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
										} overflow-hidden`}
								>
									<IconComponent
										size={20}
										className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'
											}`}
									/>
									<span
										className={`text-sm font-medium text-left transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap flex items-center gap-2 ${isCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-auto opacity-100'
											}`}
									>
										{item.label}
									</span>
								</button>
							);

							return isCollapsed && labelText ? (
								<Tooltip placement='right' title={labelText} key={item.key}>
									{buttonEl}
								</Tooltip>
							) : (
								buttonEl
							);
						})}
				</nav>
			</div>

			{/* Bottom Navigation (Settings & Profile) */}
			<div className='border-t border-slate-200 p-3 space-y-1'>
				{roleMenuItems
					.filter(
						item => item.key === '/settings' || item.key === '/profile' || item.key === '/role-demo'
					)
					.map(item => {
						if (item.hidden) return null;

						const active = isActive(item.key);
						const IconComponent = iconMap[item.key] || FileText;
						const labelText = typeof item.label === 'string' ? (item.label as string) : undefined;

						const buttonEl = (
							<button
								key={item.key}
								onClick={() => handleNavClick(item.key)}
								className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'
									} px-3 py-3 rounded-xl transition-all duration-300 group ${active
										? 'bg-[#D5992A] text-white shadow-md'
										: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
									} overflow-hidden`}
							>
								<IconComponent
									size={20}
									className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'
										}`}
								/>
								<span
									className={`text-sm font-medium text-left transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap flex items-center gap-2 ${isCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-auto opacity-100'
										}`}
								>
									{item.label}
								</span>
							</button>
						);

						return isCollapsed && labelText ? (
							<Tooltip placement='right' title={labelText} key={item.key}>
								{buttonEl}
							</Tooltip>
						) : (
							buttonEl
						);
					})}
			</div>

			{/* Collapse Toggle */}
			<div className='absolute top-1/2 -translate-y-1/2 -right-3 z-20'>
				<Tooltip placement='right' title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
					<button
						aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
						onClick={() => setIsCollapsed(!isCollapsed)}
						className='h-9 w-9 rounded-full bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110'
					>
						{isCollapsed ? (
							<ChevronRight size={18} className='transition-transform duration-500 ease-in-out' />
						) : (
							<ChevronLeft size={18} className='transition-transform duration-500 ease-in-out' />
						)}
					</button>
				</Tooltip>
			</div>
		</aside>
	);
}

export { Sidebar };
export default Sidebar;

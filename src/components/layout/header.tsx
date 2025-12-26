/* eslint-env browser */

import { useClinicContext, useClinicStaff } from '@/hooks/clinics';
import {
	Activity,
	Bell,
	Calendar as CalendarIcon,
	Check,
	ChevronDown,
	LogOut,
	Settings,
	TrendingUp,
	User
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { LanguageSwitcher } from '@/components/shared';
import { ROUTES } from '@/constants';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
	userName?: string;
	userRole?: string;
	onLogout?: () => void;
}

function Header({
	userName = 'Dr. Sarah',
	userRole = 'Clinic Manager',
	onLogout,
}: HeaderProps) {
	const { t } = useTranslation(['components', 'common']);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const [showStaffMenu, setShowStaffMenu] = useState(false);

	// Context Navigation State
	const { clinicContext } = useClinicContext();
	const { data: staffData } = useClinicStaff({ enabled: !!clinicContext?.clinicId });
	const [selectedStaffId, setSelectedStaffId] = useState<string>('all');

	const navigate = useNavigate();
	const userMenuRef = useRef<HTMLDivElement>(null);
	const notificationsRef = useRef<HTMLDivElement>(null);
	const staffMenuRef = useRef<HTMLDivElement>(null);


	// Close menus when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent): void => {
			if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
				setShowUserMenu(false);
			}
			if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
				setShowNotifications(false);
			}
			if (staffMenuRef.current && !staffMenuRef.current.contains(event.target as Node)) {
				setShowStaffMenu(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleLogout = (): void => {
		if (onLogout) {
			onLogout();
		} else {
			navigate(ROUTES.LOGIN);
		}
	};

	const selectedStaffName =
		selectedStaffId === 'all'
			? 'All Vets'
			: staffData?.data.find(s => s.id === selectedStaffId)?.user?.name ||
			staffData?.data.find(s => s.id === selectedStaffId)?.user?.email ||
			'Unknown Vet';

	const notifications = [
		{
			id: 1,
			type: 'appointment',
			message: 'New appointment scheduled',
			time: '2 min ago',
			icon: CalendarIcon,
		},
		{
			id: 2,
			type: 'trend',
			message: 'Sales up 12% this week',
			time: '15 min ago',
			icon: TrendingUp,
		},
		{
			id: 3,
			type: 'activity',
			message: '3 patients checked in',
			time: '1 hour ago',
			icon: Activity,
		},
	];

	return (
		<header className='bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm sticky top-0 z-40 rounded-b-2xl mt-4 mx-6 rounded-2xl border'>
			<div className='px-6 py-3'>
				<div className='flex items-center justify-between'>
					{/* Left Side - Context Navigation */}
					<div className='flex items-center gap-6 flex-1'>
						{/* Context Switcher Widget */}
						<div className='flex flex-col min-w-[200px] border-r border-slate-200 pr-6 mr-2'>
							<div className='flex items-center justify-between text-xs text-slate-500 mb-1'>
								<div className='flex items-center gap-1 font-medium hover:text-slate-800 cursor-pointer transition-colors'>
									<span>{clinicContext?.clinicName || 'Downtown Vet'}</span>
									<ChevronDown size={12} />
								</div>
								<span>{dayjs().format('Today: MMM D')}</span>
							</div>

							<div className='relative' ref={staffMenuRef}>
								<button
									onClick={() => setShowStaffMenu(!showStaffMenu)}
									className='flex items-center justify-between w-full text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors group'
								>
									<span className='truncate'>Viewing: {selectedStaffName}</span>
									<ChevronDown
										size={14}
										className={`text-slate-400 group-hover:text-blue-500 transition-transform ${showStaffMenu ? 'rotate-180' : ''}`}
									/>
								</button>

								{showStaffMenu && (
									<div className='absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100'>
										<div className='px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider'>
											Quick Switch
										</div>
										<button
											onClick={() => {
												setSelectedStaffId('all');
												setShowStaffMenu(false);
											}}
											className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors ${selectedStaffId === 'all' ? 'text-blue-600 bg-blue-50/50 font-medium' : 'text-slate-700'}`}
										>
											All Vets
											{selectedStaffId === 'all' && <Check size={14} />}
										</button>
										<div className='h-px bg-slate-100 my-1' />
										<div className='max-h-64 overflow-y-auto custom-scrollbar'>
											{staffData?.data.map(staff => (
												<button
													key={staff.id}
													onClick={() => {
														setSelectedStaffId(staff.id);
														setShowStaffMenu(false);
													}}
													className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors ${selectedStaffId === staff.id ? 'text-blue-600 bg-blue-50/50 font-medium' : 'text-slate-700'}`}
												>
													<span className='truncate'>
														{staff.user?.name || staff.user?.email || 'Unknown Staff'}
													</span>
													{selectedStaffId === staff.id && <Check size={14} />}
												</button>
											))}
											{(!staffData?.data || staffData.data.length === 0) && (
												<div className='px-4 py-2 text-xs text-slate-400 italic'>
													No staff members found
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						</div>


					</div>

					{/* Right Side - Actions */}
					<div className='flex items-center gap-3'>
						{/* Language Switcher */}
						<LanguageSwitcher />

						{/* Divider */}
						<div className='w-px h-8 bg-slate-200' />

						{/* Notifications */}
						<div className='relative' ref={notificationsRef}>
							<button
								onClick={() => setShowNotifications(!showNotifications)}
								className='relative p-2 hover:bg-slate-100 rounded-xl transition-all group'
							>
								<Bell
									size={20}
									className='text-slate-600 group-hover:text-slate-900 transition-colors'
								/>
								<span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping' />
								<span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full' />
								<span className='absolute -top-1 -right-1 px-1.5 py-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full font-bold min-w-[18px] text-center'>
									3
								</span>
							</button>

							{/* Notifications Dropdown */}
							{showNotifications && (
								<div className='absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50'>
									<div className='p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50'>
										<div className='flex items-center justify-between'>
											<h3 className='font-semibold text-slate-900'>
												{t('components:header.notifications')}
											</h3>
											<span className='text-xs text-slate-500 bg-white px-2 py-1 rounded-full'>
												{t('components:header.notificationsWithCount', {
													count: notifications.length,
												})}
											</span>
										</div>
									</div>
									<div className='max-h-96 overflow-y-auto'>
										{notifications.map(notification => (
											<button
												key={notification.id}
												className='w-full p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0'
											>
												<div className='flex items-start gap-3'>
													<div className='w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0'>
														<notification.icon className='text-blue-600' size={18} />
													</div>
													<div className='flex-1 text-left'>
														<p className='text-sm font-medium text-slate-900'>
															{notification.message}
														</p>
														<p className='text-xs text-slate-500 mt-1'>{notification.time}</p>
													</div>
												</div>
											</button>
										))}
									</div>
									<div className='p-3 bg-slate-50 border-t border-slate-200'>
										<button className='w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2'>
											{t('components:header.viewAllNotifications')}
										</button>
									</div>
								</div>
							)}
						</div>

						{/* User Profile Menu */}
						<div className='relative' ref={userMenuRef}>
							<button
								onClick={() => setShowUserMenu(!showUserMenu)}
								className='flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-xl transition-all group'
							>
								<div className='w-9 h-9 rounded-xl bg-[#6ecefd] flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-shadow'>
									{userName.charAt(0)}
								</div>
								<div className='text-left hidden 2xl:block'>
									<p className='text-sm font-semibold text-slate-900 leading-tight'>{userName}</p>
									<p className='text-xs text-slate-500 leading-tight'>{userRole}</p>
								</div>
							</button>

							{/* User Menu Dropdown */}
							{showUserMenu && (
								<div className='absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden'>
									<div className='p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-slate-200'>
										<div className='flex items-center gap-3'>
											<div className='w-12 h-12 rounded-xl bg-[#6ecefd] flex items-center justify-center text-white font-bold text-lg'>
												{userName.charAt(0)}
											</div>
											<div>
												<p className='text-sm font-semibold text-slate-900'>{userName}</p>
												<p className='text-xs text-slate-500'>{userRole}</p>
											</div>
										</div>
									</div>
									<div className='p-2 space-y-1'>
										<button className='w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-slate-700 text-sm font-medium transition-colors group'>
											<User size={18} className='text-slate-500 group-hover:text-blue-600' />
											{t('common:navigation.profile')}
										</button>
										<button className='w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-slate-700 text-sm font-medium transition-colors group'>
											<Settings size={18} className='text-slate-500 group-hover:text-blue-600' />
											{t('components:header.settings')}
										</button>
										<div className='h-px bg-slate-200 my-1' />
										<button
											onClick={handleLogout}
											className='w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl text-red-600 text-sm font-medium transition-colors group'
										>
											<LogOut size={18} />
											{t('components:header.logout')}
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}

export { Header };
export default Header;

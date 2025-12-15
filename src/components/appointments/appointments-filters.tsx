import { APPOINTMENT_PRIORITIES, APPOINTMENT_STATUSES, APPOINTMENT_TYPES } from '@/constants';
import type {
    AppointmentsFiltersProps,
    AppointmentsFilters as AppointmentsFiltersType
} from '@/types';
import {
    CalendarOutlined,
    DeleteOutlined,
    FilterOutlined,
    SaveOutlined,
    SearchOutlined,
    StarOutlined,
    TagOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    DatePicker,
    Divider,
    Dropdown,
    Input,
    MenuProps,
    Modal,
    Select,
    Space,
    Tag,
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

  const getSystemPresets = () => [
    {
      label: "Today's Appointments",
      icon: <CalendarOutlined />,
      filters: {
        dateRange: [dayjs().startOf('day').toISOString(), dayjs().endOf('day').toISOString()] as [
          string,
          string,
        ],
      },
    },
    {
      label: 'Pending Review',
      icon: <StarOutlined />,
      filters: {
        status: APPOINTMENT_STATUSES.PENDING,
      },
    },
    {
      label: 'Follow-ups This Week',
      icon: <TagOutlined />,
      filters: {
        type: APPOINTMENT_TYPES.FOLLOW_UP,
        dateRange: [
          dayjs().startOf('week').toISOString(),
          dayjs().endOf('week').toISOString(),
        ] as [string, string],
      },
    },
    {
      label: 'Cancelled (Action Needed)',
      icon: <FilterOutlined />,
      filters: {
        status: APPOINTMENT_STATUSES.CANCELLED,
      },
    },
    {
      label: 'High Priority',
      icon: <StarOutlined style={{ color: '#ff4d4f' }} />,
      filters: {
        priority: APPOINTMENT_PRIORITIES.URGENT,
      },
    },
  ];

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
    <Card className='admin-card mb-6'>
      <div className='space-y-4'>
        {/* Top Row: Search & Action Buttons */}
        <div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
          <Search
            placeholder={t('appointments.searchPlaceholder')}
            allowClear
            value={searchText}
            onSearch={onSearch} // Search component handles onChange locally usually, but standard Ant Search triggers onSearch on enter/click
            onChange={e => onSearch(e.target.value)} // Live search behavior
            className='w-full lg:w-96'
            prefix={<SearchOutlined />}
          />
          <Space wrap>
            <Button onClick={() => setIsSaveModalOpen(true)} icon={<SaveOutlined />}>
              Save Current View
            </Button>
            <Dropdown menu={{ items: savedFiltersMenu }} placement='bottomRight'>
              <Button icon={<StarOutlined />}>Saved Filters</Button>
            </Dropdown>
            <div className='relative'>
              <Button onClick={onExport}>{t('appointments.export')}</Button>
              <span className='absolute -top-3 -right-3'>
                <Tag color='orange' className='m-0 text-[10px] leading-4 px-1'>
                  {t('appointments.soon')}
                </Tag>
              </span>
            </div>
          </Space>
        </div>

        <Divider className='my-2' />

        {/* Middle Row: System Presets */}
        <div className='flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide'>
          <span className='text-xs font-semibold text-gray-500 uppercase whitespace-nowrap mr-2'>
            Quick Filters:
          </span>
          {getSystemPresets().map((preset, idx) => (
            <Tag.CheckableTag
              key={idx}
              checked={false} // Since filters are complex, we treat these as action buttons rather than toggles for now
              onChange={() => applyPreset(preset.filters)}
              className='cursor-pointer text-sm py-1 px-3 border border-gray-200 hover:border-blue-400 bg-gray-50 flex items-center gap-2'
            >
              {preset.icon} {preset.label}
            </Tag.CheckableTag>
          ))}
        </div>

        {/* Bottom Row: Detailed Filters */}
        <div className='flex flex-wrap items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100'>
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium text-gray-600'>
              {t('appointments.status')}:
            </span>
            <Select
              placeholder={t('appointments.allStatuses')}
              className='w-40'
              value={filters.status}
              onChange={value => handleFilterChange('status', value)}
              allowClear
            >
              {Object.entries(APPOINTMENT_STATUSES).map(([, value]) => (
                <Select.Option key={value} value={value}>
                  {formatOptionLabel(value)}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium text-gray-600'>
              {t('appointments.type')}:
            </span>
            <Select
              placeholder={t('appointments.allTypes')}
              className='w-40'
              value={filters.type}
              onChange={value => handleFilterChange('type', value)}
              allowClear
            >
              {Object.entries(APPOINTMENT_TYPES).map(([, value]) => (
                <Select.Option key={value} value={value}>
                  {formatOptionLabel(value)}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium text-gray-600'>
              {t('appointments.priority')}:
            </span>
            <Select
              placeholder={t('appointments.allPriorities')}
              className='w-40'
              value={filters.priority}
              onChange={value => handleFilterChange('priority', value)}
              allowClear
            >
              {Object.entries(APPOINTMENT_PRIORITIES).map(([, value]) => (
                <Select.Option key={value} value={value}>
                  {formatOptionLabel(value)}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium text-gray-600'>
              {t('appointments.dateRange')}:
            </span>
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
              className='w-full sm:w-auto'
            />
          </div>

          {Object.keys(filters).length > 0 && (
            <Button
              type='text'
              danger
              icon={<DeleteOutlined />}
              onClick={clearFilters}
              size='small'
            >
              {t('appointments.clearFilters')}
            </Button>
          )}
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
    </Card>
  );
};

export { AppointmentsFilters };
export default AppointmentsFilters;

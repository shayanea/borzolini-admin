import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Input, Row, Select, Space } from 'antd';
import dayjs from 'dayjs';

import { USER_ROLES } from '@/constants/user-management';
import { useCurrentUser } from '@/hooks/auth';
import type { UserFiltersProps } from '@/types/user-management';
import { useTranslation } from 'react-i18next';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const UserFilters = ({
  searchText,
  selectedRole,
  selectedIsActive,
  dateRange,
  onSearch,
  onRoleFilter,
  onIsActiveFilter,
  onDateRangeChange,
  onClearFilters,
}: UserFiltersProps) => {
  const { t } = useTranslation('components');
  const { data: currentUser } = useCurrentUser();
  const canSeeRoleDropdown = currentUser?.role === 'admin' || currentUser?.role === 'clinic_admin';

  return (
    <Card className='admin-card admin-filters'>
      <Row gutter={[16, 16]} className='mb-4'>
        <Col xs={24} sm={12} md={6}>
          <Search
            placeholder={t('userManagement.searchPlaceholder')}
            allowClear
            value={searchText}
            onSearch={onSearch}
            prefix={<SearchOutlined />}
            className='w-full'
          />
        </Col>
        {canSeeRoleDropdown && (
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder={t('userManagement.role')}
              allowClear
              value={selectedRole}
              onChange={onRoleFilter}
              className='w-full'
            >
              <Option value={USER_ROLES.ADMIN}>Admin</Option>
              <Option value={USER_ROLES.VETERINARIAN}>Veterinarian</Option>
              <Option value={USER_ROLES.STAFF}>Staff</Option>
              <Option value={USER_ROLES.PATIENT}>Patient</Option>
            </Select>
          </Col>
        )}
        <Col xs={24} sm={12} md={4}>
          <Select
            placeholder={t('userManagement.status')}
            allowClear
            value={selectedIsActive}
            onChange={onIsActiveFilter}
            className='w-full'
          >
            <Option value={true}>{t('userManagement.active')}</Option>
            <Option value={false}>{t('userManagement.inactive')}</Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <RangePicker
            className='w-full'
            onChange={values => onDateRangeChange(values ? [values[0]!, values[1]!] : null)}
            value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Space className='w-full justify-end' wrap size='middle'>
            <button
              type='button'
              onClick={() => onIsActiveFilter(null)}
              className='px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ease-out shadow-sm hover:shadow-md hover:scale-105 active:scale-100 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
            >
              {t('userManagement.allStatuses')}
            </button>
            <button
              type='button'
              onClick={() => onIsActiveFilter(true)}
              className='px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ease-out shadow-sm hover:shadow-md hover:scale-105 active:scale-100'
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
              }}
            >
              {t('userManagement.active')}
            </button>
            <button
              type='button'
              onClick={() => onIsActiveFilter(false)}
              className='px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ease-out shadow-sm hover:shadow-md hover:scale-105 active:scale-100 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 hover:border-slate-300'
            >
              {t('userManagement.inactive')}
            </button>
            <Button
              icon={<FilterOutlined />}
              onClick={onClearFilters}
              className='rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200'
            >
              {t('userManagement.clearFilters')}
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export { UserFilters };
export default UserFilters;

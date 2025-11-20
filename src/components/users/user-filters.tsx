import { Button, Card, Col, Input, Row, Select } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

import { USER_ROLES } from '@/constants/user-management';
import type { UserFiltersProps } from '@/types/user-management';
import { useCurrentUser } from '@/hooks/use-auth';
import { useTranslation } from 'react-i18next';

const { Search } = Input;
const { Option } = Select;

const UserFilters = ({
  searchText,
  selectedRole,
  selectedIsActive,
  onSearch,
  onRoleFilter,
  onIsActiveFilter,
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

        <Col xs={24} sm={12} md={4}>
          <Button icon={<FilterOutlined />} onClick={onClearFilters} className='w-full'>
            {t('userManagement.clearFilters')}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export { UserFilters };
export default UserFilters;

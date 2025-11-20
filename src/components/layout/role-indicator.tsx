import { Tag } from 'antd';
// Role indicator component to show user's current role
import { UserRole } from '@/types';

interface RoleIndicatorProps {
  role: UserRole;
  className?: string;
}

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'red',
  clinic_admin: 'purple',
  veterinarian: 'blue',
  staff: 'green',
  patient: 'default',
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  clinic_admin: 'Clinic Admin',
  veterinarian: 'Veterinarian',
  staff: 'Staff',
  patient: 'Patient',
};

function RoleIndicator({ role, className = '' }: RoleIndicatorProps) {
  return (
    <Tag color={ROLE_COLORS[role]} className={`text-xs font-medium ${className}`}>
      {ROLE_LABELS[role]}
    </Tag>
  );
}

export { RoleIndicator };
export default RoleIndicator;

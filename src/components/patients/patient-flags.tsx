
import {
    AlertFilled,
    ClockCircleFilled,
    DollarCircleFilled,
    MessageFilled,
    TeamOutlined,
} from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';

export type PatientFlagType =
  | 'aggressive'
  | 'payment_issue'
  | 'sms_only'
  | 'always_late'
  | 'multi_pet';

interface PatientFlagsProps {
  flags?: string[];
  size?: 'small' | 'default';
}

const FLAG_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode; tooltip: string }
> = {
  aggressive: {
    label: 'Aggressive',
    color: 'error',
    icon: <AlertFilled />,
    tooltip: 'Handle with care - Aggressive behavior reported',
  },
  payment_issue: {
    label: 'Payment',
    color: 'warning',
    icon: <DollarCircleFilled />,
    tooltip: 'Payment Issues - Collect upfront',
  },
  sms_only: {
    label: 'SMS Only',
    color: 'blue',
    icon: <MessageFilled />,
    tooltip: 'Client prefers SMS communication only',
  },
  always_late: {
    label: 'Late',
    color: 'purple',
    icon: <ClockCircleFilled />,
    tooltip: 'Always Late - Book last slot if possible',
  },
  multi_pet: {
    label: 'Multi-Pet',
    color: 'cyan',
    icon: <TeamOutlined />,
    tooltip: 'Multi-pet owner',
  },
};

export const PatientFlags = ({ flags, size = 'default' }: PatientFlagsProps) => {
  if (!flags || flags.length === 0) return null;

  return (
    <div className='flex gap-1 flex-wrap'>
      {flags.map(flag => {
        const config = FLAG_CONFIG[flag];
        if (!config) return null;

        return (
          <Tooltip key={flag} title={config.tooltip}>
            <Tag
              color={config.color}
              className={`flex items-center gap-1 m-0 ${size === 'small' ? 'px-1 text-xs' : ''}`}
            >
              {config.icon}
              <span>{config.label}</span>
            </Tag>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default PatientFlags;

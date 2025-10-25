import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color: 'blue' | 'emerald' | 'orange' | 'purple' | 'pink' | 'indigo';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorConfig = {
  blue: {
    gradient: 'from-blue-50 to-cyan-50',
    border: 'border-cyan-200',
    icon: 'text-blue-600',
  },
  emerald: {
    gradient: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
  },
  orange: {
    gradient: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
    icon: 'text-orange-600',
  },
  purple: {
    gradient: 'from-purple-50 to-pink-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
  },
  pink: {
    gradient: 'from-pink-50 to-rose-50',
    border: 'border-pink-200',
    icon: 'text-pink-600',
  },
  indigo: {
    gradient: 'from-indigo-50 to-blue-50',
    border: 'border-indigo-200',
    icon: 'text-indigo-600',
  },
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}) => {
  const config = colorConfig[color];

  return (
    <div
      className={`bg-gradient-to-br ${config.gradient} border-2 ${config.border} rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className={`text-4xl group-hover:scale-110 transition-transform ${config.icon}`}>
          {icon}
        </span>
        <span className="text-xs bg-white px-3 py-1 rounded-full text-slate-600 font-medium shadow-sm">
          Today
        </span>
      </div>

      <h3 className="text-slate-600 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-lg ${
              trend.isPositive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500 mt-3">{subtitle}</p>
    </div>
  );
};

interface DashboardCardsProps {
  cards?: DashboardCardProps[];
}

const DashboardCards: React.FC<DashboardCardsProps> = ({
  cards = [
    {
      title: "Today's Appointments",
      value: '3',
      subtitle: 'Next: 2:30 PM',
      icon: '📅',
      color: 'blue',
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Active Patients',
      value: '12',
      subtitle: 'Waiting to see vet',
      icon: '🐾',
      color: 'emerald',
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Pending Tasks',
      value: '5',
      subtitle: '1 high priority',
      icon: '✓',
      color: 'orange',
      trend: { value: 15, isPositive: false },
    },
    {
      title: 'Revenue (Month)',
      value: '$12.5K',
      subtitle: 'vs $10.2K last month',
      icon: '💰',
      color: 'purple',
      trend: { value: 22, isPositive: true },
    },
  ],
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <DashboardCard key={idx} {...card} />
      ))}
    </div>
  );
};

export default DashboardCards;
export { DashboardCard };

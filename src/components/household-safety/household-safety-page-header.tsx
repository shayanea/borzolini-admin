import { Typography } from 'antd';

const { Title, Text } = Typography;

interface HouseholdSafetyPageHeaderProps {
  totalCount?: number;
}

export function HouseholdSafetyPageHeader({ totalCount }: HouseholdSafetyPageHeaderProps) {
  return (
    <div className='flex justify-between items-start md:items-center flex-col md:flex-row gap-4'>
      <div>
        <Title level={2}>Household Safety Database</Title>
        <Text type='secondary'>
          Browse safety information for foods, plants, and household items across different pet
          species
          {totalCount !== undefined && ` (${totalCount} items)`}
        </Text>
      </div>
    </div>
  );
}

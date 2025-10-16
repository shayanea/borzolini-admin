/**
 * User Pets Card
 */

import { EmptyStateVariants } from '@/components/common';
import { PetsService } from '@/services/pets.service';
import type { User } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Badge, Card, Spin, Table, Tag, Typography } from 'antd';
import { FC } from 'react';

const { Text } = Typography;

interface UserPetsCardProps {
  user: User;
  isVisible: boolean;
}

export const UserPetsCard: FC<UserPetsCardProps> = ({ user, isVisible }) => {
  // Fetch user's pets
  const {
    data: pets = [],
    isLoading: petsLoading,
    error: petsError,
  } = useQuery({
    queryKey: ['user-pets', user.id],
    queryFn: () => PetsService.getPetsByUserId(user.id),
    enabled: !!user.id && isVisible,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const petColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color='blue'>{type}</Tag>,
    },
    {
      title: 'Breed',
      dataIndex: 'breed',
      key: 'breed',
      render: (breed: string) => breed || 'Not specified',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      render: (age: number) => (age ? `${age} years` : 'Not specified'),
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => (weight ? `${weight} kg` : 'Not specified'),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Badge status={isActive ? 'success' : 'default'} text={isActive ? 'Active' : 'Inactive'} />
      ),
    },
  ];

  return (
    <Card
      title={
        <div className='flex items-center justify-between'>
          <span>User's Pets</span>
          {petsLoading && <Spin size='small' />}
        </div>
      }
      size='small'
    >
      {petsError ? (
        <div className='text-center py-4'>
          <Text type='danger'>Failed to load pets. Please try again.</Text>
        </div>
      ) : pets.length === 0 ? (
        <EmptyStateVariants.NoPets />
      ) : (
        <div className='w-full'>
          <Table
            columns={petColumns}
            dataSource={pets}
            rowKey='id'
            loading={petsLoading}
            pagination={{
              position: ['bottomCenter'],
              pageSize: 5,
              showSizeChanger: false,
            }}
            size='small'
            scroll={{ x: 600 }}
          />
        </div>
      )}
    </Card>
  );
};

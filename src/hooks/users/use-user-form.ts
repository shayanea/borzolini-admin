/* eslint-env browser */

import type { CreateUserData, UpdateUserData } from '@/services/users';
import type { UserRole } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, message as antMessage } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants';
import UsersService from '@/services/users';
import type { UserFormValues } from '@/types/user-management';

interface UseUserFormReturn {
  form: ReturnType<typeof Form.useForm<UserFormValues>>[0];
  isEditing: boolean;
  loading: boolean;
  loadingUser: boolean;
  initialRole: UserRole | null;
  handleSubmit: () => Promise<void>;
  handleCancel: () => void;
}

export const useUserForm = (): UseUserFormReturn => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<UserFormValues>();
  const queryClient = useQueryClient();

  const isEditing = !!id;

  const url = new window.URL(window.location.href);
  const roleParam = url.searchParams.get('role') as UserRole | null;
  const initialRole = roleParam ?? null;

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user', id],
    queryFn: () => UsersService.getUserById(id!),
    enabled: isEditing,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateUserData) => UsersService.createUser(data),
    onSuccess: () => {
      antMessage.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate(ROUTES.USERS);
    },
    onError: error => {
      console.error('Error creating user:', error);
      antMessage.error('Failed to create user');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserData }) =>
      UsersService.updateUser(userId, data),
    onSuccess: () => {
      antMessage.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['user', id] });
      }
      navigate(ROUTES.USERS);
    },
    onError: error => {
      console.error('Error updating user:', error);
      antMessage.error('Failed to update user');
    },
  });

  const loading = useMemo(
    () => createMutation.isPending || updateMutation.isPending,
    [createMutation.isPending, updateMutation.isPending]
  );

  useEffect(() => {
    if (user && isEditing) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        city: user.city,
        country: user.country,
        postalCode: user.postalCode,
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : undefined,
        avatar: user.avatar,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
      } as any);
    } else if (!isEditing) {
      form.setFieldsValue({
        role: initialRole ?? 'patient',
        isActive: true,
      } as any);
    }
  }, [form, user, isEditing, initialRole]);

  const handleSubmit = async (): Promise<void> => {
    try {
      const values = await form.validateFields();

      const dateOfBirth =
        values.dateOfBirth && typeof values.dateOfBirth !== 'string'
          ? values.dateOfBirth.format('YYYY-MM-DD')
          : values.dateOfBirth;

      if (isEditing && id) {
        const updateData: UpdateUserData = {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          address: values.address,
          city: values.city,
          country: values.country,
          postalCode: values.postalCode,
          dateOfBirth,
          avatar: values.avatar,
          role: values.role as UserRole,
          isActive: values.isActive,
          isEmailVerified: values.isEmailVerified,
        };

        await updateMutation.mutateAsync({ userId: id, data: updateData });
      } else {
        const createData: CreateUserData = {
          email: values.email,
          password: values.password!,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          role: values.role as UserRole,
          address: values.address,
          city: values.city,
          country: values.country,
        };

        await createMutation.mutateAsync(createData);
      }
    } catch {
      // AntD handles field-level validation errors
    }
  };

  const handleCancel = (): void => {
    navigate(ROUTES.USERS);
  };

  return {
    form,
    isEditing,
    loading,
    loadingUser,
    initialRole,
    handleSubmit,
    handleCancel,
  };
};

export default useUserForm;

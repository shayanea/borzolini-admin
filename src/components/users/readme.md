# User Management Components

This directory contains the refactored user management components following senior developer best practices.

## Components

### `UserTable`

- Displays users in a table format with sorting, pagination, and row selection
- Handles user actions (view, edit, delete)
- Uses constants for column keys and styling

### `UserFilters`

- Provides search, role, status, and date range filtering
- Uses constants for role and status options
- Responsive grid layout

### `UserFormModal`

- Modal for creating and editing users
- Form validation and submission handling
- Uses constants for role and status options

### `UserPageHeader`

- Page title and action buttons (refresh, export, add user)
- Clean separation of concerns

### `UserBulkActions`

- Bulk operations for selected users
- Only renders when users are selected

## Custom Hook

### `useUserManagement`

- Centralized state management for all user operations
- Handles API calls, filtering, pagination, and CRUD operations
- Uses `useCallback` for performance optimization

## Types

### `userManagement.ts`

- TypeScript interfaces for all component props
- Ensures type safety across the user management system

## Constants

### `userManagement.ts`

- Centralized constants for roles, statuses, and table configuration
- Eliminates magic strings and improves maintainability

## Benefits of Refactoring

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused in other parts of the application
3. **Maintainability**: Code is easier to understand and modify
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Performance**: Optimized with React hooks and memoization
6. **Consistency**: Uses constants and follows naming conventions
7. **Testing**: Components are easier to test in isolation

## Usage

```tsx
import {
  UserPageHeader,
  UserFilters,
  UserBulkActions,
  UserTable,
  UserFormModal,
} from '@/components/users';
import { useUserManagement } from '@/hooks/useUserManagement';

const UsersPage = () => {
  const userManagement = useUserManagement();

  return (
    <div>
      <UserPageHeader {...userManagement} />
      <UserFilters {...userManagement} />
      <UserBulkActions {...userManagement} />
      <UserTable {...userManagement} />
      <UserFormModal {...userManagement} />
    </div>
  );
};
```

## Naming Conventions

- **Files**: lowercase with camelCase (e.g., `userTable.tsx`)
- **Components**: PascalCase (e.g., `UserTable`)
- **Functions**: camelCase (e.g., `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `USER_ROLES`)
- **Types**: PascalCase with descriptive names (e.g., `UserTableProps`)

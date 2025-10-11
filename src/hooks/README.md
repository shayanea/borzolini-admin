# Custom Hooks

## Form Initialization Hooks

### `useFormInitialization`

Custom hook to handle common form initialization logic across all form modals. This eliminates repetitive form setup code.

**Purpose:**

- Automatically populate form fields when editing an entity
- Reset form to default values when creating a new entity
- Handle form visibility state changes

**Parameters:**

```typescript
interface UseFormInitializationOptions<T> {
  isVisible: boolean; // Whether modal is visible
  form: FormInstance; // Ant Design form instance
  editingEntity: T | null; // Entity being edited (null for create)
  transformToFormValues?: (entity: T) => Record<string, any>; // Transform function
  defaultValues?: Record<string, any>; // Default values for create mode
  onInitialized?: (isEditMode: boolean) => void; // Callback after initialization
}
```

**Returns:**

```typescript
{
  isEditMode: boolean; // Whether form is in edit mode
}
```

**Example Usage:**

```tsx
import { Form } from 'antd';
import { useFormInitialization } from '@/hooks/use-form-initialization';
import type { User } from '@/types';

const UserFormModal = ({ isVisible, editingUser, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  // Automatically handle form initialization
  const { isEditMode } = useFormInitialization<User>({
    isVisible,
    form,
    editingEntity: editingUser,
    defaultValues: {
      role: 'patient',
      isActive: true,
    },
  });

  return (
    <Modal title={isEditMode ? 'Edit User' : 'Create User'} open={isVisible} onCancel={onCancel}>
      <Form form={form} onFinish={onSubmit}>
        {/* Form fields */}
      </Form>
    </Modal>
  );
};
```

**With Custom Transform:**

```tsx
import dayjs from 'dayjs';

const { isEditMode } = useFormInitialization<Pet>({
  isVisible,
  form,
  editingEntity: editingPet,
  transformToFormValues: pet => ({
    ...pet,
    date_of_birth: pet.date_of_birth ? dayjs(pet.date_of_birth) : null,
    weight: pet.weight ? parseFloat(pet.weight) : undefined,
  }),
  defaultValues: {
    is_spayed_neutered: false,
    is_vaccinated: false,
    allergies: [],
    medications: [],
  },
});
```

---

### `useFormCancellation`

Custom hook to handle form cancellation with cleanup logic.

**Parameters:**

```typescript
interface UseFormCancellationOptions {
  form: FormInstance; // Ant Design form instance
  onCancel: () => void; // Cancel callback
  onCleanup?: () => void; // Optional cleanup function
}
```

**Returns:**

```typescript
{
  handleCancel: () => void;  // Cancel handler function
}
```

**Example Usage:**

```tsx
import { useFormCancellation } from '@/hooks/use-form-initialization';

const PetFormModal = ({ isVisible, onCancel }) => {
  const [form] = Form.useForm();
  const [selectedSpecies, setSelectedSpecies] = useState('');

  const { handleCancel } = useFormCancellation({
    form,
    onCancel,
    onCleanup: () => {
      // Reset local state
      setSelectedSpecies('');
    },
  });

  return <Modal onCancel={handleCancel}>{/* Form content */}</Modal>;
};
```

---

## Complete Example: Refactored Form Modal

**Before (with repetition):**

```tsx
const UserFormModal = ({ isVisible, editingUser, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  // ❌ Repetitive initialization logic
  useEffect(() => {
    if (isVisible) {
      if (editingUser) {
        form.setFieldsValue({
          firstName: editingUser.firstName,
          lastName: editingUser.lastName,
          email: editingUser.email,
          // ... more fields
        });
      } else {
        form.resetFields();
      }
    }
  }, [editingUser, form, isVisible]);

  // ❌ Repetitive cancel logic
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={editingUser ? 'Edit User' : 'Create User'}
      open={isVisible}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={onSubmit}>
        {/* Form fields */}
      </Form>
    </Modal>
  );
};
```

**After (with hooks):**

```tsx
import { useFormInitialization, useFormCancellation } from '@/hooks/use-form-initialization';

const UserFormModal = ({ isVisible, editingUser, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  // ✅ Clean, declarative form initialization
  const { isEditMode } = useFormInitialization({
    isVisible,
    form,
    editingEntity: editingUser,
    defaultValues: { role: 'patient', isActive: true },
  });

  // ✅ Clean cancellation handling
  const { handleCancel } = useFormCancellation({ form, onCancel });

  return (
    <Modal
      title={isEditMode ? 'Edit User' : 'Create User'}
      open={isVisible}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={onSubmit}>
        {/* Form fields */}
      </Form>
    </Modal>
  );
};
```

## Benefits

1. **DRY Principle**: Eliminates repetitive form initialization code
2. **Consistency**: Same initialization logic across all forms
3. **Type Safety**: Full TypeScript support
4. **Maintainability**: Update logic in one place
5. **Testability**: Easier to test isolated hooks
6. **Readability**: Clear, declarative code

## Related

- See `src/components/shared/form-fields/` for reusable form field components
- See `src/components/shared/form-modal.tsx` for modal wrapper patterns
- See `src/constants/form-validation.ts` for validation rules

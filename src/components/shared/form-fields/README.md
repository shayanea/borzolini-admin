# Reusable Form Field Components

This directory contains reusable form field components that eliminate repeated validation patterns and provide a consistent user experience across the application.

## Components

### `EmailField`

A standardized email input field with built-in validation.

**Props:**

- `name?: string` - Form field name (default: `'email'`)
- `label?: string` - Field label (default: `'Email'`)
- `placeholder?: string` - Input placeholder (default: `'Enter email address'`)
- `required?: boolean` - Whether field is required (default: `true`)
- `requiredMessage?: string` - Custom required message
- `disabled?: boolean` - Whether field is disabled
- `className?: string` - Additional CSS classes
- `rules?: Rule[]` - Additional validation rules

**Example:**

```tsx
import { EmailField } from '@/components/shared';

// Basic usage
<EmailField />

// Custom configuration
<EmailField
  name="userEmail"
  label="User Email Address"
  placeholder="Enter your email"
  required={true}
  disabled={false}
/>

// Optional email field
<EmailField required={false} />
```

---

### `PhoneField`

A standardized phone number input field with pattern validation.

**Props:**

- `name?: string` - Form field name (default: `'phone'`)
- `label?: string` - Field label (default: `'Phone Number'`)
- `placeholder?: string` - Input placeholder (default: `'Enter phone number'`)
- `required?: boolean` - Whether field is required (default: `true`)
- `requiredMessage?: string` - Custom required message
- `disabled?: boolean` - Whether field is disabled
- `className?: string` - Additional CSS classes
- `rules?: Rule[]` - Additional validation rules

**Validation Pattern:** `/^[+]?[\d\s\-().]{7,20}$/`

**Example:**

```tsx
import { PhoneField } from '@/components/shared';

// Basic usage
<PhoneField />

// Custom configuration
<PhoneField
  name="contactPhone"
  label="Contact Number"
  placeholder="Enter phone"
  required={true}
/>

// Optional phone field
<PhoneField
  name="emergency_phone"
  label="Emergency Phone"
  required={false}
/>
```

---

### `AddressFields`

A comprehensive address field group including address, city, country, and postal code fields.

**Props:**

- `required?: boolean` - Whether all fields are required (default: `false`)
- `showPostalCode?: boolean` - Show postal code field (default: `true`)
- `useTextArea?: boolean` - Use textarea for address field (default: `true`)
- `labels?: object` - Custom labels for all fields
- `placeholders?: object` - Custom placeholders for all fields
- `names?: object` - Custom field names
- `addressMinLength?: number` - Min length for address (default: `5`)
- `cityMinLength?: number` - Min length for city (default: `2`)
- `disabled?: boolean` - Whether fields are disabled
- `validationMessages?: object` - Custom validation messages

**Example:**

```tsx
import { AddressFields } from '@/components/shared';

// Basic usage - optional fields
<AddressFields />

// Required fields with postal code
<AddressFields
  required={true}
  showPostalCode={true}
  useTextArea={false}
/>

// User address (optional, no postal code, with textarea)
<AddressFields
  required={false}
  showPostalCode={false}
  useTextArea={true}
/>

// Custom labels and field names
<AddressFields
  required={true}
  labels={{
    address: 'Street Address',
    city: 'City/Town',
    country: 'Country/Region',
    postalCode: 'ZIP Code'
  }}
  names={{
    address: 'streetAddress',
    city: 'cityName',
    country: 'countryName',
    postalCode: 'zipCode'
  }}
/>

// Custom placeholders
<AddressFields
  placeholders={{
    address: 'Enter your full street address',
    city: 'Enter your city',
    country: 'Select your country',
    postalCode: 'Enter ZIP code'
  }}
/>
```

---

## Usage in Forms

### In Form Sections

```tsx
import { EmailField, PhoneField, AddressFields } from '@/components/shared';
import { Col, Row } from 'antd';

const ContactInfoSection = () => {
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <EmailField />
        </Col>
        <Col span={12}>
          <PhoneField />
        </Col>
      </Row>

      <AddressFields required={true} showPostalCode={true} />
    </>
  );
};
```

### With Custom Validation

```tsx
import { PhoneField } from '@/components/shared';
import { MAX_LENGTH_RULE, VALIDATION_MESSAGES } from '@/constants/form-validation';

<PhoneField
  name='emergency_phone'
  label='Emergency Phone'
  placeholder='Emergency contact number'
  rules={[MAX_LENGTH_RULE(20, VALIDATION_MESSAGES.EMERGENCY_PHONE_MAX_LENGTH)]}
/>;
```

## Benefits

1. **Consistency**: Same validation rules and user experience across all forms
2. **Maintainability**: Update validation in one place
3. **Type Safety**: Full TypeScript support with proper types
4. **Flexibility**: Highly customizable while maintaining defaults
5. **Accessibility**: Built-in autocomplete attributes
6. **DRY Principle**: Eliminates code duplication

## Related

- See `src/hooks/use-form-initialization.ts` for form initialization patterns
- See `src/components/shared/form-modal.tsx` for modal wrapper patterns
- See `src/constants/form-validation.ts` for validation rules and messages

# Operating Hours Implementation

## Overview

The Operating Hours feature allows clinics to manage their business hours through the admin interface. This implementation provides a comprehensive solution for handling operating hours in both create and edit modes.

## Files Modified/Created

### 1. `src/hooks/use-operating-hours.ts`

A custom hook that provides:

- **Default Operating Hours**: Pre-configured hours for new clinics
- **API Conversion**: Convert between API format (`ClinicOperatingHours[]`) and form format (`Record<string, OperatingHours>`)
- **Validation**: Ensure operating hours are valid (close time after open time, proper format)
- **Days of Week**: Consistent mapping between API indices and form keys

### 2. `src/pages/clinic-form.tsx`

Updated the clinic form to:

- Use the `useOperatingHours` hook
- Properly populate operating hours from API data when editing
- Provide default hours for new clinics
- Validate operating hours before submission

## How It Works

### Data Flow

1. **Create Mode**: Form initializes with default operating hours
2. **Edit Mode**: Form fetches clinic data and converts API hours to form format
3. **Submission**: Form validates hours and submits to API

### API Integration

- **API Format**: `ClinicOperatingHours[]` with `dayOfWeek` (0-6), `openTime`, `closeTime`, `isClosed`
- **Form Format**: `Record<string, OperatingHours>` with keys like 'monday', 'tuesday', etc.

### Default Hours

- **Monday-Friday**: 09:00 - 17:00 (open)
- **Saturday**: 10:00 - 15:00 (open)
- **Sunday**: 00:00 - 00:00 (closed)

## Usage

### In Clinic Form Component

```tsx
const { daysOfWeek, getDefaultOperatingHours, convertApiToForm, validateOperatingHours } =
  useOperatingHours();

// Get form data
const formHours =
  clinic.operatingHours && clinic.operatingHours.length > 0
    ? convertApiToForm(clinic.operatingHours)
    : getDefaultOperatingHours();

// Validate before submission
if (!validateOperatingHours(values.operating_hours)) {
  // Show error message
}
```

### Form Structure

The operating hours form uses `Form.List` with:

- Switch for open/closed status
- Time inputs for open/close times (when open)
- Validation for time formats and logic

## Features

### ✅ Completed

- [x] Operating hours hook with conversion utilities
- [x] Form population from API data
- [x] Default hours for new clinics
- [x] Input validation (time format, close > open)
- [x] Proper TypeScript types
- [x] Error handling and user feedback

### 🔄 Future Enhancements

- [ ] Bulk operating hours updates
- [ ] Operating hours templates
- [ ] Holiday/special hours management
- [ ] Operating hours history

## API Structure

### ClinicOperatingHours (API)

```typescript
{
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string; // HH:MM format
  closeTime: string; // HH:MM format
  isClosed: boolean;
}
```

### OperatingHours (Form)

```typescript
{
  open: string; // HH:MM format
  close: string; // HH:MM format
  closed: boolean;
}
```

## Validation Rules

- Time format: `HH:MM` (24-hour format)
- Close time must be after open time
- Closed days don't require time values
- All weekdays must have valid entries

This implementation follows the project rules by:

- ✅ Using proper TypeScript types
- ✅ Following the API service layer pattern
- ✅ Implementing proper error handling
- ✅ Using lowercase naming conventions
- ✅ Maintaining code reusability

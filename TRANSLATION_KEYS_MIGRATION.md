# Translation Keys Migration Guide

## Summary of Duplications Found and Consolidated

This document outlines all duplicate translation keys that have been consolidated to prevent errors and breaking changes.

### Duplications Consolidated

#### 1. Common Actions (moved to `common.json`)
- `components.filters.search` → **use** `actions.search`
- `components.filters.filter` → **use** `actions.filter`
- `components.filters.reset` → **use** `actions.reset`
- `components.filters.apply` → **use** `actions.apply`
- `components.filters.clear` → **use** `actions.clear`
- `components.tables.search` → **use** `actions.search`
- `components.tables.view` → **use** `actions.view`
- `components.tables.edit` → **use** `actions.edit`
- `components.tables.delete` → **use** `actions.delete`
- `components.buttons.export` → **use** `actions.export`
- `components.buttons.import` → **use** `actions.import`
- `components.buttons.selectAll` → **use** `actions.selectAll`
- `components.buttons.deselectAll` → **use** `actions.deselectAll`
- `components.forms.common.cancel` → **use** `actions.cancel`
- `components.forms.common.create` → **use** `actions.create`
- `components.forms.common.delete` → **use** `actions.delete`
- `components.forms.common.edit` → **use** `actions.edit`
- `components.forms.common.update` → **use** `actions.update`
- `components.forms.common.save` → **use** `actions.save`
- `components.forms.common.submit` → **use** `actions.submit`
- `components.forms.common.reset` → **use** `actions.reset`
- `components.forms.common.close` → **use** `actions.close`
- `components.forms.common.confirm` → **use** `actions.confirm`
- `components.forms.common.yes` → **use** `actions.yes`
- `components.forms.common.no` → **use** `actions.no`

#### 2. Status Values (moved to `common.json`)
- `components.userTable.active` → **use** `status.active`
- `components.userTable.inactive` → **use** `status.inactive`
- `components.petTable.active` → **use** `status.active`
- `components.petTable.inactive` → **use** `status.inactive`
- `components.clinicTable.active` → **use** `status.active`
- `components.clinicTable.inactive` → **use** `status.inactive`

#### 3. Common UI States (moved to `common.json`)
- `components.emptyState.noData` → **use** `common.noData`
- `components.emptyState.noResults` → **use** `common.noResults`
- `components.tables.noData` → **use** `common.noData`
- `components.tables.loading` → **use** `common.loading`
- `components.tables.actions` → **use** `table.actions`
- `components.tables.rowsPerPage` → **use** `table.rowsPerPage`
- `components.errors.tryAgain` → **use** `actions.refresh` (semantically similar)
- `components.forms.common.loading` → **use** `common.loading`
- `components.forms.common.noData` → **use** `common.noData`
- `components.forms.common.optional` → **use** `common.optional`
- `components.forms.common.required` → **use** `common.required`

#### 4. Navigation/Header (removed from components.json)
- `components.header.settings` → **use** `navigation.settings`
- `components.header.profile` → **use** `navigation.profile`
- `components.header.logout` → **use** `navigation.logout`

#### 5. Button Duplicates (removed from components.json)
- `components.buttons.export` → moved to `actions.export`
- `components.buttons.import` → moved to `actions.import`
- `components.buttons.selectAll` → moved to `actions.selectAll`
- `components.buttons.deselectAll` → moved to `actions.deselectAll`
- `components.errors.tryAgain` → removed (use `actions.refresh`)

---

## Code Migration Required

### Search and Replace Patterns

When updating component code, replace translation key references as follows:

```typescript
// Old Code Pattern
t('components.filters.search')
t('components.tables.view')
t('components.tables.edit')
t('components.buttons.export')
t('components.header.settings')

// New Code Pattern
t('common:actions.search')
t('common:actions.view')
t('common:actions.edit')
t('common:actions.export')
t('common:navigation.settings')
```

### Files That Need Updates

The following files reference duplicate keys and should be reviewed:

1. **Appointments**
   - `components/appointments/appointments-header.tsx`
   - `components/appointments/appointments-table.tsx`
   - `components/appointments/appointments-filters.tsx`

2. **Users**
   - `components/users/user-table.tsx`
   - `components/users/user-filters.tsx`
   - `components/users/user-form-modal.tsx`

3. **Pets**
   - `components/pets/pet-table.tsx`
   - `components/pets/pet-filters.tsx`
   - `components/pets/pet-form-modal.tsx`

4. **Clinics**
   - `components/clinics/clinic-table.tsx`
   - `components/clinics/clinic-form-modal.tsx`

5. **Layout**
   - `components/layout/admin-header.tsx`
   - `components/layout/modern-header.tsx`

6. **Common/Shared**
   - `components/common/empty-state.tsx`
   - `components/shared/form-modal.tsx`

---

## JSON Structure Changes

### common.json
Added key:
```json
"noData": "No data available"
```

### components.json
**Removed keys:**
- `header.settings`, `header.profile`, `header.logout`
- `filters.search`, `filters.filter`, `filters.reset`, `filters.apply`, `filters.clear`
- `emptyState.noData`, `emptyState.noResults`
- `tables.noData`, `tables.loading`, `tables.search`, `tables.actions`, `tables.view`, `tables.edit`, `tables.delete`
- `buttons.export`, `buttons.import`, `buttons.selectAll`, `buttons.deselectAll`
- `errors.tryAgain`
- `forms.common.*` (most common actions)

---

## Best Practices Going Forward

1. **Centralize Common Keys**: Keep all common UI text (actions, status, messages) in `common.json`
2. **Scope-Specific Keys**: Keep component/page-specific keys in their respective files
3. **Naming Convention**: Use dot notation to organize hierarchically:
   - `actions.*` for buttons and clickable actions
   - `status.*` for state labels
   - `common.*` for generic UI elements
   - `messages.*` for user notifications
   - `validation.*` for form validation messages

4. **Import Namespace**: Use appropriate namespace when needed:
   ```typescript
   t('common:actions.save')  // from common.json
   t('appointments.cancel')  // from components.json (appointments section)
   ```


<!-- dc961b33-1f86-40f9-99e4-da33c04bdf2c c0c028c5-bea6-4ba0-8fc8-428cf4af2a27 -->
# Refactor Plan: Large Files Over 200 Lines

## Targets (line counts approximate)

- `src/components/calendar/appointment-details-modal.tsx` (~606): Very large modal mixing view, edit form, and transforms.
- `src/components/layout/modern-sidebar.tsx` (~228): UI + role filtering + nav item rendering.
- `src/components/clinics/clinic-staff-table.tsx` (~285): Complex columns with rich renderers and actions.
- `src/components/appointments/appointments-table.tsx` (~364): Multiple renderers, actions, pagination wiring.
- `src/components/pet-cases/pet-cases-table.tsx` (~278): Columns + expandable row details + actions.
- `src/components/clinics/clinic-table.tsx` (~236): Columns with social media links and actions.
- `src/services/calendar.service.ts` (~506): Large service with fetch, transforms, and utilities.
- `src/services/dashboard.service.ts` (~229): Service with fetch plus transforms and fallbacks.

## Refactor approach per file

- `appointment-details-modal.tsx`
- Extract form sections into subcomponents: `details-form.tsx`, `medical-records.tsx`, `history-section.tsx`.
- Move form state and submit/delete handlers into `useAppointmentDetailsForm` hook.
- Centralize option lists and color maps in `src/constants/appointments.ts` and `src/utils/color-helpers.ts` (reuse existing where possible).

- `modern-sidebar.tsx`
- Extract `sidebar-nav-item.tsx` and `useSidebarMenu(role)` hook (encapsulate role-based filtering and active logic).
- Keep collapse state and layout in the main component.

- `clinic-staff-table.tsx`
- Create `columns/staff-columns.tsx` factory returning typed `ColumnsType<ClinicStaffWithUser>`.
- Extract cell presenters: `member-cell.tsx`, `education-tags.tsx`, `actions-cell.tsx`.

- `appointments-table.tsx`
- Extract column renderers to `columns/appointments-columns.tsx` with typed helpers.
- Move action handlers to `useAppointmentActions(onView,onCancel)`.

- `pet-cases-table.tsx`
- Extract `expanded-row.tsx` and `columns/pet-cases-columns.tsx`.
- Keep selection state local; move color/label helpers to shared `PetCasesService` or `utils`.

- `clinic-table.tsx`
- Extract `contact-cell.tsx`, `rating-cell.tsx`, `actions-cell.tsx`.

- `services/calendar.service.ts`
- Split into: `calendar.api.ts` (API calls), `calendar.transforms.ts` (pure transforms), `calendar.service.ts` (facade), with strict types from `src/types/calendar.ts`.
- Move color logic to `utils/color-helpers.ts`.

- `services/dashboard.service.ts`
- Extract `dashboard.transforms.ts` for `transformApiResponse` and empty factories.

## Cross-cutting guidelines

- Keep TypeScript explicit types; avoid any.
- Reuse `react-query` hooks for data fetching where applicable, aligning with existing patterns.
- Preserve behavior and tests; no API shape changes. Use service layer only.
- Maintain Ant Design accessibility and Tailwind classes.

## Deliverables

- New subcomponents/hooks in lower-case files under each feature directory.
- Updated imports and exports via index files for clean imports.
- No UI changes; structure only.

### To-dos

- [ ] Split `appointment-details-modal.tsx` into subcomponents and a form hook
- [ ] Extract modern sidebar nav item and role-based menu hook
- [ ] Move staff table column renderers into column factory and cells
- [ ] Extract appointments column definitions and actions hook
- [ ] Extract expanded row and columns for pet cases table
- [ ] Split clinic table cells for contact, rating, actions
- [ ] Split calendar.service into api, transforms, and facade modules
- [ ] Move dashboard transforms and empty factories to separate module
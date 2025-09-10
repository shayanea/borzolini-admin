import { describe, expect, it } from 'vitest';

import type { ClinicOperatingHours } from '@/types';
import { renderHook } from '@testing-library/react';
import { useOperatingHours } from './use-operating-hours';

describe('useOperatingHours', () => {
  it('should return default operating hours', () => {
    const { result } = renderHook(() => useOperatingHours());

    const defaultHours = result.current.getDefaultOperatingHours();

    expect(defaultHours.monday.open).toBe('09:00');
    expect(defaultHours.monday.close).toBe('17:00');
    expect(defaultHours.monday.closed).toBe(false);

    expect(defaultHours.saturday.open).toBe('10:00');
    expect(defaultHours.saturday.close).toBe('15:00');
    expect(defaultHours.saturday.closed).toBe(false);

    expect(defaultHours.sunday.closed).toBe(true);
  });

  it('should convert API format to form format', () => {
    const { result } = renderHook(() => useOperatingHours());

    const apiHours: ClinicOperatingHours[] = [
      {
        id: '1',
        dayOfWeek: 1, // Monday
        openTime: '08:00',
        closeTime: '18:00',
        isClosed: false,
      },
      {
        id: '2',
        dayOfWeek: 0, // Sunday
        openTime: '00:00',
        closeTime: '00:00',
        isClosed: true,
      },
    ];

    const formHours = result.current.convertApiToForm(apiHours);

    expect(formHours.monday.open).toBe('08:00');
    expect(formHours.monday.close).toBe('18:00');
    expect(formHours.monday.closed).toBe(false);

    expect(formHours.sunday.closed).toBe(true);
  });

  it('should convert form format to API format', () => {
    const { result } = renderHook(() => useOperatingHours());

    const formHours = {
      monday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true },
    };

    const apiHours = result.current.convertFormToApi(formHours);

    const mondayApi = apiHours.find(h => h.dayOfWeek === 1);
    const sundayApi = apiHours.find(h => h.dayOfWeek === 0);

    expect(mondayApi?.openTime).toBe('09:00');
    expect(mondayApi?.closeTime).toBe('17:00');
    expect(mondayApi?.isClosed).toBe(false);

    expect(sundayApi?.isClosed).toBe(true);
  });

  it('should validate operating hours', () => {
    const { result } = renderHook(() => useOperatingHours());

    const validHours = {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
    };

    const invalidHours = {
      monday: { open: '17:00', close: '09:00', closed: false }, // Close before open
    };

    expect(result.current.validateOperatingHours(validHours)).toBe(true);
    expect(result.current.validateOperatingHours(invalidHours)).toBe(false);
  });

  it('should provide days of week array', () => {
    const { result } = renderHook(() => useOperatingHours());

    expect(result.current.daysOfWeek).toHaveLength(7);
    expect(result.current.daysOfWeek[0].key).toBe('sunday');
    expect(result.current.daysOfWeek[0].apiIndex).toBe(0);
    expect(result.current.daysOfWeek[1].key).toBe('monday');
    expect(result.current.daysOfWeek[1].apiIndex).toBe(1);
  });
});

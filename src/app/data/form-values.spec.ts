import { FormControl } from '@angular/forms';
import { nonBlank, toApiDate, wholeNumber } from './form-values';

it('rejects space-only names and fractional check-in frequencies', () => {
  expect(nonBlank(new FormControl('   '))).toEqual({ nonBlank: true });
  expect(nonBlank(new FormControl('Alex'))).toBeNull();
  expect(wholeNumber(new FormControl(1.5))).toEqual({ wholeNumber: true });
  expect(wholeNumber(new FormControl(7))).toBeNull();
});

it('uses an ISO date and preserves the timestamp when the day was not changed', () => {
  expect(toApiDate('2026-11-19')).toBe('2026-11-19T00:00:00.000Z');
  expect(toApiDate('2026-11-19', '2026-11-19T15:00:00.000Z')).toBe('2026-11-19T15:00:00.000Z');
});

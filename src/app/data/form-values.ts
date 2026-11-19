import { ValidatorFn } from '@angular/forms';

export const nonBlank: ValidatorFn = (control) =>
  typeof control.value === 'string' && control.value.trim() ? null : { nonBlank: true };

export const wholeNumber: ValidatorFn = (control) =>
  control.value === null || Number.isInteger(control.value) ? null : { wholeNumber: true };

export function dateOnly(value: string | null | undefined): string {
  return value?.slice(0, 10) ?? '';
}

export function toApiDate(value: string, original?: string | null): string {
  return original && dateOnly(original) === value ? original : `${value}T00:00:00.000Z`;
}

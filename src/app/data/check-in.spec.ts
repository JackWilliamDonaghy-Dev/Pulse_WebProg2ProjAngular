import { checkInStatus, filterPeople } from './check-in';
import { Person } from './pulse.model';

const today = new Date('2026-11-19T15:00:00Z');
const person: Person = { _id: '123', firstName: 'Alex', lastName: 'Lane', frequencyDays: 7, lastContacted: '2026-11-12T23:00:00Z', openers: [] };

it('marks a contact due on the scheduled calendar day', () => {
  expect(checkInStatus(person, today)).toBe('due');
  expect(checkInStatus({ ...person, frequencyDays: 8 }, today)).toBe('upcoming');
  expect(checkInStatus({ ...person, lastContacted: null }, today)).toBe('never');
});

it('combines a case-insensitive name search and a status filter', () => {
  const other = { ...person, _id: '456', firstName: 'Penny', lastContacted: null };
  expect(filterPeople([other, person], ' alex ', 'due', today)).toEqual([person]);
  expect(filterPeople([other, person], 'lane', 'never', today)).toEqual([other]);
});

import { fullName, Person } from './pulse.model';

export type CheckInStatus = 'due' | 'upcoming' | 'never';
export type PeopleFilter = 'all' | CheckInStatus;

const dayMs = 86_400_000;

export function checkInStatus(person: Person, today = new Date()): CheckInStatus {
  if (!person.lastContacted) return 'never';
  const lastDay = Date.parse(person.lastContacted.slice(0, 10));
  const currentDay = Date.parse(today.toISOString().slice(0, 10));
  return currentDay - lastDay >= person.frequencyDays * dayMs ? 'due' : 'upcoming';
}

export const statusLabels: Record<CheckInStatus, string> = {
  due: 'Check-in due',
  upcoming: 'Up to date',
  never: 'No contact date',
};

export function filterPeople(people: Person[], query: string, filter: PeopleFilter, today = new Date()) {
  const search = query.trim().toLowerCase();
  return people
    .filter((person) =>
      fullName(person).toLowerCase().includes(search) &&
      (filter === 'all' || checkInStatus(person, today) === filter))
    .sort((a, b) => fullName(a).localeCompare(fullName(b)));
}

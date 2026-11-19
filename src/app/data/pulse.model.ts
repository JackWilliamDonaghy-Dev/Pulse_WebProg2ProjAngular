export interface PersonInput {
  firstName: string;
  lastName: string;
  frequencyDays: number;
  lastContacted: string | null;
  openers: string[];
}

export interface Person extends PersonInput {
  _id: string;
}

export function fullName(person: Person): string {
  return `${person.firstName} ${person.lastName}`;
}

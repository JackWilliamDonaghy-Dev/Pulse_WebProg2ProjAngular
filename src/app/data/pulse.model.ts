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

export const interactionTypes = [
  { value: 'call', label: 'Call' },
  { value: 'message', label: 'Message' },
  { value: 'in-person', label: 'In person' },
  { value: 'other', label: 'Other' },
] as const;

export type InteractionType = (typeof interactionTypes)[number]['value'];

export interface InteractionInput {
  personId: string;
  date: string;
  type: InteractionType;
  notes?: string;
}

export interface Interaction extends InteractionInput {
  _id: string;
}

export function interactionLabel(type: InteractionType): string {
  return interactionTypes.find((option) => option.value === type)?.label ?? 'Other';
}

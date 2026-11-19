import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Interaction, InteractionInput, Person, PersonInput } from './pulse.model';

@Injectable({ providedIn: 'root' })
export class PulseApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/v1';

  getPeople() {
    return this.http.get<Person[]>(`${this.base}/people`);
  }

  getPerson(id: string) {
    return this.http.get<Person>(`${this.base}/people/${encodeURIComponent(id)}`);
  }
  createPerson(input: PersonInput) {
    return this.http.post<Person>(`${this.base}/people`, input);
  }

  updatePerson(id: string, input: PersonInput) {
    return this.http.put<Person>(`${this.base}/people/${encodeURIComponent(id)}`, input);
  }

  deletePerson(id: string) {
    return this.http.delete<{ message: string }>(`${this.base}/people/${encodeURIComponent(id)}`);
  }

  getInteractions(personId: string) {
    return this.http.get<Interaction[]>(`${this.base}/interactions`, { params: { personId } });
  }

  getInteraction(id: string) {
    return this.http.get<Interaction>(`${this.base}/interactions/${encodeURIComponent(id)}`);
  }

  createInteraction(input: InteractionInput) {
    return this.http.post<Interaction>(`${this.base}/interactions`, input);
  }

  updateInteraction(id: string, input: Omit<InteractionInput, 'personId'>) {
    return this.http.put<Interaction>(`${this.base}/interactions/${encodeURIComponent(id)}`, input);
  }

  deleteInteraction(id: string) {
    return this.http.delete<{ message: string }>(`${this.base}/interactions/${encodeURIComponent(id)}`);
  }

}

export function requestError(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) return fallback;
  if (error.status === 0 || error.status === 502 || error.status === 504) {
    return 'Could not reach Pulse. Check that the Express API is running and try again.';
  }
  const message: unknown = error.error?.message;
  return error.status >= 400 && error.status < 500 && typeof message === 'string' ? message : fallback;
}

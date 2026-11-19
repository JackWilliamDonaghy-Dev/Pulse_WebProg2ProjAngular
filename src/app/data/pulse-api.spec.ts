import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PulseApi } from './pulse-api';

beforeEach(() => TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] }));
afterEach(() => TestBed.inject(HttpTestingController).verify());

it('passes the contact ID to the interactions endpoint', () => {
  const api = TestBed.inject(PulseApi);
  const http = TestBed.inject(HttpTestingController);
  api.getInteractions('123').subscribe((response) => expect(response).toEqual([]));
  const req = http.expectOne('/api/v1/interactions?personId=123');
  expect(req.request.method).toBe('GET');
  req.flush([]);
});

it('sends edits with PUT and removes records with DELETE', () => {
  const api = TestBed.inject(PulseApi);
  const http = TestBed.inject(HttpTestingController);
  const changes = { date: '2026-11-19T00:00:00Z', type: 'call' as const, notes: 'Called after class.' };
  api.updateInteraction('abc', changes).subscribe();
  const edit = http.expectOne('/api/v1/interactions/abc');
  expect(edit.request.method).toBe('PUT');
  expect(edit.request.body).toEqual(changes);
  edit.flush({ ...changes, _id: 'abc', personId: '123' });
  api.deletePerson('123').subscribe();
  const remove = http.expectOne('/api/v1/people/123');
  expect(remove.request.method).toBe('DELETE');
  remove.flush({ message: 'Person deleted' });
});

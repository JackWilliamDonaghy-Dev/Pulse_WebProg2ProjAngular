import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { PulseApi, requestError } from '../data/pulse-api';
import { Person } from '../data/pulse.model';
import { PersonCard } from './person-card';

@Component({
  imports: [RouterLink, MatButtonModule, PersonCard],
  templateUrl: './people-list.html',
})
export class PeopleList implements OnInit {
  private readonly api = inject(PulseApi);
  readonly people = signal<Person[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit() { this.load(); }

  load() {
    this.error.set('');
    this.loading.set(true);
    this.api.getPeople().subscribe({
      next: (data) => { this.people.set(data); this.loading.set(false); },
      error: (error: unknown) => {
        this.error.set(requestError(error, 'Could not load people.'));
        this.loading.set(false);
      },
    });
  }
}

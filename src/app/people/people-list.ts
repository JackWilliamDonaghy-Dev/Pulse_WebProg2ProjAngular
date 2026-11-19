import { computed, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { filterPeople, PeopleFilter } from '../data/check-in';
import { PulseApi, requestError } from '../data/pulse-api';
import { Person } from '../data/pulse.model';
import { PersonCard } from './person-card';

@Component({
  imports: [RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, PersonCard],
  templateUrl: './people-list.html',
})
export class PeopleList implements OnInit {
  private readonly api = inject(PulseApi);
  readonly people = signal<Person[]>([]);
  readonly query = signal('');
  readonly filter = signal<PeopleFilter>('all');
  readonly visiblePeople = computed(() => filterPeople(this.people(), this.query(), this.filter()));
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

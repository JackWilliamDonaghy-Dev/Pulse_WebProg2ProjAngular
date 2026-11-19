import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PulseApi, requestError } from '../data/pulse-api';
import { fullName, Person } from '../data/pulse.model';

@Component({
  imports: [RouterLink, DatePipe, MatButtonModule, MatCardModule],
  templateUrl: './person-detail.html',
})
export class PersonDetail implements OnInit {
  private readonly api = inject(PulseApi);
  private readonly route = inject(ActivatedRoute);
  protected readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  protected readonly fullName = fullName;
  readonly person = signal<Person | null>(null);
  readonly error = signal('');

  ngOnInit() {
    this.api.getPerson(this.id).subscribe({
      next: (person) => this.person.set(person),
      error: (error: unknown) => this.error.set(requestError(error, 'Could not load this person.')),
    });
  }
}

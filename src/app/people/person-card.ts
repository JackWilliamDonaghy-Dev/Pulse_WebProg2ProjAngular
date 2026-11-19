import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { checkInStatus, statusLabels } from '../data/check-in';
import { fullName, Person } from '../data/pulse.model';

@Component({
  selector: 'app-person-card',
  imports: [RouterLink, MatCardModule, MatButtonModule, DatePipe],
  template: `
    <mat-card appearance="outlined">
      <mat-card-content>
        <p class="status-chip" [class.status-due]="status() === 'due'">{{ statusLabels[status()] }}</p>
        <h2>{{ fullName(person()) }}</h2>
        <p>Check in every {{ person().frequencyDays }} days</p>
        <p class="muted">Last contacted {{ (person().lastContacted | date: 'mediumDate' : 'UTC') ?? 'not recorded' }}</p>
      </mat-card-content>
      <mat-card-actions>
        <a matButton [routerLink]="['/people', person()._id]" [attr.aria-label]="'View ' + fullName(person())">View contact</a>
      </mat-card-actions>
    </mat-card>
  `,
})
export class PersonCard {
  readonly person = input.required<Person>();
  protected readonly status = computed(() => checkInStatus(this.person()));
  protected readonly statusLabels = statusLabels;
  protected readonly fullName = fullName;
}

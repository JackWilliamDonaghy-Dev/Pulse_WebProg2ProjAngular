import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { dateOnly, nonBlank, toApiDate, wholeNumber } from '../data/form-values';
import { PulseApi, requestError } from '../data/pulse-api';
import { PersonInput } from '../data/pulse.model';

@Component({
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './person-form.html',
})
export class PersonForm implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly api = inject(PulseApi);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly id = this.route.snapshot.paramMap.get('id');
  readonly loading = signal(!!this.id);
  readonly loadError = signal('');
  readonly saveError = signal('');
  readonly saving = signal(false);
  private originalDate: string | null = null;

  readonly personForm = this.fb.group({
    firstName: ['', [Validators.required, nonBlank]],
    lastName: ['', [Validators.required, nonBlank]],
    frequencyDays: this.fb.control<number | null>(14, [Validators.required, Validators.min(1), wholeNumber]),
    lastContacted: [''],
    openers: [''],
  });

  ngOnInit() {
    if (!this.id) return;
    this.api.getPerson(this.id).subscribe({
      next: (person) => {
        this.originalDate = person.lastContacted;
        this.personForm.setValue({
          firstName: person.firstName,
          lastName: person.lastName,
          frequencyDays: person.frequencyDays,
          lastContacted: dateOnly(person.lastContacted),
          openers: person.openers.join('\n'),
        });
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loadError.set(requestError(error, 'Could not load the person for editing.'));
        this.loading.set(false);
      },
    });
  }

  onSubmit() {
    this.personForm.markAllAsTouched();
    if (this.personForm.invalid || this.saving()) return;
    const { firstName, lastName, frequencyDays, lastContacted, openers } = this.personForm.getRawValue();
    if (frequencyDays === null) return;
    const input: PersonInput = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      frequencyDays,
      lastContacted: lastContacted ? toApiDate(lastContacted, this.originalDate) : null,
      openers: openers.split('\n').map((line) => line.trim()).filter(Boolean),
    };
    this.saving.set(true);
    this.saveError.set('');
    const request = this.id ? this.api.updatePerson(this.id, input) : this.api.createPerson(input);
    request.subscribe({
      next: (person) => void this.router.navigate(['/people', person._id]),
      error: (error: unknown) => {
        this.saveError.set(requestError(error, 'Could not save this person. Your entries have been kept.'));
        this.saving.set(false);
      },
    });
  }
}

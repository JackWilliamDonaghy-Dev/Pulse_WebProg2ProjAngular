import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin, of } from 'rxjs';
import { dateOnly, toApiDate } from '../data/form-values';
import { PulseApi, requestError } from '../data/pulse-api';
import { fullName, interactionTypes, InteractionType } from '../data/pulse.model';

@Component({
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './interaction-form.html',
})
export class InteractionForm implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly api = inject(PulseApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly personId = this.route.snapshot.paramMap.get('id') ?? '';
  readonly interactionId = this.route.snapshot.paramMap.get('interactionId');
  readonly types = interactionTypes;
  readonly personName = signal('');
  readonly loading = signal(true);
  readonly loadError = signal('');
  readonly saveError = signal('');
  readonly saving = signal(false);
  private originalDate: string | null = null;

  readonly form = this.fb.group({
    date: [dateOnly(new Date().toISOString()), Validators.required],
    type: this.fb.control<InteractionType>('call', Validators.required),
    notes: [''],
  });

  ngOnInit() {
    forkJoin({
      person: this.api.getPerson(this.personId),
      interaction: this.interactionId ? this.api.getInteraction(this.interactionId) : of(null),
    }).subscribe({
      next: ({ person, interaction }) => {
        this.personName.set(fullName(person));
        if (interaction && interaction.personId !== person._id) {
          this.loadError.set('This interaction does not belong to this contact.');
        } else if (interaction) {
          this.originalDate = interaction.date;
          this.form.setValue({ date: dateOnly(interaction.date), type: interaction.type, notes: interaction.notes ?? '' });
        }
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loadError.set(requestError(error, 'Could not load the interaction form.'));
        this.loading.set(false);
      },
    });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) return;
    const { date, type, notes } = this.form.getRawValue();
    const input = { date: toApiDate(date, this.originalDate), type, notes: notes.trim() };
    this.saving.set(true);
    this.saveError.set('');
    const request = this.interactionId
      ? this.api.updateInteraction(this.interactionId, input)
      : this.api.createInteraction({ ...input, personId: this.personId });
    request.subscribe({
      next: () => void this.router.navigate(['/people', this.personId]),
      error: (error: unknown) => {
        this.saveError.set(requestError(error, 'Could not save this interaction. Your entries have been kept.'));
        this.saving.set(false);
      },
    });
  }
}

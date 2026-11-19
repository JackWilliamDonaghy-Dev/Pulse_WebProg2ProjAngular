import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { PulseApi, requestError } from '../data/pulse-api';
import { fullName, Interaction, interactionLabel, Person } from '../data/pulse.model';
import { ConfirmDelete, DeletePrompt } from '../shared/confirm-delete';

@Component({
  imports: [RouterLink, DatePipe, MatButtonModule, MatCardModule],
  templateUrl: './person-detail.html',
})
export class PersonDetail implements OnInit {
  private readonly api = inject(PulseApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  protected readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  protected readonly fullName = fullName;
  protected readonly interactionLabel = interactionLabel;
  readonly person = signal<Person | null>(null);
  readonly error = signal('');
  readonly interactions = signal<Interaction[]>([]);
  readonly interactionsLoading = signal(true);
  readonly interactionsError = signal('');
  readonly deleteError = signal('');
  readonly deleting = signal(false);
  readonly notice = signal('');

  ngOnInit() {
    this.api.getPerson(this.id).subscribe({
      next: (person) => { this.person.set(person); this.loadInteractions(); },
      error: (error: unknown) => this.error.set(requestError(error, 'Could not load this person.')),
    });
  }

  loadInteractions() {
    this.interactionsLoading.set(true);
    this.interactionsError.set('');
    this.api.getInteractions(this.id).subscribe({
      next: (data) => {
        // Older versions of the Express API ignore query parameters.
        this.interactions.set(data.filter((item) => item.personId === this.id).sort((a, b) => b.date.localeCompare(a.date)));
        this.interactionsLoading.set(false);
      },
      error: (error: unknown) => {
        this.interactionsError.set(requestError(error, 'Could not load interactions.'));
        this.interactionsLoading.set(false);
      },
    });
  }

  removePerson(person: Person) {
    if (this.deleting() || this.interactionsLoading() || this.interactionsError() || this.interactions().length) return;
    this.confirm({ title: 'Delete contact?', description: `${fullName(person)} will be removed from Pulse.` }, () => {
      this.api.deletePerson(person._id).subscribe({
        next: () => void this.router.navigate(['/people']),
        error: (error: unknown) => this.failDelete(error, 'Could not delete this contact.'),
      });
    });
  }

  removeInteraction(item: Interaction) {
    if (this.deleting()) return;
    this.confirm({ title: 'Delete interaction?', description: 'This entry will be removed from the contact history.' }, () => {
      this.api.deleteInteraction(item._id).subscribe({
        next: () => {
          this.interactions.update((rows) => rows.filter((row) => row._id !== item._id));
          this.notice.set('Interaction deleted.');
          this.deleting.set(false);
        },
        error: (error: unknown) => this.failDelete(error, 'Could not delete this interaction.'),
      });
    });
  }

  private confirm(data: DeletePrompt, action: () => void) {
    this.deleteError.set('');
    this.notice.set('');
    this.dialog.open<ConfirmDelete, DeletePrompt, boolean>(ConfirmDelete, { data })
      .afterClosed().subscribe((confirmed) => {
        if (!confirmed || this.deleting()) return;
        this.deleting.set(true);
        action();
      });
  }

  private failDelete(error: unknown, message: string) {
    this.deleteError.set(requestError(error, message));
    this.deleting.set(false);
  }
}

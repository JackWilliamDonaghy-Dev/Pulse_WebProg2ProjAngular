import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface DeletePrompt {
  title: string;
  description: string;
}

@Component({
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.description }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton [mat-dialog-close]="false" cdkFocusInitial>Cancel</button>
      <button matButton="outlined" class="danger" [mat-dialog-close]="true">Delete</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDelete {
  protected readonly data = inject<DeletePrompt>(MAT_DIALOG_DATA);
}

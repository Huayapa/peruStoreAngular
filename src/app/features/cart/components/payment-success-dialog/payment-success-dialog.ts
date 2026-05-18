import { Component, inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-payment-success-dialog',
  imports: [MatDialogActions, MatDialogContent, MatDialogTitle, MatAnchor],
  templateUrl: './payment-success-dialog.html',
  styleUrl: './payment-success-dialog.scss',
})
export class PaymentSuccessDialog {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialog>);

  close(): void {
    this.dialogRef.close(true);
  }
}

import { Component, inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { MatAnchor } from '@angular/material/button';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-payment-success-dialog',
  imports: [MatDialogActions, MatDialogContent, MatDialogTitle, MatAnchor, LottieComponent],
  templateUrl: './payment-success-dialog.html',
  styleUrl: './payment-success-dialog.scss',
})
export class PaymentSuccessDialog {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialog>);
  readonly optslottie: AnimationOptions = {
    path: '/animations/Success.json',
    autoplay: true,
    loop: false,
  };

  close(): void {
    this.dialogRef.close(true);
  }
}

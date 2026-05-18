import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { MatDialog } from '@angular/material/dialog';
import { PaymentSuccessDialog } from '../../components/payment-success-dialog/payment-success-dialog';

@Component({
  selector: 'app-payment-success',
  imports: [],
  template: ``,
  styles: ``,
})
export default class PaymentSuccessPage implements OnInit {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('redirect_status');
    if (status === 'succeeded') {
      this.router.navigate([APP_ROUTES.HOME.ROOT]).then(() => {
        this.viewSuccessPaymentDialog();
      });
    } else {
      this.router.navigate([APP_ROUTES.CART.CHECKOUT.ROOT], {
        queryParams: { error: 'Pago Fallido' },
      });
    }
  }

  viewSuccessPaymentDialog() {
    this.dialog.open(PaymentSuccessDialog, {
      width: '300px',
    });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { CartProductsService } from '../../../../core/services/cart-products';
import { CheckoutSessionService } from '../../../../core/services/checkout/checkout-session';
import { PaymentSuccessDialog } from '../../components/payment-success-dialog/payment-success-dialog';

@Component({
  selector: 'app-payment-success',
  imports: [],
  template: ``,
  styles: ``,
})
export default class PaymentSuccessPage implements OnInit {
  private readonly _checkoutSession = inject(CheckoutSessionService);
  private readonly _router = inject(Router);
  private readonly _routerActive = inject(ActivatedRoute);
  private readonly _cart = inject(CartProductsService);
  private readonly _dialog = inject(MatDialog);
  ngOnInit(): void {
    const status = this._routerActive.snapshot.queryParamMap.get('redirect_status');
    if (status === 'succeeded') {
      this._router.navigate([APP_ROUTES.HOME.ROOT]).then(() => {
        this.viewSuccessPaymentDialog();
        this._cart.clearCart();
        this._checkoutSession.removeToken();
      });
    } else {
      this._router.navigate([APP_ROUTES.CART.ROOT, APP_ROUTES.CART.CHECKOUT.ROOT], {
        queryParams: { error: 'Pago Fallido' },
      });
    }
  }

  viewSuccessPaymentDialog() {
    this._dialog.open(PaymentSuccessDialog, {
      width: '300px',
    });
  }
}

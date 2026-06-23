import { Component, DestroyRef, inject } from '@angular/core';
import { MatAnchor, MatMiniFabButton } from '@angular/material/button';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { IProduct } from '../../../../shared/interfaces/product.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { CartProductsService } from '../../../../core/services/cart-products/cart-products';

@Component({
  selector: 'app-cart-detail',
  imports: [MatAnchor, MatIcon, CurrencyPipe, MatMiniFabButton],
  templateUrl: './cart-detail.html',
  styleUrl: './cart-detail.scss',
})
export default class CartDetailPage {
  private readonly _cardProducts = inject(CartProductsService);
  private readonly _dialog = inject(MatDialog);
  private readonly _destroyRef = inject(DestroyRef);
  readonly APP_ROUTES = APP_ROUTES;

  cart = toSignal(this._cardProducts.cartproduct$, { initialValue: null });
  total = toSignal(this._cardProducts.totalPrice$, { initialValue: 0 });

  updateStock(productId: number, e: Event) {
    const target = e.target as HTMLInputElement;
    if (Number(target.value) < 1) {
      target.value = '1';
      return;
    }
    this._cardProducts.updateStock(productId, Number(target.value));
  }

  deleteProduct(prod: IProduct) {
    const dialogRef = this._dialog.open(ConfirmDialog, {
      width: '350px',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      data: {
        title: 'Eliminar producto del carrito',
        message: '¿Seguro que deseas borrarlo?',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((confirmed) => {
        if (confirmed) {
          this._cardProducts.removeProductToCart(prod);
        }
      });
  }
}

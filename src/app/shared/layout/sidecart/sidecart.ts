import { Component, DestroyRef, inject, signal } from '@angular/core';
import { SidenavService } from '../../../core/services/sidenav';
import { MatIconButton, MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ICartProduct } from '../../../core/interfaces/cart.interfaces';
import { IProduct } from '../../interfaces/product.interface';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../core/constants/app-routes';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartProductsService } from '../../../core/services/cart-products/cart-products';

@Component({
  selector: 'app-sidecart',
  imports: [MatIcon, MatIconButton, MatAnchor, RouterLink, CurrencyPipe],
  templateUrl: './sidecart.html',
  styleUrl: './sidecart.scss',
})
export class Sidecart {
  private readonly _cartProduct = inject(CartProductsService);
  private readonly _destroyRef = inject(DestroyRef);
  readonly APP_ROUTES = APP_ROUTES;
  readonly sidenav = inject(SidenavService);

  cartProduct = signal<ICartProduct | null>(null);
  totalProduct = signal<number>(0);

  constructor() {
    this._cartProduct.cartproduct$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((cart) => {
      this.cartProduct.set(cart);
    });
    this._cartProduct.totalPrice$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((price) => {
      this.totalProduct.set(price);
    });
  }

  removeProductToCart(e: Event, prod: IProduct) {
    e.stopPropagation();
    this._cartProduct.removeProductToCart(prod);
  }
}

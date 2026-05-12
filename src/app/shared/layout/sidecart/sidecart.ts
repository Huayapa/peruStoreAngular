import { Component, inject, signal } from '@angular/core';
import { SidenavService } from '../../../core/services/sidenav';
import { MatIconButton, MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CartProductsService } from '../../../core/services/cart-products';
import { ICartProduct } from '../../../core/interfaces/cart.interfaces';
import { IProduct } from '../../interfaces/product.interface';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../core/constants/app-routes';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-sidecart',
  imports: [MatIcon, MatIconButton, MatAnchor, RouterLink, CurrencyPipe],
  templateUrl: './sidecart.html',
  styleUrl: './sidecart.scss',
})
export class Sidecart {
  private readonly _cartProduct = inject(CartProductsService);
  readonly APP_ROUTES = APP_ROUTES;
  readonly sidenav = inject(SidenavService);

  cartProduct = signal<ICartProduct | null>(null);
  totalProduct = signal<number>(0);

  constructor() {
    this._cartProduct.cartproduct$.subscribe((cart) => {
      this.cartProduct.set(cart);
    });
    this._cartProduct.totalPrice$.subscribe((price) => {
      this.totalProduct.set(price);
    });
  }

  removeProductToCart(e: Event, prod: IProduct) {
    e.stopPropagation();
    this._cartProduct.removeProductToCart(prod);
  }
}

import { Component, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MatCardActions,
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
} from '@angular/material/card';
import { IProduct } from '../../interfaces/product.interface';
import { MatFabButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../core/constants/app-routes';
import { CartProductsService } from '../../../core/services/cart-products';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-card-product',
  imports: [
    MatIcon,
    MatCardActions,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatFabButton,
    RouterLink,
    MatCardSubtitle,
    CurrencyPipe,
  ],
  templateUrl: './card-product.html',
  styleUrl: './card-product.scss',
})
export class CardProduct {
  private readonly _cartProduct = inject(CartProductsService);
  readonly product = input.required<IProduct>();
  readonly APP_ROUTES = APP_ROUTES;

  addToCart(e: Event) {
    e.stopPropagation();
    this._cartProduct.addProductToCart(this.product());
  }
}

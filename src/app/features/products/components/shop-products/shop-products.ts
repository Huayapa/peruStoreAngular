import { Component, input } from '@angular/core';
import { CardProduct } from '../../../../shared/components/card-product/card-product';
import { IProduct } from '../../../../shared/interfaces/product.interface';

@Component({
  selector: 'app-shop-products',
  imports: [CardProduct],
  templateUrl: './shop-products.html',
  styleUrl: './shop-products.scss',
})
export class ShopProducts {
  products = input.required<IProduct[]>();
}

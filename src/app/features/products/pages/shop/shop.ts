import { Component, inject } from '@angular/core';
import { Breadcrumb } from '../../../../shared/components/breadcrumb/breadcrumb';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../../core/services/product';
import { CardProduct } from '../../../../shared/components/card-product/card-product';

@Component({
  selector: 'app-shop',
  imports: [Breadcrumb, CardProduct],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export default class ShopPage {
  private readonly _product = inject(ProductService);
  products = toSignal(this._product.getProducts(), { initialValue: [] });
}

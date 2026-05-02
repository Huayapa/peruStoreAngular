import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../../core/services/product';
import { CardProduct } from '../../../../shared/components/card-product/card-product';
import { BannerSection } from '../../../home/components/banner-section/banner-section';

@Component({
  selector: 'app-shop',
  imports: [CardProduct, BannerSection],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export default class ShopPage {
  private readonly _product = inject(ProductService);
  products = toSignal(this._product.getProducts(), { initialValue: [] });
}

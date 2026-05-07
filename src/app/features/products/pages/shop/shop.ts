import { Component, computed, inject, signal } from '@angular/core';
import { BannerSection } from '../../../home/components/banner-section/banner-section';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { ShopFilter } from '../../components/shop-filter/shop-filter';
import { ShopProducts } from '../../components/shop-products/shop-products';
import { ShopPagination } from '../../components/shop-pagination/shop-pagination';
import { ProductService } from '../../../../core/services/product';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { IFilterProduct } from '../../../../core/interfaces/product.interface';

@Component({
  selector: 'app-shop',
  imports: [
    BannerSection,
    ReactiveFormsModule,
    MatSliderModule,
    ShopFilter,
    ShopProducts,
    ShopPagination,
  ],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export default class ShopPage {
  private readonly _product = inject(ProductService);
  readonly categories = toSignal(this._product.getCategory(), { initialValue: [] });
  readonly filterProduct = signal<IFilterProduct>({});

  readonly page = signal(1);
  readonly pageSize = 9;
  readonly totalPages = computed(() =>
    Array(Math.ceil(this.products().total / this.pageSize))
      .fill(0)
      .map((_, n) => n + 1),
  );

  private params = computed(() => ({
    page: this.page(),
    pageSize: this.pageSize,
    ...this.filterProduct(),
  }));

  products = toSignal(
    toObservable(this.params).pipe(
      switchMap((params) => this._product.getFilteredProducts(params)),
    ),
    { initialValue: { products: [], total: 0 } },
  );

  onPageChange(newpage: number) {
    this.page.set(newpage);
  }

  onFilterChange(params: IFilterProduct) {
    this.filterProduct.set(params);
  }
}

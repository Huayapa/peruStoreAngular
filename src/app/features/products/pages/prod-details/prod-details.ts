import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, filter, map, switchMap, tap } from 'rxjs';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { ProductService } from '../../../../core/services/product';
import { IProduct } from '../../../../shared/interfaces/product.interface';
import { SliderProducts } from '../../../../shared/components/slider-products/slider-products';
import { CurrencyPipe } from '@angular/common';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-prod-details',
  imports: [SliderProducts, CurrencyPipe, MatIcon, MatFabButton],
  templateUrl: './prod-details.html',
  styleUrl: './prod-details.scss',
})
export default class ProdDetailsPage {
  private readonly _ActivatedRouter = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _product = inject(ProductService);
  readonly APP_ROUTES = APP_ROUTES;
  category = signal<string[]>([]);

  product = toSignal<IProduct | null>(
    this._ActivatedRouter.paramMap.pipe(
      map((param) => Number(param.get('id'))),
      switchMap((id) =>
        this._product.getProductId(id).pipe(
          tap((product) => {
            if (!product || !product.id) {
              this._router.navigate([APP_ROUTES.HOME.ROOT]);
            }
            this.category.set([product.category]);
          }),
          catchError(() => {
            this._router.navigate([APP_ROUTES.HOME.ROOT]);
            return EMPTY;
          }),
        ),
      ),
    ),
    { initialValue: null },
  );
  products = toSignal(
    toObservable(this.category).pipe(
      filter((categories) => categories.length > 0),
      switchMap((categories) => this._product.getFilteredProducts({ categories })),
    ),
    { initialValue: { products: [], total: 0 } },
  );
}

import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, map, switchMap, tap } from 'rxjs';
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

  products = toSignal(this._product.getProducts(), { initialValue: [] });
  product = toSignal<IProduct | null>(
    this._ActivatedRouter.paramMap.pipe(
      map((param) => Number(param.get('id'))),
      switchMap((id) =>
        this._product.getProductId(id).pipe(
          tap((product) => {
            if (!product || !product.id) {
              this._router.navigate([APP_ROUTES.HOME.ROOT]);
            }
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
}

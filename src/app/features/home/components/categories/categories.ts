import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../../core/services/product';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes';

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  private readonly _product = inject(ProductService);
  readonly APP_ROUTES = APP_ROUTES;
  categories = toSignal(this._product.getCategory(), { initialValue: [] });
}

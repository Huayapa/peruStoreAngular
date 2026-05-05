import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ProductService } from '../../../core/services/product';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../core/constants/app-routes';

@Component({
  selector: 'app-search-bar',
  imports: [MatIcon, ReactiveFormsModule, RouterLink],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  private readonly _product = inject(ProductService);
  private readonly _fb = inject(FormBuilder);
  readonly APP_ROUTES = APP_ROUTES;
  readonly form = this._fb.group({
    search: '',
  });
  products = toSignal(
    this.form.valueChanges.pipe(
      startWith(this.form.value),
      debounceTime(500),
      takeUntilDestroyed(),
      switchMap(({ search }) => {
        const value = search ? search : '';
        return this._product.getFilteredProducts({ search: value, pageSize: 2 });
      }),
    ),
    { initialValue: { products: [], total: 0 } },
  );
}

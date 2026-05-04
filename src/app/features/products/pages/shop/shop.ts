import { Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { IFilterProduct, ProductService } from '../../../../core/services/product';
import { CardProduct } from '../../../../shared/components/card-product/card-product';
import { BannerSection } from '../../../home/components/banner-section/banner-section';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-shop',
  imports: [CardProduct, BannerSection, ReactiveFormsModule, MatCheckbox, MatIcon, MatSliderModule],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export default class ShopPage {
  private readonly _routeActive = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _form = inject(NonNullableFormBuilder);
  private readonly _product = inject(ProductService);

  readonly categories = toSignal(this._product.getCategory(), { initialValue: [] });
  readonly products = toSignal(
    this._routeActive.queryParams.pipe(
      takeUntilDestroyed(),
      switchMap((params) => {
        const filters: IFilterProduct = {
          categories: params['category'] ? [].concat(params['category']) : [],
          search: params['search'] ? String(params['search']) : '',
          min: params['min'] ? Number(params['min']) : 0,
          max: params['max'] ? Number(params['max']) : 10000,
        };

        return this._product.getFilteredProducts(filters);
      }),
    ),
    { initialValue: [] },
  );

  form = this._form.group({
    fsearch: '',
    fcategory: this._form.array<string>([]),
    fmin: 0,
    fmax: 10000,
  });

  constructor() {
    const initialValue = this._routeActive.snapshot.queryParams;
    if (initialValue['category']) {
      const categories = [].concat(initialValue['category']);
      categories.forEach((cat) => this.form.controls.fcategory.push(this._form.control(cat)));
    }
    if (initialValue['search']) {
      this.form.controls.fsearch.setValue(initialValue['search'], { emitEvent: false });
    }
    if (initialValue['min']) {
      this.form.controls.fmin.setValue(initialValue['min'], { emitEvent: false });
    }
    if (initialValue['max']) {
      this.form.controls.fmax.setValue(initialValue['max'], { emitEvent: false });
    }

    this.form.valueChanges
      .pipe(debounceTime(500), takeUntilDestroyed())
      .subscribe(({ fcategory, fsearch, fmin, fmax }) => {
        this._router.navigate([], {
          queryParams: {
            category: fcategory,
            search: fsearch,
            min: fmin,
            max: fmax,
          },
          queryParamsHandling: 'merge',
        });
      });
  }

  onCategoryChange(category: string, checked: boolean) {
    const fcategory = this.form.controls.fcategory;
    if (checked) {
      fcategory.push(this._form.control(category));
    } else {
      const index = fcategory.controls.findIndex((c) => c.value === category);
      fcategory.removeAt(index);
    }
  }

  isCategoryChecked(category: string): boolean {
    return this.form.controls.fcategory.controls.some((c) => c.value === category);
  }
}

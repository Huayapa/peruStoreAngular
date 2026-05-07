import { Component, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, map } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';
import { CurrencyPipe } from '@angular/common';
import { IFilterProduct } from '../../../../core/interfaces/product.interface';

@Component({
  selector: 'app-shop-filter',
  imports: [MatIcon, MatSliderModule, ReactiveFormsModule, MatCheckbox, CurrencyPipe],
  templateUrl: './shop-filter.html',
  styleUrl: './shop-filter.scss',
})
export class ShopFilter {
  filterChange = output<IFilterProduct>();
  categories = input.required<string[]>();

  private readonly _routeActive = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _form = inject(FormBuilder);

  form = this._form.group({
    fsearch: [''],
    fcategory: this._form.array<string>([]),
    fmin: [0],
    fmax: [5000],
  });

  constructor() {
    this.initValuesForm();
    this.listenQueryParams();
    this.listenValueChangeForm();
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

  private initValuesForm() {
    const params = this._routeActive.snapshot.queryParams;
    const opts = { emitEvent: false };
    if (params['category']) {
      []
        .concat(params['category'])
        .forEach((cat) => this.form.controls.fcategory.push(this._form.control(cat)));
    }
    if (params['search']) this.form.controls.fsearch.setValue(params['search'], opts);
    if (params['min']) this.form.controls.fmin.setValue(params['min'], opts);
    if (params['max']) this.form.controls.fmax.setValue(params['max'], opts);
  }
  private listenQueryParams(): void {
    this._routeActive.queryParams
      .pipe(
        takeUntilDestroyed(),
        map(
          (params): IFilterProduct => ({
            categories: params['category'] ? ([] as string[]).concat(params['category']) : [],
            search: params['search'] ? String(params['search']) : '',
            min: params['min'] ? Number(params['min']) : 0,
            max: params['max'] ? Number(params['max']) : 5000,
          }),
        ),
      )
      .subscribe((data) => this.filterChange.emit(data));
  }
  private listenValueChangeForm(): void {
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
}

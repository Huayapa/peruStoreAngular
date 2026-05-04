import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { catchError, map, of } from 'rxjs';

export const productTitleResolver: ResolveFn<string> = (route) => {
  const _product = inject(ProductService);
  const id = Number(route.paramMap.get('id'));
  return _product.getProductId(id).pipe(
    map((product) => product.title),
    catchError(() => of('Esperando...')),
  );
};

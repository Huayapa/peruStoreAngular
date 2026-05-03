import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { IProduct } from '../../shared/interfaces/product.interface';
export interface IFilterProduct {
  categories: string[];
  search: string;
  min: number;
  max: number;
}
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly urlDomain = environment.apiUrl;
  private readonly http = inject(HttpClient);
  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.urlDomain}/products`);
  }

  getFilteredProducts(filters: IFilterProduct): Observable<IProduct[]> {
    const { categories, search, min, max } = filters;
    const normalizedSearch = search.trim().toLowerCase();
    return this.http.get<IProduct[]>(`${this.urlDomain}/products`).pipe(
      map((product) =>
        product.filter((p) => {
          const matchCategory = categories.length === 0 || categories.includes(p.category);
          const matchSearch = !normalizedSearch || p.title.toLowerCase().includes(normalizedSearch);
          const matchPrice = p.price >= (min ?? 0) && p.price <= (max ?? Infinity);
          return matchCategory && matchSearch && matchPrice;
        }),
      ),
    );
  }

  getCategory(): Observable<string[]> {
    return this.http
      .get<IProduct[]>(`${this.urlDomain}/products`)
      .pipe(map((prods) => [...new Set(prods.map((prod) => prod.category))]));
  }
}

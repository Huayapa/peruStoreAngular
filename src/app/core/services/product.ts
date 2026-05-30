import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { IProduct } from '../../shared/interfaces/product.interface';
import { IFilterProduct, IFilteredResult } from '../interfaces/product.interface';
import { SKIP_AUTH } from '../interceptors/auth-interceptor';
import { SKIP_SESSION } from '../interceptors/checkout-session-interceptor';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly urlDomain = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private readonly opts = {
    context: new HttpContext().set(SKIP_AUTH, true).set(SKIP_SESSION, true),
  };
  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.urlDomain}products`, this.opts);
  }

  getProductId(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.urlDomain}products/${id}`, this.opts);
  }

  getFilteredProducts(filters: IFilterProduct): Observable<IFilteredResult> {
    const {
      categories = [],
      search = '',
      min = 0,
      max = Infinity,
      page = 1,
      pageSize = Infinity,
    } = filters;
    const normalizedSearch = search.trim().toLowerCase();
    return this.http.get<IProduct[]>(`${this.urlDomain}products`, this.opts).pipe(
      map((products) => {
        const filtered = products.filter((p) => {
          const matchCategory = categories.length === 0 || categories.includes(p.category);
          const matchSearch = !normalizedSearch || p.title.toLowerCase().includes(normalizedSearch);
          const matchPrice = p.price >= min && p.price <= max;
          return matchCategory && matchSearch && matchPrice;
        });
        const start = (page - 1) * pageSize;
        const end = pageSize === Infinity ? filtered.length : start + pageSize;
        return {
          products: filtered.slice(start, end),
          total: filtered.length,
        };
      }),
    );
  }

  getCategory(): Observable<string[]> {
    return this.http
      .get<IProduct[]>(`${this.urlDomain}products`, this.opts)
      .pipe(map((prods) => [...new Set(prods.map((prod) => prod.category))]));
  }
}

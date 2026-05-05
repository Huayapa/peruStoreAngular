import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { IProduct } from '../../shared/interfaces/product.interface';
export interface IFilterProduct {
  categories?: string[];
  search?: string;
  min?: number;
  max?: number;
  page?: number;
  pageSize?: number;
}
interface IFilteredResult {
  products: IProduct[];
  total: number;
}
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly urlDomain = environment.apiUrl;
  private readonly http = inject(HttpClient);
  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.urlDomain}products`);
  }

  getProductId(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.urlDomain}products/${id}`);
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
    return this.http.get<IProduct[]>(`${this.urlDomain}products`).pipe(
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
      .get<IProduct[]>(`${this.urlDomain}/products`)
      .pipe(map((prods) => [...new Set(prods.map((prod) => prod.category))]));
  }
}

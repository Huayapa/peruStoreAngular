import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { IProduct } from '../../shared/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly urlDomain = environment.apiUrl;
  private readonly http = inject(HttpClient);
  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.urlDomain}/products`);
  }
  getCategory(): Observable<string[]> {
    return this.http
      .get<IProduct[]>(`${this.urlDomain}/products`)
      .pipe(map((prods) => [...new Set(prods.map((prod) => prod.category))]));
  }
}

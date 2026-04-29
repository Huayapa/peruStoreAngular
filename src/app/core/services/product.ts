import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
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
}

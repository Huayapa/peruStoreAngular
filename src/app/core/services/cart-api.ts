import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { ICartResponse } from '../interfaces/cart.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartApiService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getCart(userId: number): Observable<ICartResponse | null> {
    return this._http
      .get<ICartResponse[]>(`${this.apiUrl}carts`)
      .pipe(map((carts) => carts.filter((cart) => cart.userId === userId).pop() ?? null));
  }
}

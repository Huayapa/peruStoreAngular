import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SKIP_SESSION } from '../../interceptors/checkout-session-interceptor';
import { ICartResponse } from '../../interfaces/cart.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartApiService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly opts = {
    context: new HttpContext().set(SKIP_SESSION, true),
  };

  getAllCarts(): Observable<ICartResponse[]> {
    return this._http
      .get<ICartResponse[]>(`${this.apiUrl}carts`, this.opts)
      .pipe(map((carts) => [...new Map(carts.map((cart) => [cart.userId, cart])).values()]));
  }

  getCart(userId: number): Observable<ICartResponse | null> {
    return this._http
      .get<ICartResponse[]>(`${this.apiUrl}carts`, this.opts)
      .pipe(map((carts) => carts.filter((cart) => cart.userId === userId).pop() ?? null));
  }

  addNewCart(cart: ICartResponse): Observable<ICartResponse> {
    return this._http.post<ICartResponse>(`${this.apiUrl}carts`, cart, this.opts);
  }

  updateCart(cart: ICartResponse): Observable<ICartResponse> {
    return this._http.put<ICartResponse>(`${this.apiUrl}carts/${cart.userId}`, cart, this.opts);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth';
import { BehaviorSubject, map } from 'rxjs';
import { ICartProduct } from '../interfaces/cart.interfaces';
import { ProductService } from './product';
import { IProduct } from '../../shared/interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartProductsService {
  private readonly _product = inject(ProductService);
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly _auth = inject(AuthService);
  private readonly cartstorage = 'cart_store';
  private readonly _cart$ = new BehaviorSubject<ICartProduct>(this.getCartStorage());

  readonly cartproduct$ = this._cart$.asObservable();
  readonly totalPrice$ = this._cart$.pipe(
    map((cart) => cart.products.reduce((acc, prod) => acc + prod.quantity * prod.product.price, 0)),
  );
  readonly totalItem$ = this._cart$.pipe(
    map((cart) => cart.products.reduce((acc, prod) => acc + prod.quantity, 0)),
  );

  constructor() {
    this._cart$.subscribe((cart) => this.updateCartStorage(cart));
  }

  addProductToCart(prod: IProduct) {
    const cart = this.getCartStorage();
    const index = cart.products.findIndex((item) => item.product.id === prod.id);
    if (index === -1) {
      cart?.products.push({ product: prod, quantity: 1 });
    } else {
      cart.products[index] = {
        ...cart.products[index],
        quantity: cart.products[index].quantity + 1,
      };
    }
    return this._cart$.next(cart);
  }

  updateStock(productId: number, newQuantity: number) {
    if (newQuantity < 1) return;
    const cart = this.getCartStorage();
    cart.products = cart.products.map((item) =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item,
    );
    this._cart$.next(cart);
  }

  removeProductToCart(prod: IProduct) {
    const cart = this.getCartStorage();
    cart.products = cart.products.filter((item) => item.product.id !== prod.id);
    return this._cart$.next(cart);
  }

  private getCartStorage() {
    const cart = localStorage.getItem(this.cartstorage);
    return cart ? (JSON.parse(cart) as ICartProduct) : this.createEmptyCart();
  }

  private updateCartStorage(cart: ICartProduct) {
    localStorage.setItem(this.cartstorage, JSON.stringify(cart));
  }

  private createEmptyCart(): ICartProduct {
    return {
      id: 0,
      userId: this._auth.getUserId() ?? 0,
      products: [],
    };
  }
}

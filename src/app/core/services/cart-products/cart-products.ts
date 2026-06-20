import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  catchError,
  filter,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { IProduct } from '../../shared/interfaces/product.interface';
import { CartAdapter } from '../adapters/cart.adapter';
import { ICartItems, ICartProduct, ICartResponse } from '../interfaces/cart.interfaces';
import { AuthService } from './auth/auth';
import { CartApiService } from './cart-api/cart-api';
import { ProductService } from './product/product';

@Injectable({
  providedIn: 'root',
})
export class CartProductsService {
  private readonly _product = inject(ProductService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _auth = inject(AuthService);
  private readonly _cartapi = inject(CartApiService);
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
    this._cart$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((cart) => this.updateCartStorage(cart));
  }

  addProductToCart(prod: IProduct) {
    const cart = this.getCartStorage();
    const index = cart.products.findIndex((item) => item.product.id === prod.id);

    const updateCart =
      index === -1
        ? { ...cart, products: [...cart.products, { product: prod, quantity: 1 }] }
        : {
            ...cart,
            products: cart.products.map((item, i) =>
              i === index ? { ...item, quantity: item.quantity + 1 } : item,
            ),
          };

    this._cart$.next(updateCart);
    if (!this._auth.isLoggedIn()) return;
    const apiCart = CartAdapter.toAPI(updateCart);
    const request$ =
      updateCart.id === 0 ? this._cartapi.addNewCart(apiCart) : this._cartapi.updateCart(apiCart);

    request$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        catchError((err) => {
          this._cart$.next(cart);
          throw err;
        }),
      )
      .subscribe();
  }

  updateStock(productId: number, newQuantity: number) {
    if (newQuantity < 1) return;
    const cart = this.getCartStorage();
    const updateCart = {
      ...cart,
      products: cart.products.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    };
    this._cart$.next(updateCart);
    if (this._auth.isLoggedIn()) this._cartapi.updateCart(CartAdapter.toAPI(updateCart));
  }

  removeProductToCart(prod: IProduct) {
    const cart = this.getCartStorage();
    const updateCart = {
      ...cart,
      products: cart.products.filter((item) => item.product.id !== prod.id),
    };
    this._cart$.next(updateCart);
    if (this._auth.isLoggedIn()) this._cartapi.updateCart(CartAdapter.toAPI(updateCart));
  }

  getCartStorage() {
    const cart = localStorage.getItem(this.cartstorage);
    return cart ? (JSON.parse(cart) as ICartProduct) : this.createEmptyCart();
  }

  updateCartItems(prod: ICartItems[]) {
    const cart = this.getCartStorage();
    const newCart = { id: cart.id, userId: cart.userId, products: prod };
    if (JSON.stringify(cart) === JSON.stringify(newCart)) return;
    this._cart$.next(newCart);
    if (this._auth.isLoggedIn()) this._cartapi.updateCart(CartAdapter.toAPI(newCart));
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

  loadUserCart(): void {
    const userId = this._auth.getUserId();
    if (!userId || userId === 0) return;
    this._cartapi
      .getCart(userId)
      .pipe(
        filter((cart) => !!cart),
        switchMap((cart) => this.resolverCartProducts(cart)),
        filter((cartProduct) => !!cartProduct),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((cartProduct) => {
        this._cart$.next(cartProduct);
      });
  }

  private resolverCartProducts(cart: ICartResponse): Observable<ICartProduct | null> {
    if (!cart.products.length) {
      return of(CartAdapter.fromAPI(cart, []));
    }

    const requests = cart.products.map((item) =>
      this._product
        .getProductId(item.productId)
        .pipe(map((prod) => ({ product: prod, quantity: item.quantity }) as ICartItems)),
    );

    return forkJoin(requests).pipe(map((products) => CartAdapter.fromAPI(cart, products)));
  }

  clearCart() {
    const cart = this.getCartStorage();
    const clearCart: ICartProduct = {
      ...cart,
      products: [],
    };
    this._cart$.next(clearCart);
    if (this._auth.isLoggedIn()) this._cartapi.updateCart(CartAdapter.toAPI(clearCart));
  }
}

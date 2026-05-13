import { ICartItems, ICartProduct, ICartResponse } from '../interfaces/cart.interfaces';

export class CartAdapter {
  // API -> APP
  static fromAPI(cart: ICartResponse, products: ICartItems[]): ICartProduct {
    return {
      id: cart.id,
      userId: cart.userId,
      products: products,
    };
  }

  // APP -> API
  static toAPI(cart: ICartProduct): ICartResponse {
    return {
      id: cart.id,
      userId: cart.userId,
      products: cart.products.map((prod) => ({
        productId: prod.product.id,
        quantity: prod.quantity,
      })),
    };
  }
}

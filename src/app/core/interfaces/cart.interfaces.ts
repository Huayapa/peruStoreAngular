import { IProduct } from '../../shared/interfaces/product.interface';

export interface ICartResponse {
  id: number;
  userId: number;
  products: { productId: number; quantity: number }[];
}

export interface ICartProduct {
  id: number;
  userId: number;
  products: ICartItems[];
}

export interface ICartItems {
  product: IProduct;
  quantity: number;
}

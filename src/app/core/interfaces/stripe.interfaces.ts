import { ICartItems } from './cart.interfaces';

export interface IPaymentIntent {
  clientSecret: string;
  products: ICartItems[];
  price: number;
}

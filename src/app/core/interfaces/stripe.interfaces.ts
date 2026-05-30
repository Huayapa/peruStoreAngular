import { ICartItems } from './cart.interfaces';

export interface IPaymentIntent {
  clientSecret: string;
  sessionToken: string | null;
  products: ICartItems[];
  price: number;
}

import { TestBed } from '@angular/core/testing';
import { CartProductsService } from './cart-products';
import { ProductService } from '../product/product';
import { AuthService } from '../auth/auth';
import { CartApiService } from '../cart-api/cart-api';
import { ICartItems, ICartProduct, ICartResponse } from '../../interfaces/cart.interfaces';
import { firstValueFrom, of, throwError } from 'rxjs';
import { IProduct } from '../../../shared/interfaces/product.interface';

const mockProductService = {
  getProductId: jest.fn(),
};

const mockAuthService = {
  isLoggedIn: jest.fn(),
  getUserId: jest.fn(),
};

const mockCartAPIService = {
  addNewCart: jest.fn().mockReturnValue(of({})),
  updateCart: jest.fn().mockReturnValue(of({})),
  getCart: jest.fn().mockReturnValue(of({})),
};

describe('CartProductsService', () => {
  let service: CartProductsService;
  const mockProduct: IProduct = {
    id: 1,
    title: '',
    image: '',
    description: '',
    category: '',
    price: 20,
  };
  const mockCart: ICartProduct = {
    id: 1,
    userId: 1,
    products: [{ product: mockProduct, quantity: 1 }],
  };
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        CartProductsService,
        { provide: ProductService, useValue: mockProductService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: CartApiService, useValue: mockCartAPIService },
      ],
    });
    service = TestBed.inject(CartProductsService);
  });

  describe('Cart Observables', () => {
    it('cartproduct$ should emit current cart', async () => {
      service['_cart$'].next(mockCart);
      const cart = await firstValueFrom(service.cartproduct$);

      expect(cart).toEqual(mockCart);
    });
    it('totalPrice$ should calculate the total price of the cart', async () => {
      const mockCartProducts: ICartProduct = {
        id: 0,
        userId: 0,
        products: [
          { product: { id: 1, price: 10 } as IProduct, quantity: 4 },
          { product: { id: 1, price: 10 } as IProduct, quantity: 2 },
        ],
      };

      service['_cart$'].next(mockCartProducts);
      const totalPrice = await firstValueFrom(service.totalPrice$);

      expect(totalPrice).toBe(60);
    });
    it('totalItem$ should calculate the total products in the cart', async () => {
      const mockCartProducts: ICartProduct = {
        id: 0,
        userId: 0,
        products: [
          { product: {} as IProduct, quantity: 4 },
          { product: {} as IProduct, quantity: 2 },
          { product: {} as IProduct, quantity: 7 },
        ],
      };

      service['_cart$'].next(mockCartProducts);
      const totalItem = await firstValueFrom(service.totalItem$);

      expect(totalItem).toBe(13);
    });
  });
  describe('addProductToCart', () => {
    it('should not call the API if the user is not logged in', () => {
      mockAuthService.isLoggedIn.mockReturnValue(false);
      service.addProductToCart(mockProduct);
      expect(mockCartAPIService.addNewCart).not.toHaveBeenCalled();
      expect(mockCartAPIService.updateCart).not.toHaveBeenCalled();
    });
    describe('Añadir producto', () => {
      it('should emit the new cart with the added product', async () => {
        service.addProductToCart(mockProduct);

        const cart = await firstValueFrom(service.cartproduct$);
        expect(cart.products.length).toBe(1);
        expect(cart.products[0].product).toEqual(mockProduct);
        expect(cart.products[0].quantity).toBe(1);
      });
      it('should update localstorage when adding a product', () => {
        service.addProductToCart(mockProduct);

        const stored: ICartProduct = JSON.parse(localStorage.getItem(service['cartstorage'])!);
        expect(stored.products.length).toBe(1);
        expect(stored.products[0].product.id).toBe(1);
      });
      it('should add the cart by API cart if the user is valid', () => {
        mockAuthService.isLoggedIn.mockReturnValue(true);
        service.addProductToCart(mockProduct);
        expect(mockCartAPIService.addNewCart).toHaveBeenCalled();
        expect(mockCartAPIService.updateCart).not.toHaveBeenCalled();
      });
    });
    describe('update product', () => {
      it('should emit the cart with the updated product', async () => {
        service.addProductToCart(mockProduct);
        service.addProductToCart(mockProduct);
        const cart = await firstValueFrom(service.cartproduct$);
        expect(cart.products.length).toBe(1);
        expect(cart.products[0].quantity).toBe(2);
      });
      it('should update localstorage with the updated product', () => {
        service.addProductToCart(mockProduct);
        service.addProductToCart(mockProduct);
        const stored: ICartProduct = JSON.parse(localStorage.getItem(service['cartstorage'])!);
        expect(stored.products.length).toBe(1);
        expect(stored.products[0].quantity).toBe(2);
      });
      it('should update the cart by API', () => {
        const mockCart: ICartProduct = { id: 1, userId: 1, products: [] };
        mockAuthService.isLoggedIn.mockReturnValue(true);
        localStorage.setItem(service['cartstorage'], JSON.stringify(mockCart));
        service.addProductToCart(mockProduct);
        expect(mockCartAPIService.addNewCart).not.toHaveBeenCalled();
        expect(mockCartAPIService.updateCart).toHaveBeenCalled();
      });
    });
    it('should emit the previous cart on API error', async () => {
      const cartBefore = await firstValueFrom(service.cartproduct$);
      mockAuthService.isLoggedIn.mockReturnValue(true);
      mockCartAPIService.addNewCart.mockReturnValueOnce(
        throwError(() => new Error('Ocurrio un problema')),
      );

      service.addProductToCart(mockProduct);
      const cartAfter = await firstValueFrom(service.cartproduct$);
      expect(cartAfter).toEqual(cartBefore);
    });
  });
  describe('updateStock', () => {
    beforeEach(() => {
      localStorage.setItem(service['cartstorage'], JSON.stringify(mockCart));
    });
    it('should not update the stock when the stock is less than 1', () => {
      const spy = jest.spyOn(service, 'getCartStorage');
      service.updateStock(1, 0);
      expect(spy).not.toHaveBeenCalled();
    });
    it('should not call the API when the stock is less than 1', () => {
      service.updateStock(1, 0);
      expect(mockCartAPIService.updateCart).not.toHaveBeenCalled();
    });
    it('should update the cart correctly by localStorage', () => {
      service.updateStock(1, 2);
      const cart: ICartProduct = JSON.parse(localStorage.getItem(service['cartstorage'])!);
      expect(cart.products.length).toBe(1);
      expect(cart.products[0].product.id).toBe(1);
      expect(cart.products[0].quantity).toBe(2);
    });
    it('should emit the cart when updated successfully', async () => {
      service.updateStock(1, 2);
      const stored = await firstValueFrom(service.cartproduct$);
      expect(stored.products.length).toBe(1);
      expect(stored.products[0].product.id).toBe(1);
      expect(stored.products[0].quantity).toBe(2);
    });
    it('should not call the API if the user is not autenticated', () => {
      mockAuthService.isLoggedIn.mockReturnValue(false);
      service.updateStock(1, 2);
      expect(mockCartAPIService.updateCart).not.toHaveBeenCalled();
    });
    it('should update the API cart if the user is logged in', async () => {
      mockAuthService.isLoggedIn.mockReturnValue(true);
      service.updateStock(1, 2);
      const stored = await firstValueFrom(service.cartproduct$);
      expect(mockCartAPIService.updateCart).toHaveBeenCalled();
      expect(stored.products[0].quantity).toBe(2);
    });
  });
  describe('removeProductToCart', () => {
    beforeEach(() => {
      localStorage.setItem(service['cartstorage'], JSON.stringify(mockCart));
    });
    it('should remove the assigned product', async () => {
      service.removeProductToCart(mockProduct);

      const cart = await firstValueFrom(service.cartproduct$);
      expect(cart.products.length).toBe(0);
    });
    it('should not modify the cart if the product does not exist', async () => {
      const mockCartNotExists: IProduct = { ...mockProduct, id: 64 };

      service.removeProductToCart(mockCartNotExists);
      const cart = await firstValueFrom(service.cartproduct$);
      expect(cart.products.length).toBe(1);
      expect(cart.products[0].product.id).toBe(mockProduct.id);
    });
    it('should not call the API if the user is not logged in', () => {
      mockAuthService.isLoggedIn.mockReturnValue(false);
      service.removeProductToCart(mockProduct);
      expect(mockCartAPIService.updateCart).not.toHaveBeenCalled();
    });
    it('should update the API cart if the user is logged in', () => {
      mockAuthService.isLoggedIn.mockReturnValue(true);
      service.removeProductToCart(mockProduct);
      expect(mockCartAPIService.updateCart).toHaveBeenCalled();
    });
  });
  describe('updateCartItems', () => {
    const mockprodItems: ICartItems[] = [
      { product: mockProduct, quantity: 2 },
      { product: { ...mockProduct, id: 2 }, quantity: 5 },
      { product: { ...mockProduct, id: 3 }, quantity: 3 },
      { product: { ...mockProduct, id: 4 }, quantity: 5 },
    ];
    it('should emit the cart with the updated products', async () => {
      service.updateCartItems(mockprodItems);
      const cart = await firstValueFrom(service.cartproduct$);
      expect(cart.products).toEqual(mockprodItems);
    });
    it('should not emit or call the API if the cart has not changed', () => {
      const mockCart: ICartProduct = {
        id: 1,
        userId: 1,
        products: [{ product: mockProduct, quantity: 1 }],
      };
      localStorage.setItem(service['cartstorage'], JSON.stringify(mockCart));

      const emissionList: ICartProduct[] = [];
      service.cartproduct$.subscribe((cart) => emissionList.push(cart));
      const emissionBefore = emissionList.length;
      service.updateCartItems(mockCart.products);

      expect(emissionList.length).toBe(emissionBefore);
      expect(mockCartAPIService.updateCart).not.toHaveBeenCalled();
    });
    it('should not call the API if the user is not autenticated', () => {
      mockAuthService.isLoggedIn.mockReturnValue(false);
      service.updateCartItems(mockprodItems);
      expect(mockCartAPIService.updateCart).not.toHaveBeenCalled();
    });
    it('should call the API if the user is autenticated', () => {
      mockAuthService.isLoggedIn.mockReturnValue(true);
      service.updateCartItems(mockprodItems);
      expect(mockCartAPIService.updateCart).toHaveBeenCalled();
    });
  });
  describe('getCartStorage', () => {
    it('should return the cart from storage', () => {
      localStorage.setItem(service['cartstorage'], JSON.stringify(mockCart));
      const cart = service.getCartStorage();
      expect(cart).toEqual(mockCart);
    });
    it('should create the cart if it does not exist and user is not logged in', () => {
      const cart = service.getCartStorage();
      expect(cart).toEqual({ id: 0, userId: 0, products: [] });
    });
    it('should create the cart if it does not exist and user is logged in', () => {
      localStorage.removeItem(service['cartstorage']);
      mockAuthService.getUserId.mockReturnValue(43);
      const cart = service.getCartStorage();
      expect(cart).toEqual({ id: 0, userId: 43, products: [] });
    });
  });
  describe('loadUserCart', () => {
    it('should not call the API if the userId is invalid or zero', () => {
      mockAuthService.getUserId.mockReturnValue(0);
      service.loadUserCart();
      expect(mockCartAPIService.getCart).not.toHaveBeenCalled();
    });
    it('should emit the resolved cart if the userId is valid', async () => {
      const mockCartResponse: ICartResponse = {
        id: 1,
        userId: 1,
        products: [{ productId: 1, quantity: 1 }],
      };
      mockAuthService.getUserId.mockReturnValue(1);
      mockCartAPIService.getCart.mockReturnValue(of(mockCartResponse));
      mockProductService.getProductId.mockReturnValue(of(mockProduct));
      service.loadUserCart();
      const cart = await firstValueFrom(service.cartproduct$);
      expect(cart).toEqual(mockCart);
    });
    it('should not emit if the API returns null', async () => {
      localStorage.setItem(service['cartstorage'], JSON.stringify(mockCart));
      const cartBefore = await firstValueFrom(service.cartproduct$);
      mockAuthService.getUserId.mockReturnValue(1);
      mockCartAPIService.getCart.mockReturnValue(of(null));
      service.loadUserCart();
      const cartAfter = await firstValueFrom(service.cartproduct$);
      expect(cartAfter).toEqual(cartBefore);
    });
  });
  describe('clearCart', () => {
    beforeEach(() => {
      localStorage.setItem(service['cartstorage'], JSON.stringify(mockCart));
    });
    it('should emit the cart with no products', async () => {
      service.clearCart();
      const cart = await firstValueFrom(service.cartproduct$);
      expect(cart.products.length).toBe(0);
    });
    it('should not update the cart api if the user is not logged in', () => {
      mockAuthService.isLoggedIn.mockReturnValue(false);
      service.clearCart();
      expect(mockCartAPIService.updateCart).not.toHaveBeenCalled();
    });
    it('should update the API cart if the user is logged in', () => {
      mockAuthService.isLoggedIn.mockReturnValue(true);
      service.clearCart();
      expect(mockCartAPIService.updateCart).toHaveBeenCalled();
    });
  });
});

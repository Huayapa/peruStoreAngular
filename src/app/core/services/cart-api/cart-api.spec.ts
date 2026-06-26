import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CartApiService } from './cart-api';
import { firstValueFrom } from 'rxjs';
import { ICartResponse } from '../../interfaces/cart.interfaces';
import { SKIP_SESSION } from '../../interceptors/checkout-session-interceptor/checkout-session-interceptor';

describe('Cart API Service', () => {
  let service: CartApiService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), CartApiService],
    });
    service = TestBed.inject(CartApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  describe('getAllCarts', () => {
    const mockResponse: ICartResponse[] = [
      { id: 1, userId: 1, products: [{ productId: 33, quantity: 3 }] },
      { id: 2, userId: 1, products: [{ productId: 76, quantity: 2 }] },
    ];

    it('should return only one cart when there are duplicate carts by userId', async () => {
      const promise = firstValueFrom(service.getAllCarts());
      const req = httpMock.expectOne({ url: `${service['apiUrl']}carts`, method: 'GET' });
      req.flush(mockResponse);

      expect((await promise).length).toBe(1);
    });
    it('should keep the last cart when there are duplicate carts by userId', async () => {
      const promise = firstValueFrom(service.getAllCarts());
      const req = httpMock.expectOne({ url: `${service['apiUrl']}carts`, method: 'GET' });
      req.flush(mockResponse);

      expect((await promise)[0].id).toBe(2);
    });
    it('should have SKIP_SESSION enabled', () => {
      service.getAllCarts().subscribe();
      const req = httpMock.expectOne({ url: `${service['apiUrl']}carts`, method: 'GET' });
      req.flush(mockResponse);

      expect(req.request.context.get(SKIP_SESSION)).toBe(true);
    });
    it('should have the method GET', () => {
      service.getAllCarts().subscribe();
      const req = httpMock.expectOne({ url: `${service['apiUrl']}carts`, method: 'GET' });
      req.flush(mockResponse);

      expect(req.request.method).toBe('GET');
    });
    it('should propagate the error when the request fails', async () => {
      const errorstatus = { status: 500, statusText: 'Server Error' };

      const promise = firstValueFrom(service.getAllCarts());
      const req = httpMock.expectOne({ url: `${service['apiUrl']}carts`, method: 'GET' });
      req.flush(null, errorstatus);

      await expect(promise).rejects.toMatchObject({ status: 500 });
    });
  });

  describe('getCart', () => {
    const mockResponse = [
      { id: 1, userId: 1, products: [{ productId: 33, quantity: 3 }] },
      { id: 2, userId: 1, products: [{ productId: 76, quantity: 2 }] },
      { id: 3, userId: 2, products: [{ productId: 26, quantity: 1 }] },
    ];

    it('should return user cart', async () => {
      const promise = firstValueFrom(service.getCart(1));
      const req = httpMock.expectOne({ url: `${service['apiUrl']}carts`, method: 'GET' });
      req.flush(mockResponse);

      expect((await promise)?.userId).toEqual(1);
    });
    it('should have the context SKIPSESSION true', () => {
      service.getCart(1).subscribe();
      const req = httpMock.expectOne({ url: `${service['apiUrl']}carts`, method: 'GET' });
      req.flush(mockResponse);

      expect(req.request.context.get(SKIP_SESSION)).toBe(true);
    });
    it('should have the method GET', () => {
      service.getCart(1).subscribe();
      const req = httpMock.expectOne({ url: `${service['apiUrl']}carts`, method: 'GET' });
      req.flush(mockResponse);

      expect(req.request.method).toBe('GET');
    });
    it('should return null when the user cart does not exist', async () => {
      const promise = firstValueFrom(service.getCart(99));
      const req = httpMock.expectOne({ url: `${service['apiUrl']}carts`, method: 'GET' });
      req.flush(mockResponse);

      expect(await promise).toBeNull();
    });
    it('should propagate the error when the request fails', async () => {
      const errorstatus = { status: 500, statusText: 'Server Error' };
      const promise = firstValueFrom(service.getCart(1));
      const req = httpMock.expectOne({ url: `${service['apiUrl']}carts`, method: 'GET' });
      req.flush(null, errorstatus);

      await expect(promise).rejects.toMatchObject({ status: 500 });
    });
  });

  describe('addNewCart', () => {
    const newCart: ICartResponse = {
      id: 1,
      userId: 4,
      products: [{ productId: 42, quantity: 4 }],
    };

    it('should add the cart successfully', async () => {
      const promise = firstValueFrom(service.addNewCart(newCart));
      const req = httpMock.expectOne({ url: `${service['apiUrl']}carts`, method: 'POST' });
      req.flush(newCart);

      expect(await promise).toEqual(newCart);
    });
    it('should send the correct cart data in the body', async () => {
      service.addNewCart(newCart).subscribe();
      const req = httpMock.expectOne({ url: `${service['apiUrl']}carts`, method: 'POST' });
      req.flush(newCart);

      expect(req.request.body).toEqual(newCart);
    });
    it('should have the context SKIPSESSION true', () => {
      service.addNewCart(newCart).subscribe();
      const req = httpMock.expectOne({ url: `${service['apiUrl']}carts`, method: 'POST' });
      req.flush(newCart);

      expect(req.request.context.get(SKIP_SESSION)).toBe(true);
    });
    it('should have the method POST', () => {
      service.addNewCart(newCart).subscribe();
      const res = httpMock.expectOne({ url: `${service['apiUrl']}carts`, method: 'POST' });
      res.flush(newCart);

      expect(res.request.method).toBe('POST');
    });
    it('should propate the error when the request fails', async () => {
      const errorstatus = { status: 500, statusText: 'Server Error' };

      const promise = firstValueFrom(service.addNewCart(newCart));
      const res = httpMock.expectOne({ url: `${service['apiUrl']}carts`, method: 'POST' });
      res.flush(null, errorstatus);

      await expect(promise).rejects.toMatchObject({ status: 500 });
    });
  });

  describe('updateCart', () => {
    const mockCart: ICartResponse = {
      id: 1,
      userId: 4,
      products: [{ productId: 42, quantity: 4 }],
    };
    it('should update the current cart successfully', async () => {
      const promise = firstValueFrom(service.updateCart(mockCart));
      const req = httpMock.expectOne({
        url: `${service['apiUrl']}carts/${mockCart.userId}`,
        method: 'PUT',
      });
      req.flush(mockCart);

      expect(await promise).toEqual(mockCart);
    });
    it('should send the correct cart in the body', async () => {
      service.updateCart(mockCart).subscribe();
      const req = httpMock.expectOne({
        url: `${service['apiUrl']}carts/${mockCart.userId}`,
        method: 'PUT',
      });
      req.flush(mockCart);

      expect(req.request.body).toEqual(mockCart);
    });
    it('should have the context SKIPSESSION true', () => {
      service.updateCart(mockCart).subscribe();
      const req = httpMock.expectOne({
        url: `${service['apiUrl']}carts/${mockCart.userId}`,
        method: 'PUT',
      });
      req.flush(mockCart);

      expect(req.request.context.get(SKIP_SESSION)).toBe(true);
    });
    it('should have the method PUT', () => {
      service.updateCart(mockCart).subscribe();
      const req = httpMock.expectOne({
        url: `${service['apiUrl']}carts/${mockCart.userId}`,
        method: 'PUT',
      });
      req.flush(mockCart);

      expect(req.request.method).toBe('PUT');
    });
    it('should propagate the error when the request fails', async () => {
      const errorstatus = { status: 500, statusText: 'Server Invalid' };

      const promise = firstValueFrom(service.updateCart(mockCart));
      const req = httpMock.expectOne({
        url: `${service['apiUrl']}carts/${mockCart.userId}`,
        method: 'PUT',
      });
      req.flush(null, errorstatus);

      await expect(promise).rejects.toMatchObject({ status: 500 });
    });
  });
});

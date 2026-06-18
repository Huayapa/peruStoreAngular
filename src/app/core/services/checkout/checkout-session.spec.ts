import { TestBed } from '@angular/core/testing';
import { CheckoutSessionService } from './checkout-session';

describe('Checkout Session', () => {
  let service: CheckoutSessionService;
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [CheckoutSessionService],
    });
    service = TestBed.inject(CheckoutSessionService);
  });

  describe('getToken', () => {
    it('deberia retornar la session token', () => {
      service.setToken('token_valid');
      expect(service.getToken()).toEqual('token_valid');
    });

    it('deberia retornar null si no existe la session token', () => {
      expect(service.getToken()).toEqual(null);
    });
  });

  describe('setToken', () => {
    it('deberia agregar la session token correctamente', () => {
      service.setToken('token_valid');
      expect(service.getToken()).toEqual('token_valid');
    });
  });

  describe('removeToken', () => {
    it('deberia remover el session token', () => {
      service.setToken('token_valid');
      service.removeToken();
      expect(service.getToken()).toEqual(null);
    });
  });
});

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
    it('should return session token', () => {
      service.setToken('token_valid');
      expect(service.getToken()).toEqual('token_valid');
    });

    it('should return null if session token not exists', () => {
      expect(service.getToken()).toEqual(null);
    });
  });

  describe('setToken', () => {
    it('should add the session token succeded', () => {
      service.setToken('token_valid');
      expect(service.getToken()).toEqual('token_valid');
    });
  });

  describe('removeToken', () => {
    it('should remove session token', () => {
      service.setToken('token_valid');
      service.removeToken();
      expect(service.getToken()).toEqual(null);
    });
  });
});

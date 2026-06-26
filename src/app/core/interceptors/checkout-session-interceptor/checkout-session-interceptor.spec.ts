import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { checkoutSessionInterceptorFn, SKIP_SESSION } from './checkout-session-interceptor';
import { CheckoutSessionService } from '../../services/checkout/checkout-session';

describe('checkoutSessionInterceptorFn', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  const mockCheckoutSession = {
    getToken: jest.fn(),
  };
  beforeEach(() => {
    mockCheckoutSession.getToken.mockClear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([checkoutSessionInterceptorFn])),
        provideHttpClientTesting(),
        { provide: CheckoutSessionService, useValue: mockCheckoutSession },
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => httpTestingController.verify());
  it('should bypass checkout session if SKIP_SESSION is not set', () => {
    httpClient.get('/testendpoint').subscribe();
    const req = httpTestingController.expectOne('/testendpoint');
    expect(req.request.headers.has('x-session-token')).toBe(false);
    req.flush({});
  });
  it('should bypass checkout session if SKIP_SESSION is true', () => {
    const context = { context: new HttpContext().set(SKIP_SESSION, true) };
    httpClient.get('/testendpoint', context).subscribe();
    const req = httpTestingController.expectOne('/testendpoint');
    expect(req.request.headers.has('x-session-token')).toBe(false);
    req.flush({});
  });
  it('should bypass checkout session when session token is null', () => {
    mockCheckoutSession.getToken.mockReturnValue(null);
    const context = { context: new HttpContext().set(SKIP_SESSION, false) };
    httpClient.get('/testendpoint', context).subscribe();
    const req = httpTestingController.expectOne('/testendpoint');
    expect(req.request.headers.has('x-session-token')).toBe(false);
    req.flush({});
  });
  it('should add x-session-token header when token exists and SKIP_SESSION is false', () => {
    const sessiontoken = 'test_sessiontoken';
    const context = { context: new HttpContext().set(SKIP_SESSION, false) };
    mockCheckoutSession.getToken.mockReturnValue(sessiontoken);
    httpClient.get('/testendpoint', context).subscribe();
    const req = httpTestingController.expectOne('/testendpoint');
    expect(req.request.headers.get('x-session-token')).toBe(sessiontoken);
    req.flush({ success: true });
  });
  it('should add x-session-token header when token exists and SKIP_SESSION is not set', () => {
    const sessiontoken = 'test_sessiontoken';
    mockCheckoutSession.getToken.mockReturnValue(sessiontoken);
    httpClient.get('/testendpoint').subscribe();
    const req = httpTestingController.expectOne('/testendpoint');
    expect(req.request.headers.get('x-session-token')).toBe(sessiontoken);
    req.flush({ success: true });
  });
});

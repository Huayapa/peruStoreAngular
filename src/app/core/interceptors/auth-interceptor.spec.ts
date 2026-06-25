import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { authInterceptorFn, SKIP_AUTH } from './auth-interceptor';
import { AuthService } from '../services/auth/auth';

describe('authInterceptorFn', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  const mockAuthService = {
    getToken: jest.fn(),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptorFn])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
  it('should not add headers when the context SKIP AUTH is true', () => {
    mockAuthService.getToken.mockReturnValue({ token: 'testing_token' });
    httpClient
      .get('/mockendpoint', {
        context: new HttpContext().set(SKIP_AUTH, true),
      })
      .subscribe();

    const req = httpTestingController.expectOne('/mockendpoint');
    expect(req.request.headers.get('Authorization')).toBeNull();
  });
  it('should not add headers when the token not exists', () => {
    mockAuthService.getToken.mockReturnValue(null);
    httpClient.get('/mockendpoint').subscribe();

    const req = httpTestingController.expectOne('/mockendpoint');
    expect(req.request.headers.get('Authorization')).toBeNull();
  });
  it('should add header Authorization when SKIP AUTH is false and token exists', () => {
    mockAuthService.getToken.mockReturnValue({ token: 'testing_token' });
    httpClient.get('/mockendpoint').subscribe();

    const req = httpTestingController.expectOne('/mockendpoint');
    expect(req.request.headers.get('Authorization')).toEqual('testing_token');
  });
});

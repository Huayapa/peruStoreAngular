import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { cache, cacheInterceptorFn, HANDLE_CACHE_INTERCEPTOR, TTL_MS } from './cache-interceptor';

describe('cacheInterceptorFn', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([cacheInterceptorFn])),
        provideHttpClientTesting(),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    jest.useFakeTimers();
    cache.clear();
  });
  afterEach(() => {
    httpTestingController.verify();
    jest.useRealTimers();
  });
  it('should bypass cache when method is not GET', () => {
    const context = { context: new HttpContext().set(HANDLE_CACHE_INTERCEPTOR, true) };

    httpClient.post('/mockendpoint', {}, context).subscribe();
    const req1 = httpTestingController.expectOne('/mockendpoint');
    expect(req1.request.method).toBe('POST');
    req1.flush({});

    httpClient.post('/mockendpoint', {}, context).subscribe();
    const req2 = httpTestingController.expectOne('/mockendpoint');
    expect(req2.request.method).toBe('POST');
    req2.flush({});
  });
  it('should bypass cache when HANDLE_CACHE_INTERCEPTOR is false', () => {
    const context = { context: new HttpContext().set(HANDLE_CACHE_INTERCEPTOR, false) };

    httpClient.get('/mockendpoint', context).subscribe();
    const req1 = httpTestingController.expectOne('/mockendpoint');
    expect(req1.request.method).toBe('GET');
    req1.flush({});

    httpClient.get('/mockendpoint', context).subscribe();
    const req2 = httpTestingController.expectOne('/mockendpoint');
    expect(req2.request.method).toBe('GET');
    req2.flush({});
  });
  it('should bypass cache when HANDLE_CACHE_INTERCEPTOR is not set', () => {
    httpClient.get('/mockendpoint').subscribe();
    const req = httpTestingController.expectOne('/mockendpoint');
    expect(req.request.method).toBe('GET');
    req.flush({});

    httpClient.get('/mockendpoint').subscribe();
    httpTestingController.expectOne('/mockendpoint').flush({});
  });
  it('should save response in cache on first request', () => {
    const context = { context: new HttpContext().set(HANDLE_CACHE_INTERCEPTOR, true) };
    const mockResponse = { data: 'response' };

    httpClient.get('/mockendpoint', context).subscribe();
    httpTestingController.expectOne('/mockendpoint').flush(mockResponse);

    let cachedResponse: unknown;
    httpClient.get('/mockendpoint', context).subscribe((req) => (cachedResponse = req));
    httpTestingController.expectNone('/mockendpoint');
    expect(cachedResponse).toEqual(mockResponse);
  });
  it('should make a new request when cache has expired', () => {
    const context = { context: new HttpContext().set(HANDLE_CACHE_INTERCEPTOR, true) };
    const mockResponse = { data: 'response' };

    httpClient.get('/mockendpoint', context).subscribe();
    httpTestingController.expectOne('/mockendpoint').flush(mockResponse);

    jest.advanceTimersByTime(TTL_MS + 1);

    let response: unknown;
    httpClient.get('/mockendpoint', context).subscribe((req) => (response = req));
    httpTestingController.expectOne('/mockendpoint').flush(
      { data: 'new response' },
      {
        status: 200,
        statusText: 'OK',
      },
    );
    expect(response).toEqual({ data: 'new response' });
  });
});

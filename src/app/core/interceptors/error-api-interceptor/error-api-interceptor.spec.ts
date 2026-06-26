import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { errorApiInterceptorFn, HANDLE_HTTP_INTERCEPTOR } from './error-api-interceptor';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('errorApiInterceptorFn', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  const mockSnackBar = {
    open: jest.fn(),
  };
  beforeEach(() => {
    mockSnackBar.open.mockClear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorApiInterceptorFn])),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });
  afterEach(() => httpTestingController.verify());
  it('should bypass errorAPI if HANDLE_HTTP_INTERCEPTOR is not set', () => {
    const errorStatus = { status: 500, statusText: 'Server Error' };

    httpClient.get('/testendpoint').subscribe();
    httpTestingController.expectOne('/testendpoint').flush(null, errorStatus);

    expect(mockSnackBar.open).not.toHaveBeenCalled();
  });
  it('should bypass errorAPI if HANDLE_HTTP_INTERCEPTOR is false', () => {
    const context = { context: new HttpContext().set(HANDLE_HTTP_INTERCEPTOR, false) };
    const errorStatus = { status: 500, statusText: 'Server Error' };

    httpClient.get('/testendpoint', context).subscribe();
    httpTestingController.expectOne('/testendpoint').flush(null, errorStatus);

    expect(mockSnackBar.open).not.toHaveBeenCalled();
  });
  it('should open snackbar when propagate error', () => {
    const context = { context: new HttpContext().set(HANDLE_HTTP_INTERCEPTOR, true) };
    const errorStatus = { status: 500, statusText: 'Server Error' };

    httpClient.get('/testendpoint', context).subscribe();
    httpTestingController.expectOne('/testendpoint').flush(null, errorStatus);

    expect(mockSnackBar.open).toHaveBeenCalled();
  });
  it('should not open snackbar if not error http', () => {
    const context = { context: new HttpContext().set(HANDLE_HTTP_INTERCEPTOR, true) };

    httpClient.get('/testendpoint', context).subscribe();
    httpTestingController.expectOne('/testendpoint').flush({ data: 'response' });

    expect(mockSnackBar.open).not.toHaveBeenCalled();
  });
  describe('messageStatus', () => {
    it.each([
      [401, 'No autorizado'],
      [403, 'Acceso denegado'],
      [404, 'Recurso no encontrado'],
      [500, 'Error interno del servidor'],
      [418, 'Ha ocurrido un error inesperado'],
    ])('should show correct message for status %i', (status, message) => {
      const context = { context: new HttpContext().set(HANDLE_HTTP_INTERCEPTOR, true) };

      httpClient.get('/testendpoint', context).subscribe();
      httpTestingController.expectOne('/testendpoint').flush(null, { status, statusText: 'error' });

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'Cerrar', expect.anything());
    });
  });
});

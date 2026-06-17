import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';
import {
  provideHttpClientTesting,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { IAuthStorage, IRegisterResponse } from '../../interfaces/auth.interfaces';
import { firstValueFrom } from 'rxjs';
import { HANDLE_HTTP_INTERCEPTOR } from '../../interceptors/error-api-interceptor';
import { SKIP_AUTH } from '../../interceptors/auth-interceptor';
import { SKIP_SESSION } from '../../interceptors/checkout-session-interceptor';
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode');

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const mockedJwtDecode = jwtDecode as jest.MockedFunction<typeof jwtDecode>;
  const setToken = (token: string) =>
    localStorage.setItem(service['tokenstorage'], JSON.stringify({ token }));
  const setTokenInvalid = () => localStorage.setItem(service['tokenstorage'], 'token_invalid');

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.restoreAllMocks();
  });

  describe('getUserName', () => {
    it('should return the username if the token is valid', () => {
      setToken('testing_jwt');
      mockedJwtDecode.mockReturnValue({ user: 'test_user' });
      expect(service.getUserName()).toBe('test_user');
    });
    it('should return string empty if the token not exist', () => {
      expect(service.getUserName()).toBe('');
    });
    it('should return string empty if JSON invalid', () => {
      setTokenInvalid();
      expect(service.getUserName()).toBe('');
    });
    it('should return string empty if error jwtDeCode', () => {
      setToken('no-valid');
      mockedJwtDecode.mockImplementation(() => {
        throw new Error('Invalid Token');
      });
      expect(service.getUserName()).toBe('');
    });
  });

  describe('getUserId', () => {
    it('should return number id if token is valid', () => {
      setToken('testing_jwt');
      mockedJwtDecode.mockReturnValue({ sub: 12 });
      expect(service.getUserId()).toBe(12);
    });
    it('should return 0 if token is invalid', () => {
      setTokenInvalid();
      expect(service.getUserId()).toBe(0);
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if token is saved', () => {
      setToken('testing_jwt');
      expect(service.isLoggedIn()).toBe(true);
    });
    it('should return false if token not exits', () => {
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('saveToken', () => {
    it('should save token on the localstorage', () => {
      service.saveToken('testing_jwt');
      const storage = JSON.parse(localStorage.getItem(service['tokenstorage']) ?? '{}');
      expect(storage.token).toBe('testing_jwt');
    });
    it('should emit new username in isLogged', async () => {
      mockedJwtDecode.mockReturnValue({ user: 'testing_jwt' });
      service.saveToken('testing_jwt');
      const emitted = await firstValueFrom(service.isLogged$);
      expect(emitted).toBe('testing_jwt');
    });
  });

  describe('getToken', () => {
    it('should return data storage is token exists', () => {
      setToken('testing_jwt');
      expect(service.getToken()).toStrictEqual({ token: 'testing_jwt' });
    });
    it('should return null if token not exits', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('logout', () => {
    it('should remove token', () => {
      setToken('testing_jwt');
      service.logout();
      expect(service.getToken()).toBeNull();
    });
    it('should emit logged empty', async () => {
      service.logout();
      const emitted = await firstValueFrom(service.isLogged$);
      expect(emitted).toBe('');
    });
  });

  describe('login', () => {
    let mockResponse: IAuthStorage;
    let loginPromise: Promise<IAuthStorage>;
    let req: TestRequest;
    beforeEach(() => {
      mockResponse = { token: 'test_token' };
      loginPromise = firstValueFrom(
        service.login({
          username: 'test_usuario',
          password: 'test_12345678',
        }),
      );

      req = httpMock.expectOne({
        url: `${service['apiurl']}auth/login`,
        method: 'POST',
      });
    });
    it('should set HANDLE_HTTP_INTERCEPTOR, SKIP_AUTH and SKIP_SESSION contexts', () => {
      expect(req.request.context.get(HANDLE_HTTP_INTERCEPTOR)).toBe(true);
      expect(req.request.context.get(SKIP_AUTH)).toBe(true);
      expect(req.request.context.get(SKIP_SESSION)).toBe(true);
      req.flush(mockResponse);
    });
    it('should resolve with the login response', async () => {
      req.flush(mockResponse);
      expect(await loginPromise).toEqual(mockResponse);
    });
    it('should save token if login is succeeds', async () => {
      req.flush(mockResponse);
      await loginPromise;
      expect(service.getToken()).toStrictEqual(mockResponse);
    });
  });

  describe('register', () => {
    it('should register user', async () => {
      const mockResponse: IRegisterResponse = { id: 0 };
      const registerPromise = firstValueFrom(
        service.register({
          username: 'test_usuario',
          password: 'test_12345678',
          email: 'test_email@gmail.com',
        }),
      );

      const req = httpMock.expectOne({
        url: `${service['apiurl']}users`,
        method: 'POST',
      });

      req.flush(mockResponse);
      expect(await registerPromise).toEqual(mockResponse);
    });
  });
});

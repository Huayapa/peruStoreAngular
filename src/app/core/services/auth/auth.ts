import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SKIP_AUTH } from '../../interceptors/auth-interceptor/auth-interceptor';
import { SKIP_SESSION } from '../../interceptors/checkout-session-interceptor';
import { HANDLE_HTTP_INTERCEPTOR } from '../../interceptors/error-api-interceptor/error-api-interceptor';
import {
  IAuthRequest,
  IAuthStorage,
  IRegisterRequest,
  IRegisterResponse,
} from '../../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiurl = environment.apiUrl;
  private readonly tokenstorage = 'auth_store';
  private readonly opts = {
    context: new HttpContext()
      .set(HANDLE_HTTP_INTERCEPTOR, true)
      .set(SKIP_AUTH, true)
      .set(SKIP_SESSION, true),
  };

  private readonly _isLogged$ = new BehaviorSubject<string>(this.getUserName());
  isLogged$ = this._isLogged$.asObservable();

  private decodeToken<T>(): T | null {
    try {
      const data = localStorage.getItem(this.tokenstorage);
      if (!data) return null;
      const { token }: IAuthStorage = JSON.parse(data);
      return jwtDecode<T>(token);
    } catch {
      return null;
    }
  }

  getUserName(): string {
    return this.decodeToken<{ user: string }>()?.user ?? '';
  }

  getUserId(): number {
    return this.decodeToken<{ sub: number }>()?.sub ?? 0;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenstorage, JSON.stringify({ token }));
    this._isLogged$.next(this.getUserName());
  }

  getToken(): IAuthStorage | null {
    const data = localStorage.getItem(this.tokenstorage);
    return data ? JSON.parse(data) : null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenstorage);
    this._isLogged$.next('');
  }

  login(user: IAuthRequest): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.apiurl}auth/login`, user, this.opts)
      .pipe(tap((value) => this.saveToken(value.token)));
  }

  register(newuser: IRegisterRequest): Observable<IRegisterResponse> {
    return this.http.post<IRegisterResponse>(`${this.apiurl}users`, newuser);
  }
}

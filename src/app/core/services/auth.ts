import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import {
  IAuthStorage,
  IAuthRequest,
  IRegisterRequest,
  IRegisterResponse,
} from '../interfaces/auth.interfaces';
import { Observable, tap } from 'rxjs';
import { HANDLE_HTTP_INTERCEPTOR } from '../interceptors/error-api-interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiurl = environment.apiUrl;
  private readonly tokenstorage = 'auth_store';
  private readonly opts = { context: new HttpContext().set(HANDLE_HTTP_INTERCEPTOR, true) };

  saveToken(token: string): void {
    localStorage.setItem(this.tokenstorage, JSON.stringify({ token }));
  }

  getUserId(): number {
    const token = localStorage.getItem(this.tokenstorage);
    if (!token) return 0;
    return jwtDecode<{ sub: number }>(token).sub;
  }

  getToken(): IAuthStorage | null {
    const data = localStorage.getItem(this.tokenstorage);
    return data ? JSON.parse(data) : null;
  }

  removeToken() {
    localStorage.removeItem(this.tokenstorage);
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

import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IAuthStorage, ILoginRequest } from '../interfaces/auth.interfaces';
import { Observable, tap } from 'rxjs';
import { HANDLE_HTTP_INTERCEPTOR } from '../interceptors/error-api-interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiurl = environment.apiUrl;
  private readonly tokenstorage = 'auth_data';
  private readonly opts = { context: new HttpContext().set(HANDLE_HTTP_INTERCEPTOR, true) };

  saveAuthData(token: string, user: ILoginRequest): void {
    localStorage.setItem(this.tokenstorage, JSON.stringify({ token, user }));
  }

  getAuthData(): IAuthStorage | null {
    const data = localStorage.getItem(this.tokenstorage);
    return data ? JSON.parse(data) : null;
  }
  removeAuthData() {
    localStorage.removeItem(this.tokenstorage);
  }

  login(user: ILoginRequest): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.apiurl}auth/login`, user, this.opts)
      .pipe(tap((value) => this.saveAuthData(value.token, user)));
  }
}

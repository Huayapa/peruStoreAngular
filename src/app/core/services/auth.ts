import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IAuthStorage, ILoginRequest } from '../interfaces/auth.interfaces';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiurl = environment.apiUrl;
  private readonly tokenstorage = 'auth_data';

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
      .post<{ token: string }>(`${this.apiurl}auth/login`, user)
      .pipe(tap((value) => this.saveAuthData(value.token, user)));
  }
}

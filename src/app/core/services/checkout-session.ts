import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CheckoutSessionService {
  private readonly key = 'sessionToken';

  getToken(): string | null {
    return sessionStorage.getItem(this.key);
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.key, token);
  }

  removeToken() {
    sessionStorage.removeItem(this.key);
  }
}

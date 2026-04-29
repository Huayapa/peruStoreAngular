import { Injectable, signal } from '@angular/core';
type ISideActive = 'none' | 'sidecart' | 'sidebar';
@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  readonly sideActive = signal<ISideActive>('none');
  toogleSideCart() {
    this.sideActive.update((value) => (value !== 'sidecart' ? 'sidecart' : 'none'));
  }
  toogleSideBar() {
    this.sideActive.update((value) => (value !== 'sidebar' ? 'sidebar' : 'none'));
  }
  closeOverlay() {
    this.sideActive.set('none');
  }
}

import { Component, HostListener, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterModule } from '@angular/router';
import { APP_ROUTES } from '../../../core/constants/app-routes';
import { Sidebar } from '../sidebar/sidebar';
import { Sidecart } from '../sidecart/sidecart';
import { SidenavService } from '../../../core/services/sidenav';
import { SearchBar } from '../../components/search-bar/search-bar';
import { CartProductsService } from '../../../core/services/cart-products';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-navbar',
  imports: [
    MatIcon,
    MatIconButton,
    RouterLink,
    RouterModule,
    Sidebar,
    Sidecart,
    SearchBar,
    MatBadgeModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly _cartProduct = inject(CartProductsService);
  totalItem = signal(0);

  readonly APP_ROUTES = APP_ROUTES;
  readonly sidenav = inject(SidenavService);
  hideTop = false;

  constructor() {
    this._cartProduct.totalItem$.subscribe((total) => this.totalItem.set(total));
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.hideTop = window.scrollY > 200;
  }
}

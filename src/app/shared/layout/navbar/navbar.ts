import { Component, HostListener, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterModule } from '@angular/router';
import { APP_ROUTES } from '../../../core/constants/app-routes';
import { Sidebar } from '../sidebar/sidebar';
import { Sidecart } from '../sidecart/sidecart';
import { SidenavService } from '../../../core/services/sidenav';

@Component({
  selector: 'app-navbar',
  imports: [MatIcon, MatIconButton, RouterLink, RouterModule, Sidebar, Sidecart],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly APP_ROUTES = APP_ROUTES;
  readonly sidenav = inject(SidenavService);
  hideTop = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.hideTop = window.scrollY > 0;
  }
}

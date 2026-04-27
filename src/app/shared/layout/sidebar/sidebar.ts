import { Component, inject } from '@angular/core';
import { APP_ROUTES } from '../../../core/constants/app-routes';
import { RouterLink } from '@angular/router';
import { Sidenav } from '../../../core/services/sidenav';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, MatIcon, MatIconButton],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  readonly APP_ROUTES = APP_ROUTES;
  readonly sidenav = inject(Sidenav);
}

import { Component, inject } from '@angular/core';
import { SidenavService } from '../../../core/services/sidenav';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-sidecart',
  imports: [MatIcon, MatIconButton],
  templateUrl: './sidecart.html',
  styleUrl: './sidecart.scss',
})
export class Sidecart {
  readonly sidenav = inject(SidenavService);
}

import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  imports: [AsyncPipe, RouterLink, MatIcon, MatIconButton],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  private _breadcrumb = inject(BreadcrumbService);
  breadcrumbs$ = this._breadcrumb.breadcrumbs$;
}

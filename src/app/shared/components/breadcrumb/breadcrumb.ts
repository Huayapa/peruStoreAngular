import { Component, inject } from '@angular/core';
import { BreadcrumbService } from '../../../core/services/breadcrumb';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

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

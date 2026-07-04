import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb';
import { toSignal } from '@angular/core/rxjs-interop';
import { IBreadcrumb } from '../../../core/interfaces/breadcrumb.interface';

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink, MatIcon, MatIconButton],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  private _breadcrumb = inject(BreadcrumbService);
  readonly breadcrumbs = toSignal(this._breadcrumb.breadcrumbs$, {
    initialValue: [] as IBreadcrumb[],
  });
}

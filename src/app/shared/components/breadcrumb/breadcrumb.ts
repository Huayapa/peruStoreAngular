import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
export interface IBreadcrumb {
  label: string;
  url: string;
}
@Component({
  selector: 'app-breadcrumb',
  imports: [],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  private _route = inject(Router);
}

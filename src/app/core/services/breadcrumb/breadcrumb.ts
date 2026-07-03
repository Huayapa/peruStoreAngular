import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { IBreadcrumb } from '../../interfaces/breadcrumb.interface';
@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _breadcrumbs$ = new BehaviorSubject<IBreadcrumb[]>([]);
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor() {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => {
        const root = this._activatedRoute.root;
        const breadcrumbs = this.createBreadcrumbs(root);
        this._breadcrumbs$.next(breadcrumbs);
      });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: IBreadcrumb[] = [],
  ): IBreadcrumb[] {
    for (const child of route.children) {
      const segment = child.snapshot.url.map((s) => s.path).join('/');
      const currentUrl = segment ? `${url}/${segment}` : url;
      const label = child.snapshot.data['breadcrumb'];

      if (label && !breadcrumbs.some((b) => b.label === label)) {
        breadcrumbs.push({ label, url: currentUrl });
      }

      this.createBreadcrumbs(child, currentUrl, breadcrumbs);
    }
    return breadcrumbs;
  }
}

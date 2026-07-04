import { TestBed } from '@angular/core/testing';
import { BreadcrumbService } from './breadcrumb';
import { provideRouter, Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({ template: '' })
class DummyComponent {}

const mockRoutes: Routes = [
  {
    path: 'home',
    data: { breadcrumb: 'Inicio' },
    component: DummyComponent,
    children: [
      {
        path: 'login',
        data: { breadcrumb: 'Login' },
        component: DummyComponent,
        children: [
          {
            path: 'profile',
            data: { breadcrumb: 'Perfil' },
            component: DummyComponent,
          },
        ],
      },
    ],
  },
];

const duplicateByEmptyPathRoutes: Routes = [
  {
    path: 'home',
    data: { breadcrumb: 'Inicio' },
    children: [
      {
        path: '',
        data: { breadcrumb: 'Inicio' },
        component: DummyComponent,
      },
    ],
  },
];

const setup = async (routes = mockRoutes) => {
  TestBed.configureTestingModule({
    providers: [provideRouter(routes), BreadcrumbService],
  });
  const harness = await RouterTestingHarness.create();
  const service = TestBed.inject(BreadcrumbService);
  return { harness, service };
};

describe('BreadCrumbService', () => {
  it('should emit empty array as initial state', async () => {
    const { service } = await setup();
    expect(await firstValueFrom(service.breadcrumbs$)).toEqual([]);
  });
  it('should emit list IBreadcrumb when exist children route', async () => {
    const { service, harness } = await setup();
    await harness.navigateByUrl('/home/login');
    const breadcrumbs = await firstValueFrom(service.breadcrumbs$);
    expect(breadcrumbs).toEqual([
      { label: 'Inicio', url: '/home' },
      { label: 'Login', url: '/home/login' },
    ]);
  });
  it('should emit multiple breadcrumbs for nested route', async () => {
    const { service, harness } = await setup();
    await harness.navigateByUrl('/home/login/profile');
    const breadcrumbs = await firstValueFrom(service.breadcrumbs$);
    expect(breadcrumbs).toEqual([
      { label: 'Inicio', url: '/home' },
      { label: 'Login', url: '/home/login' },
      { label: 'Perfil', url: '/home/login/profile' },
    ]);
  });
  it('should skip duplicate labels', async () => {
    const { service, harness } = await setup(duplicateByEmptyPathRoutes);
    await harness.navigateByUrl('/home');
    const breadcrumbs = await firstValueFrom(service.breadcrumbs$);
    expect(breadcrumbs).toEqual([{ label: 'Inicio', url: '/home' }]);
  });
  it('should re-emit breadcrumbs on each NavigationEnd', async () => {
    const { service, harness } = await setup();
    await harness.navigateByUrl('/home');
    const promiseHome = firstValueFrom(service.breadcrumbs$);
    expect(await promiseHome).toEqual([{ label: 'Inicio', url: '/home' }]);
    await harness.navigateByUrl('/home/login');
    const promiseLogin = firstValueFrom(service.breadcrumbs$);
    expect(await promiseLogin).toEqual([
      { label: 'Inicio', url: '/home' },
      { label: 'Login', url: '/home/login' },
    ]);
  });
});

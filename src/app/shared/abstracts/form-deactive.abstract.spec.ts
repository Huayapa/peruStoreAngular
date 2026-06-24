import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormDeactivateAbstract } from './form-deactivate.abstract';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom, Observable, of } from 'rxjs';
import { ConfirmDialog } from '../components/confirm-dialog/confirm-dialog';
import { GuardResult } from '@angular/router';

@Component({ template: '' })
class TestComponent extends FormDeactivateAbstract {
  form = new FormGroup({ name: new FormControl('') });
}

describe('FormDeactiveAbstract', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let dialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, ReactiveFormsModule, TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
  });
  describe('BeforeUnload', () => {
    it('should call preventDefault when allowNavigation is false and the form has changes', () => {
      component.form.get('name')?.setValue('test');
      const mockEvent = new Event('beforeunload') as BeforeUnloadEvent;
      const preventDefault = jest.spyOn(mockEvent, 'preventDefault');
      component.onBeforeReload(mockEvent);
      expect(preventDefault).toHaveBeenCalled();
    });
    it('should not call preventDefault when allowNavigation is true', () => {
      component['allowNavigation'] = true;
      const mockEvent = new Event('beforeunload') as BeforeUnloadEvent;
      const preventDefault = jest.spyOn(mockEvent, 'preventDefault');
      component.onBeforeReload(mockEvent);
      expect(preventDefault).not.toHaveBeenCalled();
    });
    it('should not call preventDefault if allowNavigation is false and the form has no changes', () => {
      const mockEvent = new Event('beforeunload') as BeforeUnloadEvent;
      const preventDefault = jest.spyOn(mockEvent, 'preventDefault');
      component.onBeforeReload(mockEvent);
      expect(preventDefault).not.toHaveBeenCalled();
    });
  });
  describe('canDeactivate', () => {
    it('should return true immediately if allowNavigation is true', () => {
      component['allowNavigation'] = true;
      expect(component.canDeactivate()).toBe(true);
    });
    it('should return true immediately if the form has no changes', () => {
      expect(component.canDeactivate()).toBe(true);
    });
    it('should show dialog when allowNavigation is false and the form has changes', () => {
      component.form.get('name')?.setValue('test');
      const openSpy = jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(true),
      } as MatDialogRef<ConfirmDialog>);
      component.canDeactivate();
      expect(openSpy).toHaveBeenCalledWith(
        ConfirmDialog,
        expect.objectContaining({
          data: {
            title: 'Los datos se perderan',
            message: '¿Seguro que deseas salir? Los cambios que implemento se perderán.',
          },
        }),
      );
    });
    it('should return true when the user accepts the dialog', async () => {
      component.form.get('name')?.setValue('test');
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(true),
      } as MatDialogRef<ConfirmDialog>);
      const result = await firstValueFrom(component.canDeactivate() as Observable<GuardResult>);
      expect(result).toBe(true);
    });
    it('should return false when the user rejects the dialog', async () => {
      component.form.get('name')?.setValue('test');
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(false),
      } as MatDialogRef<ConfirmDialog>);
      const result = await firstValueFrom(component.canDeactivate() as Observable<GuardResult>);
      expect(result).toBe(false);
    });
  });
});

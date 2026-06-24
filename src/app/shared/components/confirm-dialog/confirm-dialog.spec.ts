import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialog, IConfirmDialogData } from './confirm-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { screen } from '@testing-library/angular';

describe('ConfirmDialog', () => {
  let component: ConfirmDialog;
  let fixture: ComponentFixture<ConfirmDialog>;
  let matDialogRef: MatDialogRef<ConfirmDialog>;

  const mockData: IConfirmDialogData = {
    title: 'Los datos se perderan',
    message: '¿Seguro que deseas salir?',
  };

  const mockDialogRef = {
    close: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    });
    fixture = TestBed.createComponent(ConfirmDialog);
    component = fixture.componentInstance;
    matDialogRef = TestBed.inject(MatDialogRef);
  });

  it('should have the injected data', () => {
    fixture.detectChanges();
    expect(screen.getByText(mockData.title)).toBeTruthy();
    expect(screen.getByText(mockData.message)).toBeTruthy();
  });
  it('should close and emit true when onConfirm is called', () => {
    component.onConfirm();
    expect(matDialogRef.close).toHaveBeenCalledWith(true);
  });
  it('should close and emit false when onCancel is called', () => {
    component.onCancel();
    expect(matDialogRef.close).toHaveBeenCalledWith(false);
  });
});

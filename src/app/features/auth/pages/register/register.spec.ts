import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import RegisterPage from './register';
import { provideRouter, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLabel, MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { of, Subject, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { AuthService } from '../../../../core/services/auth/auth';

const mockSnackBar = { open: jest.fn() };
const mockAuthService = { register: jest.fn() };
const mockDialogRef = { afterClosed: jest.fn() };
const mockDialog = { open: jest.fn() };

const changeRender = async () => {
  await render(RegisterPage, {
    imports: [MatLabel, MatInput, MatIcon, ReactiveFormsModule, MatError],
    providers: [
      provideRouter([]),
      { provide: MatSnackBar, useValue: mockSnackBar },
      { provide: AuthService, useValue: mockAuthService },
      { provide: MatDialog, useValue: mockDialog },
    ],
  });
  const fixture = TestBed.createComponent(RegisterPage);
  fixture.detectChanges();
  return { fixture };
};

const spyRoute = () => {
  const router = TestBed.inject(Router);
  const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
  return { navigateSpy };
};

const getFields = () => {
  const usernameInput = screen.getByLabelText('Usuario');
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Contraseña');
  const repeatPasswordInput = screen.getByLabelText('Repetir contraseña');
  return { usernameInput, emailInput, passwordInput, repeatPasswordInput };
};

const fillFields = () => {
  const { usernameInput, emailInput, passwordInput, repeatPasswordInput } = getFields();
  fireEvent.input(usernameInput, { target: { value: 'test_prueba' } });
  fireEvent.input(emailInput, { target: { value: 'test_prueba@gmail.com' } });
  fireEvent.input(passwordInput, { target: { value: 'test_12345678' } });
  fireEvent.input(repeatPasswordInput, { target: { value: 'test_12345678' } });
  return { usernameInput, emailInput, passwordInput, repeatPasswordInput };
};

const fillEmptyFields = () => {
  const { usernameInput, emailInput, passwordInput, repeatPasswordInput } = getFields();
  fireEvent.input(usernameInput, { target: { value: '' } });
  fireEvent.input(emailInput, { target: { value: '' } });
  fireEvent.input(passwordInput, { target: { value: '' } });
  fireEvent.input(repeatPasswordInput, { target: { value: '' } });
  return { usernameInput, emailInput, passwordInput, repeatPasswordInput };
};

const sendRegister = async () => {
  const submitButton = screen.getByRole('button', { name: /registrarte/i });
  fireEvent.click(submitButton);
};

const setup = async () => {
  const { fixture } = await changeRender();
  const { navigateSpy } = spyRoute();
  const fields = fillFields();
  sendRegister();
  return { ...fields, navigateSpy, fixture };
};

const setupInvalidForm = async () => {
  await changeRender();
  spyRoute();
  fillEmptyFields();
  sendRegister();
};

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthService.register.mockReturnValue(of({ id: '1' }));
    mockDialogRef.afterClosed.mockReturnValue(of(true));
    mockDialog.open.mockReturnValue(mockDialogRef);
  });
  describe('form validator', () => {
    it('should mark all fields when form is invalid', async () => {
      await setupInvalidForm();
      const errors = await screen.findAllByTestId(/error/i);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should not call register when form is invalid', async () => {
      await setupInvalidForm();
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });
  });

  describe('register succeded', () => {
    it('should call authService with correct payload', async () => {
      await setup();
      expect(mockAuthService.register).toHaveBeenCalledWith({
        username: 'test_prueba',
        email: 'test_prueba@gmail.com',
        password: 'test_12345678',
      });
    });

    it('should show loading spinner when process register', async () => {
      const authSubject = new Subject<{ id: string }>();
      mockAuthService.register.mockReturnValue(authSubject.asObservable());

      await setup();

      expect(await screen.findByRole('progressbar')).toBeInTheDocument();

      authSubject.next({ id: '0' });
      authSubject.complete();

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
    });

    it('should set allowNavigation to true when process register', async () => {
      const { fixture } = await setup();
      fixture.detectChanges();
      expect(fixture.componentInstance['allowNavigation']).toBe(true);
    });

    it('should clear form fields when process register', async () => {
      const { usernameInput, emailInput, passwordInput, repeatPasswordInput } = await setup();
      expect(usernameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
      expect(repeatPasswordInput).toHaveValue('');
    });

    it('should open snackbar when process register', async () => {
      await setup();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Registrado Exitosamente:',
        'Cerrar',
        expect.objectContaining({ panelClass: 'success-snackbar' }),
      );
    });

    it('should redirect to login page when process register', async () => {
      const { navigateSpy } = await setup();
      expect(navigateSpy).toHaveBeenCalledWith([APP_ROUTES.AUTH.ROOT, APP_ROUTES.AUTH.LOGIN.ROOT]);
    });
  });

  describe('register fail', () => {
    beforeEach(() => {
      mockAuthService.register.mockReturnValueOnce(
        throwError(() => new Error('Ocurrio un problema')),
      );
    });
    it('should not redirect when register fails', async () => {
      const { navigateSpy } = await setup();
      expect(navigateSpy).not.toHaveBeenCalled();
    });
    it('should hide loading spinner when register fails', async () => {
      await setup();
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    it('should not open snackbar when register fails', async () => {
      await setup();
      expect(mockSnackBar.open).not.toHaveBeenCalled();
    });
  });
});

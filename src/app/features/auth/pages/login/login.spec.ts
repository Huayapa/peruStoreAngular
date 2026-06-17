import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import LoginPage from './login';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatInput, MatLabel } from '@angular/material/input';
import { of, Subject, throwError } from 'rxjs';
import { CartProductsService } from '../../../../core/services/cart-products';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { APP_ROUTES } from '../../../../core/constants/app-routes';
import { AuthService } from '../../../../core/services/auth/auth';

const mockAuthService = { login: jest.fn() };
const mockCartService = { getCartStorage: jest.fn(), loadUserCart: jest.fn() };
const mockSnackBar = { open: jest.fn() };
const mockDialogRef = { afterClosed: jest.fn() };
const mockDialog = { open: jest.fn() };

const changeRender = async () => {
  await render(LoginPage, {
    imports: [ReactiveFormsModule, MatLabel, MatIcon, MatInput, MatError],
    providers: [
      provideRouter([]),
      { provide: AuthService, useValue: mockAuthService },
      { provide: CartProductsService, useValue: mockCartService },
      { provide: MatSnackBar, useValue: mockSnackBar },
      { provide: MatDialog, useValue: mockDialog },
    ],
  });
};

const fillForm = async () => {
  const usernameInput = screen.getByPlaceholderText('Ingresa tu Usuario');
  const passwordInput = screen.getByPlaceholderText('Ingresa tu contraseña');
  await userEvent.clear(usernameInput);
  await userEvent.clear(passwordInput);
  fireEvent.input(usernameInput, { target: { value: 'mor_2314' } });
  fireEvent.input(passwordInput, { target: { value: '83r5^_' } });
  return { usernameInput, passwordInput };
};

const spyRoute = () => {
  const router = TestBed.inject(Router);
  const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
  return { navigateSpy };
};

const setup = async () => {
  await changeRender();
  const { navigateSpy } = spyRoute();
  const { usernameInput, passwordInput } = await fillForm();

  const submitButton = screen.getByRole('button', { name: /ingresar/i });
  await userEvent.click(submitButton);
  return { usernameInput, passwordInput, navigateSpy, submitButton };
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthService.login.mockReturnValue(of({ token: 'testing_token_13y81jdia091o' }));
    mockCartService.getCartStorage.mockReturnValue({ id: 0, userId: 0, products: [] });
    mockDialogRef.afterClosed.mockReturnValue(of(true));
    mockDialog.open.mockReturnValue(mockDialogRef);
  });

  describe('form validator', () => {
    it('should not call login when form is invalid', async () => {
      await changeRender();
      const usernameInput = screen.getByPlaceholderText('Ingresa tu Usuario');
      await userEvent.clear(usernameInput);
      const submitButton = screen.getByRole('button', { name: /ingresar/i });
      await userEvent.click(submitButton);
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  describe('log in the user success', () => {
    it('should fill form with valid values', async () => {
      await changeRender();
      const { usernameInput, passwordInput } = await fillForm();
      expect(usernameInput).toHaveValue('mor_2314');
      expect(passwordInput).toHaveValue('83r5^_');
    });

    it('should show progressbar while proccess login', async () => {
      const loginSubject = new Subject<{ token: string }>();
      mockAuthService.login.mockReturnValue(loginSubject.asObservable());
      await setup();

      expect(await screen.findByRole('progressbar')).toBeInTheDocument();

      loginSubject.next({ token: 'testing_token_13y81jdia091o' });
      loginSubject.complete();

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
    });

    it('should call login service with correct credentials', async () => {
      await setup();
      expect(mockAuthService.login).toHaveBeenCalledWith({
        username: 'mor_2314',
        password: '83r5^_',
      });
    });

    it('should clean fields form after successful login', async () => {
      const { usernameInput, passwordInput } = await setup();
      expect(usernameInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });

    describe('cart behavior', () => {
      it('should not open dialog when cart is empty', async () => {
        await setup();
        expect(mockDialog.open).not.toHaveBeenCalled();
      });

      describe('when cart has products', () => {
        beforeEach(() => {
          mockCartService.getCartStorage.mockReturnValue({
            id: 1,
            userId: 1,
            products: [
              {
                product: {
                  id: 1,
                  title: 'Product 1',
                  price: 10.99,
                  description: 'Description',
                  category: 'category',
                  image: 'image.jpg',
                },
                quantity: 1,
              },
            ],
          });
        });

        it('should open dialog', async () => {
          await setup();
          expect(mockDialog.open).toHaveBeenCalled();
        });

        it('should call loadUserCart when dialog confirmed', async () => {
          mockDialogRef.afterClosed.mockReturnValue(of(true));
          const { navigateSpy } = await setup();
          expect(mockCartService.loadUserCart).toHaveBeenCalled();
          expect(navigateSpy).toHaveBeenCalledWith([APP_ROUTES.HOME.ROOT]);
        });

        it('should not call loadUserCart when dialog cancelled', async () => {
          mockDialogRef.afterClosed.mockReturnValue(of(false));
          const { navigateSpy } = await setup();
          expect(mockCartService.loadUserCart).not.toHaveBeenCalled();
          expect(navigateSpy).toHaveBeenCalledWith([APP_ROUTES.HOME.ROOT]);
        });
      });
    });

    it('should show success snackbar', async () => {
      await setup();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Sesión iniciada con exito',
        'Cerrar',
        expect.objectContaining({ panelClass: 'success-snackbar' }),
      );
    });
  });

  describe('login failure correctly', () => {
    beforeEach(() => {
      mockAuthService.login.mockReturnValueOnce(throwError(() => new Error('Ocurrio un problema')));
    });

    it('should show snackbar on error', async () => {
      await setup();
      expect(mockSnackBar.open).toHaveBeenCalled();
    });

    it('should not redirect', async () => {
      const { navigateSpy } = await setup();
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });
});

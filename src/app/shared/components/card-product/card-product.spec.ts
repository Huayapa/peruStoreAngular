import { render, screen } from '@testing-library/angular';
import { CardProduct } from './card-product';
import { IProduct } from '../../interfaces/product.interface';
import { CartProductsService } from '../../../core/services/cart-products/cart-products';
import { CurrencyPipe } from '@angular/common';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { APP_ROUTES } from '../../../core/constants/app-routes';
import userEvent from '@testing-library/user-event';
import { Location } from '@angular/common';

const mockProduct: IProduct = {
  id: 1,
  title: 'Producto 1',
  category: 'Sport',
  description: 'Descripción generica',
  image: 'url',
  price: 40,
};

const mockCartProduct = {
  addProductToCart: jest.fn(),
};

const setup = async () => {
  const { fixture } = await render(CardProduct, {
    providers: [
      provideRouter([{ path: 'products/:id', component: CardProduct }]),
      { provide: CartProductsService, useValue: mockCartProduct },
    ],
    inputs: {
      product: mockProduct,
    },
  });
  return { fixture };
};
describe('CardProduct', () => {
  it('should render product data title, price and image', async () => {
    await setup();
    const currencyPipe = new CurrencyPipe(TestBed.inject(LOCALE_ID));
    const currencyPrice = currencyPipe.transform(mockProduct.price);
    expect(screen.getByText(mockProduct.title)).toBeTruthy();
    expect(screen.getByText(currencyPrice!)).toBeTruthy();
    expect(screen.getByRole('img', { name: mockProduct.title })).toHaveAttribute(
      'src',
      mockProduct.image,
    );
  });
  it('should set routerLink to product detail with correct id', async () => {
    const { fixture } = await setup();
    await fixture.whenStable();
    const location = TestBed.inject(Location);
    const card = screen.getByTestId('card-product-component');
    await userEvent.click(card);
    expect(location.path()).toBe(APP_ROUTES.PRODUCTS.DETAIL.DETAIL_LINK(mockProduct.id));
  });
  it('should stop event propagation when clicking add to cart', async () => {
    const { fixture } = await setup();
    await fixture.whenStable();
    const location = TestBed.inject(Location);
    const initialPath = location.path();

    const addToCartBtn = screen.getByRole('button', { name: 'Agregar al carrito' });
    await userEvent.click(addToCartBtn);

    expect(location.path()).toBe(initialPath);
  });
  it('should call addProductToCart with current product on button click', async () => {
    await setup();
    const addToCartBtn = screen.getByRole('button', { name: 'Agregar al carrito' });
    await userEvent.click(addToCartBtn);
    expect(mockCartProduct.addProductToCart).toHaveBeenCalledWith(mockProduct);
  });
});

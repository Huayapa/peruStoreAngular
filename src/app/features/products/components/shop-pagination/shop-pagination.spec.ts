import { render, screen } from '@testing-library/angular';
import { ShopPagination } from './shop-pagination';

describe('ShopPagination', () => {
  const setup = async (page: number, totalPages: number[]) => {
    await render(ShopPagination, {
      inputs: { page, totalPages },
    });
  };
  it('should mark the current page as active', async () => {
    await setup(2, [1, 2, 3]);
    const pagination = screen.getByRole('button', { name: '2' });
    expect(pagination).toHaveClass('pagination__btn--active');
  });
  it('should not mark other page as active', async () => {
    await setup(2, [1, 2, 3]);
    const pagination1 = screen.getByRole('button', { name: '1' });
    const pagination3 = screen.getByRole('button', { name: '3' });
    expect(pagination1).not.toHaveClass('pagination__btn--active');
    expect(pagination3).not.toHaveClass('pagination__btn--active');
  });
  it('should show the buttons for each value totalPage', async () => {
    await setup(1, [1, 2, 3, 4, 5]);
    const paginations = screen.getAllByRole('button', { name: /^\d+$/ });
    expect(paginations.length).toBe(5);
  });
  it('should disabled the button left if the current first page', async () => {
    await setup(1, [1, 2, 3]);
    const left = screen.getByTestId('left');
    expect(left).toBeDisabled();
  });
  it('should disabled the button right if the current last page', async () => {
    await setup(3, [1, 2, 3]);
    const right = screen.getByTestId('right');
    expect(right).toBeDisabled();
  });
});

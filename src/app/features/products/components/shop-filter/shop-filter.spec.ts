import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import { ShopFilter } from './shop-filter';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import userEvent from '@testing-library/user-event';

const mockCategories = ['electronics', 'sports', 'clothing', 'home'];
const onFilterChange = jest.fn();

const setup = async () => {
  const { fixture } = await render(ShopFilter, {
    imports: [MatIcon, MatSliderModule, ReactiveFormsModule, MatCheckbox, CurrencyPipe],
    providers: [FormBuilder],
    inputs: { categories: mockCategories },
    on: { filterChange: onFilterChange },
  });
  return { fixture };
};

describe('ShopFilter', () => {
  it('should render a checkbox for each category', async () => {
    await setup();
    mockCategories.forEach((category) => {
      const categoryCheckbox = screen.getByRole('checkbox', { name: category });
      expect(categoryCheckbox).toBeInTheDocument();
    });
  });
  describe('filterChange emission', () => {
    it('should emit when a category checkbox is selected', async () => {
      await setup();
      const sportCheckbox = screen.getByRole('checkbox', { name: 'sports' });
      await userEvent.click(sportCheckbox);
      const clothingCheckbox = screen.getByRole('checkbox', { name: 'clothing' });
      await userEvent.click(clothingCheckbox);
      await waitFor(() => {
        expect(onFilterChange).toHaveBeenCalledWith(
          expect.objectContaining({ categories: ['sports', 'clothing'] }),
        );
      });
    });
    it('should emit when min price changes', async () => {
      await setup();
      const minPriceSlider = screen.getByTestId('price-min');
      fireEvent.input(minPriceSlider, { target: { value: 50 } });
      await waitFor(() => {
        expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ min: 50 }));
      });
    });
    it('should emit when max price changes', async () => {
      await setup();
      const maxPriceSlider = screen.getByTestId('price-max');
      fireEvent.input(maxPriceSlider, { target: { value: 1500 } });
      await waitFor(() => {
        expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ max: 1500 }));
      });
    });
    it('should emit when search input changes', async () => {
      await setup();
      const searchInput = screen.getByRole('searchbox');
      await userEvent.type(searchInput, 'verano');
      await waitFor(() => {
        expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ search: 'verano' }));
      });
    });
    it('should emit with combined filters (search, price, categories)', async () => {
      await setup();
      const sportCheckbox = screen.getByRole('checkbox', { name: 'sports' });
      await userEvent.click(sportCheckbox);
      const minPriceSlider = screen.getByTestId('price-min');
      fireEvent.input(minPriceSlider, { target: { value: 50 } });
      const maxPriceSlider = screen.getByTestId('price-max');
      fireEvent.input(maxPriceSlider, { target: { value: 1500 } });
      const searchInput = screen.getByRole('searchbox');
      await userEvent.type(searchInput, 'verano');
      await waitFor(() => {
        expect(onFilterChange).toHaveBeenCalledWith({
          categories: ['sports'],
          max: 1500,
          min: 50,
          search: 'verano',
        });
      });
    });
    it('should emit without categories key when all are deselected', async () => {
      await setup();
      const sportCheckbox = screen.getByRole('checkbox', { name: 'sports' });
      await userEvent.click(sportCheckbox);
      const clothingCheckbox = screen.getByRole('checkbox', { name: 'clothing' });
      await userEvent.click(clothingCheckbox);

      await userEvent.click(sportCheckbox);
      await userEvent.click(clothingCheckbox);

      await waitFor(() => {
        expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ categories: [] }));
      });
    });
  });
});

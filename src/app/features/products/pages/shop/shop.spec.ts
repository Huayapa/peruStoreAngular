import { render, screen, waitFor } from '@testing-library/angular';
import ShopPage from './shop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { BannerSection } from '../../../home/components/banner-section/banner-section';
import { ShopFilter } from '../../components/shop-filter/shop-filter';
import { ShopPagination } from '../../components/shop-pagination/shop-pagination';
import { ShopProducts } from '../../components/shop-products/shop-products';
import { ProductService } from '../../../../core/services/product/product';
import { of } from 'rxjs';
import { IFilteredResult } from '../../../../core/interfaces/product.interface';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';

const categories = ['electronics', 'sports', 'clothing', 'home'];
const filteredResult: IFilteredResult = {
  products: [
    {
      id: 1,
      title: 'Laptop Pro 15',
      price: 1299.99,
      description: 'High-performance laptop with 16GB RAM and 512GB SSD.',
      category: 'electronics',
      image: 'https://fakestoreapi.com/img/81fAn9hEBGL._AC_UY879_.jpg',
    },
    {
      id: 2,
      title: 'Running Shoes X',
      price: 89.99,
      description: 'Lightweight running shoes with cushioned sole.',
      category: 'sports',
      image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg',
    },
    {
      id: 3,
      title: 'Wireless Headphones',
      price: 199.99,
      description: 'Noise-cancelling over-ear headphones with 30h battery.',
      category: 'electronics',
      image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    },
    {
      id: 4,
      title: "Men's Slim Fit Shirt",
      price: 34.99,
      description: 'Classic cotton slim fit shirt available in multiple colors.',
      category: 'clothing',
      image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    },
    {
      id: 5,
      title: 'Coffee Maker Deluxe',
      price: 59.99,
      description: '12-cup programmable coffee maker with thermal carafe.',
      category: 'home',
      image: 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg',
    },
    {
      id: 6,
      title: 'Smart Watch Series 5',
      price: 249.99,
      description: 'Fitness tracking smartwatch with heart rate monitor.',
      category: 'electronics',
      image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    },
    {
      id: 7,
      title: 'Yoga Mat Premium',
      price: 29.99,
      description: 'Non-slip eco-friendly yoga mat with carrying strap.',
      category: 'sports',
      image: 'https://fakestoreapi.com/img/71w6CWkXdHL._AC_SX679_.jpg',
    },
    {
      id: 8,
      title: "Women's Denim Jacket",
      price: 64.99,
      description: 'Classic denim jacket with button closure.',
      category: 'clothing',
      image: 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg',
    },
    {
      id: 9,
      title: 'Blender Pro 900W',
      price: 79.99,
      description: 'High-power blender with 6 speed settings.',
      category: 'home',
      image: 'https://fakestoreapi.com/img/61aHbDdkqWL._AC_SX679_.jpg',
    },
    {
      id: 10,
      title: 'Bluetooth Speaker Mini',
      price: 39.99,
      description: 'Portable waterproof speaker with 12h battery life.',
      category: 'electronics',
      image: 'https://fakestoreapi.com/img/61c4qBxRJ6L._AC_SX679_.jpg',
    },
    {
      id: 11,
      title: 'Basketball Official Size',
      price: 24.99,
      description: 'Official size and weight basketball for indoor/outdoor.',
      category: 'sports',
      image: 'https://fakestoreapi.com/img/71Z0WPDdGmL._AC_SX679_.jpg',
    },
    {
      id: 12,
      title: "Kids' Graphic T-Shirt",
      price: 14.99,
      description: 'Soft cotton t-shirt with colorful graphic print.',
      category: 'clothing',
      image: 'https://fakestoreapi.com/img/71fmNnGFPpL._AC_SX679_.jpg',
    },
    {
      id: 13,
      title: 'Air Fryer Compact',
      price: 89.99,
      description: '3.5L compact air fryer with digital touch panel.',
      category: 'home',
      image: 'https://fakestoreapi.com/img/71YqkjVqyXL._AC_SX679_.jpg',
    },
  ],
  total: 13,
};

const mockProductService = {
  getCategory: jest.fn(),
  getFilteredProducts: jest.fn(),
};

describe('ShopPage', () => {
  let fixture: ComponentFixture<ShopPage>;
  let component: ShopPage;
  beforeEach(async () => {
    jest.clearAllMocks();
    mockProductService.getCategory.mockReturnValue(of(categories));
    mockProductService.getFilteredProducts.mockReturnValue(of(filteredResult));
  });
  const setup = async () => {
    const view = await render(ShopPage, {
      imports: [
        BannerSection,
        ReactiveFormsModule,
        MatSliderModule,
        ShopFilter,
        ShopProducts,
        ShopPagination,
      ],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    });
    fixture = view.fixture;
    component = view.fixture.componentInstance;
  };
  it.each([
    ['app-banner-section', 'banner-component'],
    ['app-shop-filter', 'shop-component'],
    ['app-shop-products', 'shop-products-component'],
    ['app-shop-pagination', 'pagination-component'],
  ])('should render subcomponent %s', async (_, id) => {
    await setup();
    expect(screen.getByTestId(id)).toBeTruthy();
  });
  it('should call getFilteredProducts with params page and pageSize', async () => {
    await setup();
    expect(mockProductService.getFilteredProducts).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, pageSize: 9 }),
    );
  });
  it('should pass categories() to component shop-filter', async () => {
    await setup();
    const shopFilter = fixture.debugElement.query(By.directive(ShopFilter));
    expect(shopFilter.componentInstance.categories()).toEqual(categories);
  });
  it('should pass products().products to component shop-products', async () => {
    await setup();
    const shopProducts = fixture.debugElement.query(By.directive(ShopProducts));
    expect(shopProducts.componentInstance.products()).toEqual(filteredResult.products);
  });
  it('should pass page() and totalpage() to component shop-pagination', async () => {
    await setup();
    const shopPagination = fixture.debugElement.query(By.directive(ShopPagination));

    expect(shopPagination.componentInstance.page()).toEqual(component.page());
    expect(shopPagination.componentInstance.totalPages()).toEqual(component.totalPages());
  });
  it('should calculate totalPages based on total and pageSize', async () => {
    await setup();
    expect(component.totalPages()).toStrictEqual([1, 2]);
  });
  it('should update filterProduct and set 1 page when emit filterChange', async () => {
    await setup();
    const shopFilter = fixture.debugElement.query(By.directive(ShopFilter));
    shopFilter.componentInstance.filterChange.emit({ categories: ['sports'] });
    expect(component.filterProduct()).toEqual({ categories: ['sports'] });
    expect(component.page()).toEqual(1);
  });
  it('should update page and call getFilteredProducts when pagechange is emit by shoppagination', async () => {
    await setup();
    const shopPagination = fixture.debugElement.query(By.directive(ShopPagination));
    shopPagination.componentInstance.pageChange.emit(2);
    expect(component.page()).toBe(2);
    await waitFor(() => {
      expect(mockProductService.getFilteredProducts).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 }),
      );
    });
  });
  it('should send combined params when shop-pagination emits pageChange', async () => {
    await setup();
    const shopFilter = fixture.debugElement.query(By.directive(ShopFilter));
    const shopPagination = fixture.debugElement.query(By.directive(ShopPagination));
    shopFilter.componentInstance.filterChange.emit({ categories: ['sports'] });
    shopPagination.componentInstance.pageChange.emit(2);
    await waitFor(() => {
      expect(mockProductService.getFilteredProducts).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, categories: ['sports'] }),
      );
    });
  });
});

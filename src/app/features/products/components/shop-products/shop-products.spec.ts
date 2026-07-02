import { render, screen } from '@testing-library/angular';
import { ShopProducts } from './shop-products';
import { IProduct } from '../../../../shared/interfaces/product.interface';
import { CardProduct } from '../../../../shared/components/card-product/card-product';

const mockProducts: IProduct[] = [
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
];

describe('ShopProducts', () => {
  it('should show the card-products for list input products', async () => {
    await render(ShopProducts, {
      imports: [CardProduct],
      inputs: {
        products: mockProducts,
      },
    });
    const allCardProducts = screen.getAllByTestId('card-product-component');
    expect(allCardProducts).toHaveLength(mockProducts.length);
  });
  it('should show message when the list products is 0', async () => {
    await render(ShopProducts, {
      imports: [CardProduct],
      inputs: { products: [] },
    });
    const message = screen.getByText('No hay productos disponibles');
    expect(message).toBeInTheDocument();
  });
});

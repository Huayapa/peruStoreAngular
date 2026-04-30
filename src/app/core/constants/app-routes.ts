export const APP_ROUTES = {
  HOME: '',
  AUTH: {
    ROOT: 'auth',
    LOGIN: 'login',
    REGISTER: 'register',
  },
  CART: {
    ROOT: 'cart',
  },
  PRODUCTS: {
    ROOT: 'products',
    DETAIL: 'products/:id',
    DETAIL_LINK: (id: string) => `products/${id}`,
  },
} as const;

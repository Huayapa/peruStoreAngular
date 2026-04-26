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
    DETAIL: (id: string) => `product/${id}`,
  },
} as const;

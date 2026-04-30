export const APP_ROUTES_OLD = {
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

export const APP_ROUTES = {
  HOME: {
    ROOT: '',
    TITLE: 'Inicio',
  },
  AUTH: {
    ROOT: 'auth',
    TITLE: 'Cuenta',
    LOGIN: {
      ROOT: 'login',
      TITLE: 'Inicio Sesión',
    },
    REGISTER: {
      ROOT: 'register',
      TITLE: 'Registro',
    },
  },
  CART: {
    ROOT: 'cart',
    TITLE: 'Carrito de compras',
  },
  PRODUCTS: {
    ROOT: 'products',
    TITLE: 'Tienda',
    DETAIL: {
      ROOT: 'products/:id',
      TITLE: 'Nombre temporal',
      DETAIL_LINK: (id: string) => `products/${id}`,
    },
  },
} as const;

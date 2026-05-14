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
    CHECKOUT: {
      ROOT: 'checkout',
      TITLE: 'Checkout',
      SUCCESS: {
        ROOT: 'success',
        TITLE: 'Pedido Confirmado',
      },
    },
  },
  PRODUCTS: {
    ROOT: 'products',
    TITLE: 'Tienda',
    DETAIL: {
      ROOT: ':id',
      DETAIL_LINK: (id: number) => `/products/${id}`,
    },
  },
} as const;

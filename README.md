# PeruStore - Tienda E-commerce en Angular

Aplicación de e-commerce moderna desarrollada con Angular 21 y TypeScript. Implementa autenticación JWT, integración con Stripe para procesamiento de pagos, carrito de compras persistente y arquitectura escalable siguiendo mejores prácticas del desarrollo frontend.

---

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Ejecución](#ejecución)
- [Estructura](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Servicios](#servicios-principales)

---

## Características

Funcionalidades de E-commerce:

- Catálogo de productos con búsqueda y filtros avanzados
- Filtrado por categoría, rango de precios y palabras clave
- Carrito de compras con persistencia en localStorage
- Gestión de inventario y actualización de cantidades
- Checkout seguro con integración Stripe
- Historial de órdenes y detalles de compras

Autenticación y Seguridad:

- Autenticación con JWT
- Protección de rutas públicas y privadas
- Interceptores HTTP para tokens e manejo de errores
- Validación de entrada y sanitización de datos
- Guardias de ruta personalizadas

Experiencia de Usuario:

- Diseño responsivo compatible con todos los dispositivos
- Componentes de Angular Material
- Animaciones fluidas con Lottie
- Navegación intuitiva con sidenav y carrito flotante
- Notificaciones mediante snackbars

Optimizaciones:

- Lazy loading de módulos de rutas
- Componentes standalone sin módulos
- Reactividad eficiente con Signals de Angular 17+
- Tree shaking automático en build

---

## Tecnologías

| Tecnología       | Versión | Descripción            |
| ---------------- | ------- | ---------------------- |
| Angular          | 21.1    | Framework principal    |
| TypeScript       | 5.6     | Lenguaje tipado        |
| Angular Material | 21.x    | Componentes UI         |
| RxJS             | 7.x     | Programación reactiva  |
| Stripe.js        | Latest  | Procesamiento de pagos |
| Lottie           | 1.x     | Animaciones            |
| SCSS             | 5.x     | Estilos                |
| Prettier         | Latest  | Formateador de código  |
| ESLint           | Latest  | Linting                |
| Vitest           | Latest  | Testing framework      |

---

## Requisitos

- Node.js v20 o superior
- npm v11 o superior
- Angular CLI v21.1+
- Git

Verificar instalación:

```bash
node --version
npm --version
ng version
```

---

## Ejecución

Iniciar servidor de desarrollo:

```bash
npm start
```

Acceder a: http://localhost:4200/

Credenciales de prueba:

- Usuario: mor_2314
- Contraseña: 83r5^\_

Build para producción:

```bash
npm run build
```

Los archivos compilados se guardan en dist/peru-store-angular/

---

## Estructura del Proyecto

```
peru-store-angular/
├── src/
│   ├── app/
│   │   ├── core/                 # Servicios, guards, interceptores
│   │   │   ├── services/         # AuthService, ProductService, CartService
│   │   │   ├── guards/           # Guardias de ruta
│   │   │   ├── interceptors/     # HTTP interceptadores
│   │   │   ├── interfaces/       # Tipos TypeScript
│   │   │   ├── adapters/         # Transformación de datos
│   │   │   └── constants/        # Constantes de la aplicación
│   │   ├── features/             # Módulos de negocio
│   │   │   ├── auth/             # Autenticación
│   │   │   ├── home/             # Página inicio
│   │   │   ├── products/         # Catálogo y detalles
│   │   │   └── cart/             # Carrito y checkout
│   │   ├── shared/               # Componentes compartidos
│   │   │   ├── components/       # Card, Slider, Dialog
│   │   │   ├── layout/           # Navbar, Footer, Sidebar
│   │   │   └── abstracts/        # Clases abstractas base
│   │   ├── app.ts                # Componente raíz
│   │   ├── app.routes.ts         # Rutas principales
│   │   └── app.config.ts         # Configuración de providers
│   ├── environments/             # Variables de entorno
│   ├── styles/                   # Estilos globales SCSS
│   └── main.ts                   # Punto de entrada
├── public/                       # Recursos estáticos
│   ├── image/                    # Imágenes
│   └── animations/               # Animaciones Lottie
├── angular.json                  # Config de Angular
├── package.json                  # Dependencias
├── tsconfig.json                 # Config TypeScript
├── eslint.config.js              # Config ESLint
└── README.md                     # Documentación
```

---

## Arquitectura

Patrón de arquitectura modular y escalable:

```
COMPONENTES (UI)
    ↓
SERVICIOS (Lógica de negocio)
    ↓
INTERCEPTORES Y GUARDIAS (Seguridad)
    ↓
API EXTERNA (FakeStore API, Stripe)
```

Flujo de datos:

1. Componentes solicitan datos a través de Servicios
2. Servicios hacen llamadas HTTP
3. Interceptores inyectan tokens y manejan errores
4. Guardias validan acceso a rutas
5. Adaptadores transforman datos de API
6. Signals actualizan la UI reactivamente

---

## Servicios Principales

AuthService - Autenticación con JWT:

```typescript
login(credentials): Observable<{ token: string }>
register(newuser): Observable<IRegisterResponse>
logout(): void
isLoggedIn(): boolean
getUserName(): string
getUserId(): number
```

ProductService - Gestión de productos:

```typescript
getProducts(): Observable<IProduct[]>
getProductId(id): Observable<IProduct>
getFilteredProducts(filters): Observable<IFilteredResult>
getCategory(): Observable<string[]>
```

CartProductsService - Carrito de compras:

```typescript
addProductToCart(prod): void
removeProductToCart(prod): void
updateStock(productId, newQuantity): void
getCartStorage(): ICartProduct
cartproduct$: Observable<ICartProduct>
totalPrice$: Observable<number>
totalItem$: Observable<number>
```

StripeService - Integración de pagos:

```typescript
init(): Promise<void>
createPaymentIntent(cart): Promise<IPaymentIntent>
confirmPayment(returnUrl): Promise<{ error? }>
```

---

## Licencia

Este proyecto está bajo la Licencia MIT.

---

## Autor

Josue huayapa julca

- GitHub: @Huayapa
- LinkedIn: [Josue huayapa](www.linkedin.com/in/josue-huayapa-630a19316)
- Portfolio: [huayapadev](https://portafolio-huayapa.vercel.app)


# PeruStore - Tienda E-commerce en Angular

Aplicación de e-commerce moderna desarrollada con Angular 21 y TypeScript. Implementa autenticación JWT, integración con Stripe para procesamiento de pagos, carrito de compras persistente y arquitectura escalable siguiendo mejores prácticas del desarrollo frontend y backend.

---

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos con Docker](#requisitos)
- [Instalación con Docker](#instalación)
- [Ejecución](#ejecución)
- [Estructura](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Servicios](#servicios-principales)
- [API Backend](#api-backend)

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
- Rate limiting en servidor
- CORS configurado
- Validación de sesiones

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

| Tecnología       | Versión | Descripción               |
| ---------------- | ------- | ------------------------- |
| Angular          | 21.1    | Framework principal       |
| TypeScript       | 5.6     | Lenguaje tipado           |
| Angular Material | 21.x    | Componentes UI            |
| RxJS             | 7.x     | Programación reactiva     |
| Node.js          | 20+     | Runtime backend           |
| Express.js       | 4.x     | Framework servidor        |
| Stripe.js        | Latest  | Procesamiento de pagos    |
| Stripe Node      | Latest  | Servidor de pagos backend |
| Lottie           | 1.x     | Animaciones               |
| SCSS             | 5.x     | Estilos                   |
| Prettier         | Latest  | Formateador de código     |
| ESLint           | Latest  | Linting                   |
| Vitest           | Latest  | Testing framework         |
| Docker           | Latest  | Empaqueta en contenedores |

---

## Requisitos con Docker

No es necesario instalar localmente Node.js, npm ni Angular CLI para ejecutar este proyecto.

Requisitos mínimos:

- Docker Desktop instalado y en ejecución
- Docker Compose v2
- Git
- 4 GB de RAM recomendados
- Clave API de Stripe para pagos reales

Verificar instalación:

```bash
docker --version
docker compose version
```

---

## Instalación con Docker

**1. Clonar repositorio:**

```bash
git clone <repository-url>
cd peruStoreAngular
```

**2. Configurar variables de entorno del servidor:**

Crear archivo `server/.env`:

```env
PORT=3000
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
FRONTEND_URL=http://localhost:4200
NODE_ENV=development
```

Crear archivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  stripePublicKey: 'pk_test_your_key_here',
};
```

Construir y levantar los contenedores:

**Acceder a la aplicación:**

Frontend: http://localhost:4200
Backend: http://localhost:3000

---

## Ejecución

**Iniciar todos los servicios:**

```bash
docker compose up
```

**Detener los servicios:**

```bash
docker compose down
```

**Ver logs en tiempo real:**

```bash
docker compose logs -f
```

**Reconstruir imágenes:**

```bash
docker compose up --build
```

**Credenciales de prueba:**

- Usuario: mor_2314
- Contraseña: 83r5^\_

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
├── server/                       # Backend Node.js/Express
│   ├── config/                   # Configuración
│   │   └── env.js                # Variables de entorno
│   ├── controllers/              # Controladores de lógica
│   │   ├── stripe.payment-intent.controller.js
│   │   └── stripe.webhook.controller.js
│   ├── middleware/               # Middlewares
│   │   ├── cors.middleware.js
│   │   ├── rate-limit.middleware.js
│   │   ├── security.middleware.js
│   │   └── validate-session.middleware.js
│   ├── routes/                   # Definición de rutas
│   │   ├── index.routes.js
│   │   └── stripe/
│   │       └── stripe.routes.js
│   ├── services/                 # Lógica de negocio
│   │   ├── cart.service.js
│   │   ├── checkoutSession.service.js
│   │   ├── order.service.js
│   │   └── stripe.service.js
│   ├── server.js                 # Punto de entrada
│   ├── .env                      # Variables de entorno
│   ├── package.json
│   └── pnpm-lock.yaml
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

Arquitectura full-stack modular y escalable:

```
FRONTEND (Angular 21)
    ↓
COMPONENTES ← SERVICIOS
    ↓           ↓
INTERCEPTORES → HTTP CALLS
    ↓
BACKEND (Node.js/Express)
    ↓
MIDDLEWARES (CORS, Rate Limit, Security)
    ↓
RUTAS → CONTROLADORES → SERVICIOS
    ↓
APIs EXTERNAS (Stripe, FakeStore API)
```

**Flujo de datos completo:**

1. Usuario interactúa con componentes Angular
2. Componentes solicitan datos a Servicios
3. Servicios realizan llamadas HTTP con interceptores
4. Interceptores inyectan tokens JWT
5. Backend recibe petición en rutas/controladores
6. Controladores validan sesión y aplican middlewares
7. Servicios backend procesan lógica (Stripe, órdenes)
8. Respuesta regresa al frontend con Signals reactivos
9. UI se actualiza automáticamente

---

## Servicios Principales

### Frontend

**AuthService** - Autenticación con JWT:

```typescript
login(credentials): Observable<{ token: string }>
register(newuser): Observable<IRegisterResponse>
logout(): void
isLoggedIn(): boolean
getUserName(): string
getUserId(): number
```

**ProductService** - Gestión de productos:

```typescript
getProducts(): Observable<IProduct[]>
getProductId(id): Observable<IProduct>
getFilteredProducts(filters): Observable<IFilteredResult>
getCategory(): Observable<string[]>
```

**CartProductsService** - Carrito de compras:

```typescript
addProductToCart(prod): void
removeProductToCart(prod): void
updateStock(productId, newQuantity): void
getCartStorage(): ICartProduct
cartproduct$: Observable<ICartProduct>
totalPrice$: Observable<number>
totalItem$: Observable<number>
```

**StripeService** - Integración de pagos:

```typescript
init(): Promise<void>
createPaymentIntent(cart): Promise<IPaymentIntent>
confirmPayment(returnUrl): Promise<{ error? }>
```

### Backend

**StripeService** - Procesamiento de pagos:

- Crear payment intents
- Procesar webhooks de Stripe
- Validar transacciones

**OrderService** - Gestión de órdenes:

- Crear órdenes desde carrito
- Guardar historial de compras
- Consultar estado de órdenes

**CartService** - Validación de carrito:

- Validar productos y cantidades
- Calcular totales
- Aplicar descuentos

**CheckoutSessionService** - Sesiones de checkout:

- Crear y validar sesiones
- Mantener estado de checkout

---

## API Backend

Base URL: `http://localhost:3000`

### Stripe Endpoints

**POST** `/api/stripe/payment-intent`

Crear intent de pago:

```json
Body: {
  "amount": 10000,
  "currency": "usd",
  "metadata": { "orderId": "123" }
}

Response: {
  "clientSecret": "pi_xxx_secret_xxx",
  "id": "pi_xxx"
}
```

**POST** `/api/stripe/webhook`

Webhook de eventos de Stripe (procesado automáticamente)

### Middlewares

- **CORS** - Control de origen cruzado
- **Rate Limiting** - Máximo 100 requests/15min
- **Security** - Headers de seguridad
- **Session Validation** - Verificación de sesión activa

---

## Licencia

Este proyecto está bajo la Licencia MIT.

---

## Autor

Josue huayapa julca

- GitHub: @Huayapa
- LinkedIn: [Josue huayapa](www.linkedin.com/in/josue-huayapa-630a19316)
- Portfolio: [huayapadev](https://portafolio-huayapa.vercel.app)

# Daily Necessity

A grocery / daily-essentials e-commerce platform.

## Tech Stack

| Layer    | Technology                                   |
|----------|----------------------------------------------|
| Frontend | React 19, Vite 6, Tailwind CSS v4, shadcn/ui |
| Backend  | Express 4, Prisma 6, PostgreSQL 16           |
| Auth     | JWT (access + refresh tokens), bcryptjs, zod |
| Infra    | Docker Compose, Mailpit, Adminer             |

## Quick Start

```bash
cp .env.example .env
docker compose up --build
```

This starts all services. Open:
- **Frontend** — http://localhost:5173
- **Backend API** — http://localhost:3000/api
- **Adminer** (PostgreSQL GUI) — http://localhost:8080
- **Mailpit** (email capture) — http://localhost:8025

> Docker Desktop must be running on macOS. Lockfiles (`package-lock.json`) must exist before building — run `npm install` in `backend/` and `frontend/` if you add dependencies.

## Seed Credentials

| Role     | Email                          | Password     |
|----------|--------------------------------|--------------|
| Admin    | admin@daily-necessity.com      | admin123     |
| Customer | customer@example.com           | customer123  |

Run `npm run seed` inside the backend container (or `docker compose exec backend npm run seed`) to populate sample data.

## Services

| Service   | Port(s)     | Notes                                    |
|-----------|-------------|------------------------------------------|
| postgres  | 5432        | Health-checked; data in named volume     |
| backend   | 3000        | Hot-reload via nodemon                   |
| frontend  | 5173        | HMR via Vite (polling mode for Docker)   |
| mailpit   | 1025, 8025  | SMTP capture; web UI at port 8025        |
| adminer   | 8080        | Login: PostgreSQL, server=`postgres`     |

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # 10 models (User, Product, Order, etc.)
│   │   └── seed.js                # Sample data (admin, categories, products)
│   ├── src/
│   │   ├── config/                # Zod-validated env parsing
│   │   ├── features/
│   │   │   ├── auth/              # Register, login, refresh, me
│   │   │   ├── categories/        # Category CRUD
│   │   │   ├── products/          # Product CRUD + listing with filters
│   │   │   ├── inventory/         # Stock management
│   │   │   ├── cart/              # Cart add/update/remove
│   │   │   ├── addresses/         # Address CRUD
│   │   │   ├── orders/            # Checkout, history, admin status update
│   │   │   ├── users/             # Admin user management
│   │   │   └── payments/          # Payment creation
│   │   ├── lib/prisma.js          # Prisma client singleton
│   │   ├── middlewares/           # Auth, admin, validate, errorHandler
│   │   ├── routes/index.js        # Route mounting
│   │   ├── utils/                 # ApiError, asyncHandler
│   │   └── index.js               # Express entrypoint
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                   # Fetch client + all endpoint functions
│   │   ├── components/
│   │   │   ├── ui/                # shadcn/ui primitives (10 components)
│   │   │   ├── layout/            # Navbar, Footer, Layout
│   │   │   └── common/            # Loader, EmptyState
│   │   ├── context/               # AuthContext, CartContext
│   │   ├── hooks/                 # useAuth, ProtectedRoute
│   │   ├── pages/                 # 14 route pages + 4 admin pages
│   │   ├── styles/globals.css     # Tailwind v4 + CSS variables
│   │   ├── App.jsx                # Router + providers
│   │   └── main.jsx               # Entrypoint
│   ├── Dockerfile                 # Dev (Vite) / Prod (nginx)
│   └── package.json
├── docker-compose.yml             # 5 services orchestration
├── .env.example                   # Required configuration
├── AGENTS.md                      # Agent instructions for OpenCode
└── README.md
```

## API Endpoints

All endpoints are prefixed with `/api`.

### Public
| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| GET    | `/health`             | Health check              |
| GET    | `/categories`         | List categories           |
| GET    | `/categories/:slug`   | Category with products    |
| GET    | `/products`           | List (paginated, filterable) |
| GET    | `/products/:slug`     | Product detail            |

### Auth
| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| POST   | `/auth/register`      | Register new user         |
| POST   | `/auth/login`         | Login                     |
| POST   | `/auth/refresh`       | Refresh access token      |
| POST   | `/auth/logout`        | Invalidate refresh token  |
| GET    | `/auth/me`            | Get current user          |

### Authenticated
| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| GET    | `/cart`               | Get cart                  |
| POST   | `/cart`               | Add to cart               |
| PUT    | `/cart/:itemId`       | Update quantity           |
| DELETE | `/cart/:itemId`       | Remove from cart          |
| GET    | `/addresses`          | List addresses            |
| POST   | `/addresses`          | Create address            |
| PUT    | `/addresses/:id`      | Update address            |
| DELETE | `/addresses/:id`      | Delete address            |
| POST   | `/orders`             | Create order (checkout)   |
| GET    | `/orders`             | List my orders            |
| GET    | `/orders/:id`         | Order detail              |
| POST   | `/payments`           | Create payment            |

### Admin
| Method | Endpoint                    | Description               |
|--------|-----------------------------|---------------------------|
| GET    | `/users`                    | List users                |
| GET    | `/users/:id`                | Get user                  |
| PUT    | `/users/:id`                | Update user               |
| DELETE | `/users/:id`                | Delete user               |
| POST   | `/categories`               | Create category           |
| PUT    | `/categories/:id`           | Update category           |
| DELETE | `/categories/:id`           | Delete category           |
| POST   | `/products`                 | Create product            |
| PUT    | `/products/:id`             | Update product            |
| DELETE | `/products/:id`             | Delete product            |
| GET    | `/inventory/:productId`     | Get stock                 |
| PUT    | `/inventory/:productId`     | Update stock              |
| GET    | `/orders/admin`             | List all orders           |
| PUT    | `/orders/:id/status`        | Update order status       |

## Commands

| Where    | Command                          | Purpose                              |
|----------|----------------------------------|--------------------------------------|
| root     | `docker compose up --build`      | Build and start all services         |
| backend  | `npm run dev`                    | Dev server (Prisma sync + nodemon)   |
| backend  | `npm run migrate`                | Create/run Prisma migrations         |
| backend  | `npm run seed`                   | Run seed script                      |
| backend  | `npm start`                      | Production start                     |
| frontend | `npm run dev`                    | Vite dev server                      |
| frontend | `npm run build`                  | Production build to `dist/`          |

## Environment Variables

All configurable via `.env`. See `.env.example` for defaults.

| Variable       | Default                                      | Description             |
|----------------|----------------------------------------------|-------------------------|
| `DATABASE_URL` | `postgresql://daily_necessity:...@postgres:5432/daily_necessity` | Prisma datasource URL   |
| `JWT_SECRET`   | `dev_jwt_secret_change_in_production`        | Token signing key       |
| `VITE_API_URL` | `http://localhost:3000/api`                  | Frontend API base URL   |

## Database

Prisma schema at `backend/prisma/schema.prisma` defines 10 models:

- **User** / **RefreshToken** — authentication and sessions
- **Category** / **Product** / **Inventory** — catalog and stock
- **CartItem** — user shopping cart
- **Address** / **Order** / **OrderItem** / **Payment** — checkout and history

In development, schema is auto-synced via `prisma db push`. For persistent migrations, use `prisma migrate dev`.

## Frontend Pages

| Path              | Page             | Access   |
|-------------------|------------------|----------|
| `/`               | Home             | Public   |
| `/products`       | Product listing  | Public   |
| `/products/:slug` | Product detail   | Public   |
| `/cart`           | Shopping cart    | Auth     |
| `/checkout`       | Checkout flow    | Auth     |
| `/login`          | Login form       | Guest    |
| `/register`       | Register form    | Guest    |
| `/profile`        | User profile     | Auth     |
| `/orders`         | Order history    | Auth     |
| `/orders/:id`     | Order detail     | Auth     |
| `/admin`          | Dashboard        | Admin    |
| `/admin/products` | Manage products  | Admin    |
| `/admin/orders`   | Manage orders    | Admin    |
| `/admin/users`    | Manage users     | Admin    |

## License

Private — internal project.

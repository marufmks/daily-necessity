# AGENTS.md

Project: **daily-necessity** — grocery/e-comm platform.
Stack: React 19 (Vite) + Express 4 + PostgreSQL 16 + Prisma 6 + Docker Compose.

## First-time setup

```bash
cp .env.example .env        # required; .env is gitignored
docker compose up --build   # builds all images, starts services
```

- **lockfiles must exist** before building. If you add deps, run `npm install` locally to generate them.
- Docker daemon must be running (`open -a "Docker Desktop"` on macOS).

## Services (docker-compose.yml)

| Service   | Port(s)         | Notes                                |
|-----------|-----------------|--------------------------------------|
| postgres  | 5432            | health check; data persisted in volume |
| backend   | 3000            | dev target; hot-reload via nodemon   |
| frontend  | 5173            | dev target; Vite HMR, polling mode   |
| mailpit   | 1025 / 8025     | SMTP capture; UI at localhost:8025   |
| adminer   | 8080            | PG GUI; server=`postgres` in login   |

- Backend connects to postgres via Compose service name `postgres`, never `localhost`.
- Mailpit SMTP env vars (`SMTP_HOST`, `SMTP_PORT`) are set on the backend service.
- Adminer login: PostgreSQL, server=`postgres`, database=`daily_necessity`.

## Backend

**Entrypoint:** `backend/src/index.js` — mounts Express app and starts listening.
**Dev script:** `npx prisma generate && npx prisma db push && nodemon src/index.js` — auto-syncs schema via `db push` (no migration files required for dev).
**Prisma schema:** `backend/prisma/schema.prisma` — models: User, RefreshToken, Category, Product, Inventory, CartItem, Address, Order, OrderItem, Payment. All IDs are UUIDs. Enums: UserRole (CUSTOMER/ADMIN), OrderStatus.

Folder convention (as-built):
- `src/features/auth`, `categories`, `products`, `inventory`, `cart`, `addresses`, `orders`, `users`, `payments` — each has `routes.js`, `controller.js`, `service.js`, `validation.js`
- `src/config`, `src/lib`, `src/middlewares`, `src/routes`, `src/utils` — shared infrastructure
- `prisma/` — schema, seed

Dockerfile is multi-stage: `development` (installs all deps, runs dev script) and `production` (production-only deps, prisma generate, node start).

**Seed credentials:**
- Admin: `admin@daily-necessity.com` / `admin123`
- Customer: `customer@example.com` / `customer123`

## Frontend

**Entrypoint:** `frontend/src/main.jsx` → `App.jsx` (router + providers).
Uses Vite 6 with `@vitejs/plugin-react` and `@tailwindcss/vite`. Server config: `host: true` + polling watch for Docker compat.
API base: `import.meta.env.VITE_API_URL` (defaults to `http://localhost:3000/api`).

| Directory | Purpose |
|-----------|---------|
| `src/api/` | Fetch client + endpoint functions |
| `src/components/ui/` | shadcn/ui primitives (Button, Card, Input, Select, Badge, etc.) |
| `src/components/layout/` | Navbar, Footer, Layout wrapper |
| `src/context/` | AuthContext (login/logout/register), CartContext (add/remove/quantity) |
| `src/pages/` | All route pages (Home, Products, Cart, Checkout, Login, Register, etc.) |
| `src/pages/admin/` | Admin pages (Dashboard, ProductsManage, OrdersManage, UsersManage) |
| `src/styles/globals.css` | Tailwind v4 + shadcn CSS variables |

`import` aliases use `@/` mapped to `src/`.
Auth is token-based: `localStorage.getItem("token")` → `Authorization: Bearer` header.
shadcn components are hand-coded (not CLI-generated) for Docker compatibility.
- 10 UI primitives: Button, Card, Input, Label, Badge, Separator, Select, Sheet, DropdownMenu, RadioGroup, Skeleton.
- Toast via `sonner`.

Dockerfile is multi-stage: `development` (Vite dev server) and `production` (nginx serving built dist).

## Commands

| Where    | Command                          | Purpose                              |
|----------|----------------------------------|--------------------------------------|
| root     | `docker compose up --build`      | Start full stack                     |
| backend  | `npm run dev`                    | Dev server with Prisma + nodemon     |
| backend  | `npm run migrate`                | `prisma migrate dev` (requires DB)   |
| backend  | `npm run seed`                   | Run `prisma/seed.js`                 |
| backend  | `npm start`                      | Production start                     |
| frontend | `npm run dev`                    | Vite dev server                      |
| frontend | `npm run build`                  | Production build to `dist/`          |

## Key constraints

- All Prisma schema changes go through `schema.prisma` + `prisma db push` (dev) or `prisma migrate dev` (persistent).
- Never hardcode secrets — use `.env` + Compose env interpolation.
- Backend uses `@prisma/client`, `bcryptjs`, `jsonwebtoken`, `zod`, `cors`.
- Frontend uses `react-router-dom` for routing.
- No test framework or lint runner configured yet — `lint` scripts are placeholders.

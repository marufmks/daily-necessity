# Daily Necessity

A grocery / daily-essentials e-commerce platform.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite 6, react-router-dom  |
| Backend  | Express 4, Prisma 6, PostgreSQL 16  |
| Auth     | JWT, bcryptjs, zod                  |
| Infra    | Docker Compose                      |

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
│   ├── prisma/            # Schema, migrations, seed
│   │   └── schema.prisma  # All data models (User, Product, Order, etc.)
│   ├── src/
│   │   ├── config/        # Environment parsing
│   │   ├── controllers/   # HTTP handlers
│   │   ├── middlewares/    # Auth, validation, error handling
│   │   ├── routes/        # Route definitions
│   │   ├── services/      # Business logic
│   │   └── index.js       # App entrypoint
│   ├── Dockerfile         # Multi-stage (dev / prod)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/           # API client layer
│   │   ├── components/    # Shared UI components
│   │   ├── features/      # Feature-specific logic
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Route-level screens
│   │   ├── App.jsx        # Root component
│   │   └── main.jsx       # Entrypoint
│   ├── Dockerfile         # Multi-stage (dev / prod with nginx)
│   └── package.json
├── docker-compose.yml     # Full stack orchestration
├── .env.example           # Required configuration
└── AGENTS.md              # Agent instructions for OpenCode
```

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

Key variables:

| Variable       | Default                                      | Description             |
|----------------|----------------------------------------------|-------------------------|
| `DATABASE_URL` | `postgresql://daily_necessity:...@postgres:5432/daily_necessity` | Prisma datasource URL   |
| `JWT_SECRET`   | `dev_jwt_secret_change_in_production`        | Token signing key       |
| `VITE_API_URL` | `http://localhost:3000/api`                  | Frontend API base URL   |

## Database

Prisma schema at `backend/prisma/schema.prisma` defines:

- **User** / **RefreshToken** — authentication and sessions
- **Category** / **Product** / **Inventory** — catalog and stock
- **CartItem** — user shopping cart
- **Address** / **Order** / **OrderItem** / **Payment** — checkout and history

In development, schema is auto-synced via `prisma db push`. For persistent migrations, use `prisma migrate dev`.

## License

Private — internal project.

# AGENTS.md

## Project Identity
Project name: daily-necessity

daily-necessity is a grocery / daily-essentials e-commerce platform inspired by modern online supermarket experiences.
The project will be built with:
- Frontend: React
- Backend: Node.js + Express
- Database: PostgreSQL
- ORM: Prisma
- Local development and deployment: Docker

## Agent Mission
When working in this repository, the agent should:
- Build features that are production-oriented, maintainable, and easy to extend.
- Prefer clear, incremental changes over large rewrites.
- Follow existing code patterns already present in the repository.
- Keep the system modular so backend, frontend, and Docker concerns remain separated.
- Update code, tests, and docs together when behavior changes.
- Preserve the ability to run the full stack with Docker Compose.

## Working Principles
- Inspect the repository before editing.
- Reuse existing utilities, components, and services when possible.
- Do not introduce unnecessary dependencies.
- Make the smallest change that correctly solves the task.
- Avoid speculative abstractions unless there is a clear need.
- If requirements are unclear, choose the simplest correct implementation and document assumptions briefly.

## Repository Layout
Expected top-level structure:
- `backend/` for the Node.js API
- `frontend/` for the React app
- `docker/` for shared Docker or deployment assets if needed
- `docs/` for project notes, architecture, and implementation guidance
- `infra/` for deployment or environment setup if needed

If the real structure differs, inspect the repository tree and adapt instead of forcing a new structure.

## Docker Rules
- Use Docker Compose as the default local development workflow.
- Use separate containers for frontend, backend, and PostgreSQL.
- Do not hardcode secrets, API keys, or environment-specific values in source files.
- Prefer multi-stage Dockerfiles for production images.
- Keep development images optimized for fast rebuilds and hot reload.
- Ensure containers can start from a clean environment without manual host setup.
- The backend must connect to PostgreSQL using the Compose service name, not `localhost`, when running inside Docker.
- Add health checks where useful.
- If a service depends on another, make startup order explicit in Compose.

## Backend Rules
- Use Node.js and Express for the API.
- Use PostgreSQL as the primary database.
- Use Prisma for schema management, migrations, and database access.
- Keep controllers thin and move business logic into services.
- Keep route definitions simple and grouped by feature.
- Use middleware for authentication, authorization, validation, and error handling.
- Use JWT-based auth unless the task explicitly requires another mechanism.
- Use role-based authorization for admin-only actions.
- Validate all incoming request bodies, query parameters, and route params.
- Return consistent API responses.
- Avoid exposing raw stack traces or database internals to clients.

### Backend Feature Areas
Likely modules include:
- auth
- users
- products
- categories
- cart
- orders
- payments
- addresses
- inventory
- admin

### Backend Folder Convention
Preferred structure:
- `src/app` for app initialization
- `src/config` for config loading and environment parsing
- `src/routes` for route registration
- `src/controllers` for HTTP layer
- `src/services` for business rules
- `src/repositories` or `src/data` for persistence helpers if needed
- `src/middlewares` for auth, validation, and error handling
- `src/modules` for feature-based grouping
- `src/utils` for helpers
- `prisma/` for schema, migrations, and seed logic

## Database Rules
- Use PostgreSQL only unless the task explicitly changes the database.
- Manage schema changes with Prisma migrations.
- Keep the schema normalized enough for reliability, especially for orders and inventory.
- Use indexes for common filters and lookups.
- Model users, products, categories, cart items, orders, order items, addresses, payments, and inventory clearly.
- Prefer explicit relationships and avoid hidden database behavior.
- Do not edit generated migration history casually.
- If seed data is added, keep it small and realistic.

## Frontend Rules
- Use React for the frontend.
- Build mobile-first and responsive UI.
- Keep API integration in a dedicated service layer.
- Use reusable components for buttons, inputs, modals, cards, and layout primitives.
- Keep pages focused on composition, not business logic.
- Provide loading, empty, and error states for all async views.
- Use form validation and user-friendly messages.
- Keep authentication state and API session handling centralized.
- Avoid duplicating backend validation logic in many places unless necessary for UX.

### Frontend Folder Convention
Preferred structure:
- `src/components` for shared UI
- `src/pages` for route-level screens
- `src/features` for feature-specific logic
- `src/api` for API clients and request helpers
- `src/hooks` for reusable hooks
- `src/context` or `src/store` for global state if needed
- `src/utils` for helpers
- `src/assets` for static files

## API Design Rules
- Use REST-style endpoints unless there is a strong reason not to.
- Use plural resource names.
- Keep endpoint names predictable and consistent.
- Use proper HTTP status codes.
- Paginate list endpoints that can grow.
- Support filtering and search for products.
- Keep request and response shapes stable.
- Version the API only if needed; do not add versioning too early.
- Prefer server-side enforcement of business rules such as stock limits and order creation rules.

## Authentication and Authorization
- Hash passwords securely.
- Never store plain-text passwords.
- Protect admin routes with role checks.
- Separate public, authenticated user, and admin access clearly.
- Treat tokens and sessions as sensitive data.
- If refresh tokens are used later, keep them revocable.

## Testing Rules
- Add or update tests for every meaningful behavior change.
- Test business logic in services.
- Test key routes and user flows with integration tests where practical.
- Keep tests deterministic and independent.
- Run the relevant test suite before finishing work.
- If a task changes schema or API behavior, include tests or explain why not.

## Quality Rules
- Prefer readable code over clever code.
- Keep functions small and purposeful.
- Keep files reasonably scoped.
- Remove dead code during the task when safe to do so.
- Do not add placeholder code unless the task explicitly asks for scaffolding.
- If there are lint or formatting tools, follow them consistently.

## Security Rules
- Never commit secrets.
- Use `.env` files and environment variables for configuration.
- Validate input everywhere user-controlled data enters the system.
- Sanitize file uploads and external inputs.
- Avoid logging sensitive data.
- Do not leak database credentials or private tokens in errors or docs.
- Keep admin-only capabilities locked down.
- Prefer secure defaults over convenience.

## Performance Rules
- Use pagination for large lists.
- Avoid N+1 database queries where practical.
- Add indexes for common product and order lookups.
- Keep frontend bundles reasonable.
- Avoid unnecessary re-renders in React.
- Cache only when there is a proven need.

## Error Handling
- Use a shared error format across the backend.
- Convert unknown errors into safe client responses.
- Log enough detail for debugging, but not sensitive data.
- Handle validation errors separately from server errors.
- Make failure modes explicit in both backend and frontend.

## File and Naming Conventions
- Use clear, descriptive names.
- Keep filenames consistent with adjacent code.
- Prefer lowercase folder names.
- Use singular names for entities and plural names for collections where appropriate.
- Do not rename public files or route paths without a clear reason.

## Docker and Environment Expectations
Likely environment files:
- `.env` for local development values
- `.env.example` for documented placeholders

Expected services:
- `frontend`
- `backend`
- `postgres`

If additional services are added later, document them clearly and keep Compose aligned with the README and runtime setup.

## Documentation Rules
- Update docs when setup, commands, or behavior changes.
- Keep README and AGENTS.md aligned.
- If a feature is complex, create a dedicated note in `docs/`.
- Use short, task-specific docs for non-obvious decisions.

## Where To Put Extra Guidance
For detailed or task-specific instructions, add separate files such as:
- `docs/backend.md`
- `docs/frontend.md`
- `docs/docker.md`
- `docs/database.md`

Use those for detailed explanations instead of overloading this root file.

## Agent Behavior During Tasks
Before making changes:
1. Inspect the relevant files.
2. Identify the minimal set of files that need edits.
3. Check for existing patterns to follow.

During changes:
1. Prefer direct edits over broad refactors.
2. Keep changes focused on the requested task.
3. Update tests alongside implementation.
4. Keep Docker and environment config in sync.

Before finishing:
1. Verify the app still builds or the changed area still works.
2. Check for missing imports, broken references, or stale docs.
3. Ensure any schema changes, environment changes, or new scripts are reflected in setup docs.

## Do Not
- Do not invent requirements not present in the repository or task.
- Do not introduce unnecessary complexity.
- Do not rewrite unrelated parts of the codebase.
- Do not hardcode secrets or environment-specific data.
- Do not break Docker-based development.
- Do not skip tests silently.

## If Unsure
- Choose the simplest correct implementation.
- Follow the closest existing pattern.
- Add a short note in docs if a decision may need future review.
- Ask for clarification only when a task cannot be completed safely otherwise.
# AGENTS.md

## Setup

1. `docker-compose up -d` — starts PostgreSQL 16 on port 5432
2. `cp .env.template .env` — configure DB credentials and JWT secrets
3. `yarn install`
4. `yarn setup` — runs `migration:run` + `seed:run` in one step

## Commands

| Task | Command |
|---|---|
| Dev server (watch) | `yarn start:dev` |
| Build | `yarn build` |
| Lint (auto-fix) | `yarn lint` |
| Format | `yarn format` |
| Unit tests | `yarn test` |
| Single test file | `yarn test -- --testPathPattern=<file>` |
| E2E tests | `yarn test:e2e` |
| Test coverage | `yarn test:cov` |
| Reset DB | `yarn seed:reset` (drops schema → runs migrations → runs seeds) |

## Verification order

`yarn lint` → `yarn build` → `yarn test` → `yarn test:e2e`

No standalone `typecheck` script exists. `yarn build` is the effective type-check gate.

## Package manager

**yarn** only. Lockfile: `yarn.lock`. Do not use npm.

## Path alias

`@/*` maps to `src/*` (configured in `tsconfig.json`).

## Architecture

Hexagonal architecture per module under `src/modules/`:

```
modules/
  <module>/
    domain/          # entities, interfaces, repositories, value-objects
    application/     # dtos, use-cases
    infrastructure/  # controllers, persistence (entities, mappers, repos), modules
```

Current modules: `users`, `auth`, `shared`.

Entry point: `src/main.ts` → `src/app/app.module.ts`

Global prefix: `/api`. Swagger docs: `/api/docs`.

## Auth

`JwtAuthGuard` + `RolesGuard` are registered as global guards in `SharedModule`. Every route requires JWT by default. Use the `@Public()` decorator (from `@/modules/shared`) to skip auth on specific handlers.

## Database

- **Engine**: PostgreSQL 16 via TypeORM
- **Entities registered** in both `DatabaseModule` (app runtime) and `data-source.ts` (CLI/migrations)
- **Migrations**: `src/infrastructure/database/migrations/`
- **Seeds**: `src/infrastructure/database/seeders/` — `MainSeeder` orchestrates `RolesSeeder` → `UsersSeeder`
- **Important**: `synchronize: false` always. Never enable in production.

### Migration workflow

```bash
yarn migration:generate src/infrastructure/database/migrations/<MigrationName>  # auto-generates from diff
yarn migration:run
yarn migration:revert
yarn migration:show
```

`migration:generate` requires a running PostgreSQL instance and uses `data-source.ts`.

## Environment

`.env.template` documents all required variables. Key groups:
- **DB**: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- **JWT**: `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN`
- **Seed**: `ADMIN_EMAIL`, `ADMIN_PASSWORD` (used by `UsersSeeder`)
- **App**: `NODE_ENV`, `PORT`, `API_PREFIX`, `CORS_ORIGIN`

## Comment Format

Standard comment conventions for this codebase:

**JSDoc blocks** — No special symbols. Title on first line, description after blank line:
```ts
/**
 * Título descriptivo
 *
 * Descripción detallada del propósito.
 */
```

**Inline comments** — Simple `//` without symbols:
```ts
// Descripción del paso
const result = await service.execute();
```

**Examples** — Use `@example` JSDoc tag:
```ts
/**
 * Descripción del método
 *
 * @example
 * const value = MyClass.create('input');
 */
```

## ESLint

Flat config (`eslint.config.mjs`). Notable rules:
- `@typescript-eslint/no-explicit-any`: off
- `@typescript-eslint/no-floating-promises`: warn
- `@typescript-eslint/no-unsafe-argument`: warn
- Prettier integrated via `eslint-plugin-prettier`

## Testing

- Unit tests: `src/**/*.spec.ts` (Jest, `ts-jest`)
- E2E tests: `test/**/*.e2e-spec.ts` (separate Jest config in `test/jest-e2e.json`)
- E2E tests boot a full NestJS app — they require a running PostgreSQL database

## Installed Skills

Skills installed locally for this project (in `.agents/skills/`):

| Skill | Purpose | Source |
|-------|---------|--------|
| `tdd` | Test-driven development methodology | mattpocock/skills |
| `nestjs-best-practices` | NestJS architecture patterns | kadajett/agent-nestjs-skills |

### How to use

When creating tests, follow both skill guidelines:

**From `tdd`:**
- Test at "seams" (public interfaces), not implementation details
- One behavior per test, named as a claim: `creates_user_when_email_unique`
- Arrange/Act/Assert structure
- Vertical slices: one test → one implementation → repeat

**From `nestjs-best-practices`:**
- Use `Test.createTestingModule` for isolated tests
- Mock repositories with SYMBOL tokens (`USER_REPOSITORY`, `ROLE_REPOSITORY`)
- Never call real external services in unit tests

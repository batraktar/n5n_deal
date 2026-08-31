# N5Deal Marketplace Prototype

N5Deal is a full-stack interview MVP for a marketplace connecting business sellers, qualified buyers, and platform managers around M&A opportunities.

## Current foundation

- Next.js App Router, TypeScript, Tailwind CSS, and ESLint.
- PostgreSQL data model through Prisma.
- Deterministic demo seed for Buyer, Seller, Admin, assets, and a message.
- Responsive public product shell and documented visual tokens.
- Vitest for boundary-level validation tests.

## Local setup

Requirements: Node 24 LTS or newer, pnpm 11, and Docker Desktop for the local PostgreSQL service.

```bash
pnpm install
cp .env.example .env
docker compose up -d postgres
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open `http://localhost:3000`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma and the seed script. |

The local default is included in `.env.example` and connects to the Compose service on port `5432`.

## Commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm db:validate
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

## Architecture

The application is a modular Next.js monolith. UI routes remain thin; future marketplace business logic will live under `features/`, while Prisma owns persistence under `prisma/` and `lib/db/` exposes the shared database client.

Initial entities are `User`, `BuyerProfile`, `Asset`, and `Message`. Prisma migrations are versioned in `prisma/migrations/` and the seed uses upserts so demo data can be run repeatedly.

## Deployment

Use a managed PostgreSQL provider and set `DATABASE_URL` in the deployment environment. Run `pnpm db:migrate` during deployment, then deploy the Next.js build with `pnpm build`.

## Next milestones

- Authentication and server-side role authorization.
- Seller asset management.
- Buyer profile, marketplace search, and messages.
- Admin moderation and the development-only `/goal` dashboard.

## AI tools

AI coding assistance was used for architecture exploration, implementation scaffolding, and verification planning. All changes were reviewed through Prisma validation, automated tests, linting, strict TypeScript checking, and a production build.

# N5Deal Marketplace MVP

N5Deal is a full-stack interview MVP for a marketplace of M&A opportunities and financial assets. Sellers publish business opportunities, buyers describe their investment preferences and discover relevant listings, and a platform manager reviews marketplace activity.

This prototype was built to demonstrate product thinking, pragmatic full-stack delivery, clear role boundaries, and maintainable TypeScript within a 24-hour interview assignment. It is not a production banking or transaction-processing system.

## Product features

### Seller

The seeded seller can:

- view their own listings at `/seller/dashboard`;
- create an asset at `/seller/assets/new`;
- edit an owned asset at `/seller/assets/[assetId]/edit`;
- set a listing to `DRAFT`, `PUBLISHED`, or `ARCHIVED`;
- browse, search, and filter active buyer profiles at `/seller/buyers`;
- view buyer interests, budget compatibility, and match reasons;
- send an internal message to a buyer.

The server derives the demo seller from the database and includes `sellerId` in every read and write query. A seller cannot edit or change the status of another seller's asset.

### Buyer

The seeded buyer can:

- view and edit an investment profile at `/buyer/profile`;
- specify company name, acquisition interests, industries, locations, budget range, and currency;
- see ranked recommendations at `/buyer/dashboard`;
- browse, search, and filter public listings at `/marketplace`;
- open an asset detail page and send a message to its seller.

Recommendations use a deterministic score out of 100:

- 35 points for an industry match;
- 20 points for a preferred location;
- 25 points for a compatible budget range in the same currency;
- 20 points when acquisition-interest keywords appear in the asset title or description.

Each recommendation exposes the reasons that contributed to its score. The matching service is isolated in `features/matching/` so it can later be replaced by a more advanced model without changing the page layer.

### Platform manager

The seeded admin can:

- review marketplace counts at `/admin`;
- search and filter users at `/admin/users`;
- suspend or reactivate users;
- search and filter assets at `/admin/assets`;
- change an asset's status for moderation, including archiving an inappropriate listing.

Admin actions derive the active admin account on the server. Role and record IDs submitted by a browser are never treated as authorization.

## Screenshots / demo

Screenshots are intentionally not committed because this repository currently contains no captured visual assets. For an interview submission, capture these states after starting the app and add them under `docs/screenshots/`:

- public marketplace with search and filters;
- asset details with contact form;
- seller dashboard and create/edit form;
- buyer recommendations with match reasons;
- admin overview and moderation tables.

The seeded demo accounts are selected server-side for this MVP:

| Role | Demo identity |
| --- | --- |
| Buyer | `buyer@n5deal.demo` |
| Seller | `seller@n5deal.demo` |
| Admin | `admin@n5deal.demo` |

There is no login screen in this prototype. Opening a role route uses its corresponding seeded demo identity.

## Technical architecture

N5Deal is a modular monolith. Next.js App Router owns the web application and server-rendered routes, feature modules hold business logic and server actions, and Prisma provides typed access to PostgreSQL.

```mermaid
flowchart TD
  Browser[Browser] --> Routes[Next.js App Router]
  Routes --> Components[Reusable React components]
  Routes --> Features[Feature modules and server actions]
  Features --> Prisma[Prisma ORM and PostgreSQL adapter]
  Prisma --> Database[(PostgreSQL)]
```

This shape is intentionally small for an interview MVP: it keeps data access on the server, makes role-specific logic easy to find, and avoids the operational cost of separate services. The feature boundaries leave room for future authentication, notifications, or a richer matching implementation.

## Project structure

```text
app/          Next.js App Router pages and route-level error states
components/   Reusable layout, UI, asset, seller, buyer, and admin components
features/     Marketplace business logic grouped by domain
lib/           Shared environment and Prisma client utilities
prisma/       Schema, migration, Prisma configuration, and seed script
tests/        Vitest tests for validation, matching, and authorization behavior
```

Important feature modules:

- `features/assets/` contains public listing queries and search parsing.
- `features/seller/` contains seller-owned asset queries, validation, and actions.
- `features/buyer/` contains profile persistence and recommendations.
- `features/matching/` contains the deterministic scoring algorithm.
- `features/messages/` contains buyer message validation, persistence, and actions.
- `features/admin/` contains moderation queries, filters, and actions.
- `features/i18n/` contains UI locale configuration and localized marketplace content access with English fallback.
- `features/auth/authorization.ts` contains the shared active-role policy.

## Technology stack

### Frontend

- Next.js 16 with App Router and React Server Components;
- React 19;
- TypeScript with strict compiler settings;
- Tailwind CSS 4 and project CSS tokens;
- React Hook Form for interactive seller and buyer forms.
- `next-intl` with English, Ukrainian, Polish, German, French, and Spanish UI catalogs.

### Backend

- Next.js server-rendered pages and Server Actions;
- Zod for boundary validation;
- Prisma Client with the PostgreSQL adapter;
- server-side ownership and role checks.

### Database

- PostgreSQL 16 for local development through Docker Compose;
- Prisma 7 schema and versioned migrations;
- idempotent seed data for buyer, seller, admin, assets, and an example message.

### Testing

- Vitest for fast unit tests;
- ESLint with the Next.js configuration;
- TypeScript compiler checks with `tsc --noEmit`;
- Next.js production build verification.

## Local development setup

### Requirements

- Node.js 22 or newer, as declared in `package.json`;
- pnpm 11;
- Docker Desktop for the local PostgreSQL container.

### Install and configure

```bash
pnpm install
cp .env.example .env
```

`.env.example` contains a local connection string for the Compose database. Do not commit `.env` or real credentials.

### Start PostgreSQL and initialize data

```bash
docker compose up -d postgres
pnpm db:migrate
pnpm db:seed
```

The seed uses upserts, so it can be run repeatedly while developing.

### Run the application

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful routes:

- `/marketplace` — public asset discovery;
- `/seller/dashboard` — seller asset management;
- `/seller/buyers` — buyer directory and seller outreach;
- `/buyer/dashboard` — buyer recommendations;
- `/buyer/profile` — buyer preferences;
- `/admin` — platform manager overview;
- `/admin/users` — participant management;
- `/admin/assets` — asset moderation.

## Environment variables

| Variable | Purpose | Example format |
| --- | --- | --- |
| `DATABASE_URL` | Required PostgreSQL connection string used by application queries and as the Prisma CLI fallback. Configure it as a Vercel secret in every deployed environment. | `postgresql://user:password@localhost:5432/database?schema=public` |
| `DIRECT_URL` | Optional direct PostgreSQL connection string for Prisma migration commands. When omitted, Prisma falls back to `DATABASE_URL`. | `postgresql://user:password@host:5432/database?schema=public` |

The committed `.env.example` uses the local Compose credentials. Production credentials must be supplied through the hosting provider's secret environment configuration and must never use a `NEXT_PUBLIC_` prefix.

## Database

The application uses PostgreSQL because marketplace records have explicit relationships and need consistent updates across users, assets, profiles, and messages. Prisma migrations in `prisma/migrations/` describe the database shape; `prisma/seed.ts` creates repeatable demo data.

Main entities:

- `User` — participant identity, role (`BUYER`, `SELLER`, `ADMIN`), and active/suspended status.
- `BuyerProfile` — one-to-one buyer preferences, industries, locations, budgets, and currency.
- `BuyerProfileTranslation` — locale-specific buyer interests, industries, and preferred locations.
- `Asset` — seller-owned opportunity with title, description, industry, valuation, location, revenue, and listing status.
- `AssetTranslation` — locale-specific asset title, description, industry, and location while preserving the core asset record and proper nouns.
- `Message` — buyer/seller communication optionally linked to an asset.

Relationships are enforced by Prisma foreign keys: a user owns assets, a buyer can have one profile, and messages reference sender, receiver, and optionally an asset. Asset deletion is restricted while related seller ownership exists; messages become asset-unlinked if an asset is removed by the database.

## Testing and quality checks

Run the full verification set:

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

The test suite currently covers 32 tests across 12 files, including:

- asset and buyer-profile validation;
- marketplace search parameter parsing;
- deterministic matching scores and transparent reasons;
- buyer message validation and buyer/seller authorization policy;
- admin-only and suspended-user authorization behavior;
- admin moderation command validation;
- environment configuration parsing.
- translation catalog completeness, locale fallback, and localized marketplace content handling.

The seller and admin persistence flows have also been exercised locally against PostgreSQL using the seeded database.

## Deployment

No public deployment is included in this submission.

The intended MVP deployment is Vercel connected to a managed PostgreSQL provider. Vercel runs `pnpm install`, whose `postinstall` script generates the Prisma Client from the checked-in `prisma.config.ts`, then runs `pnpm build`. Client generation does not require a live database connection; application requests do.

Set `DATABASE_URL` in Vercel for Production, Preview, and Development as appropriate. Add `DIRECT_URL` only when the provider exposes a separate direct connection for schema commands. Apply committed migrations before serving traffic with `pnpm db:deploy`; do not run development migrations or seed data during the Vercel build.

Authentication, database backups, monitoring, and a managed secret store are also required before real users or transactions are supported.

## Technical decisions

### Why Next.js?

Next.js provides the UI and server boundary in one project. App Router supports server-rendered data pages and Server Actions without introducing a separate API service, which is a strong fit for a time-boxed full-stack MVP.

### Why PostgreSQL?

Users, buyer profiles, assets, and messages have relational ownership and lifecycle rules. PostgreSQL gives the prototype durable persistence, constraints, indexes, and predictable query behavior.

### Why Prisma?

Prisma gives the TypeScript codebase generated types, readable query definitions, and versioned migrations. It keeps data access explicit while reducing hand-written SQL for this MVP.

### Why deterministic matching instead of external AI?

The matching score is predictable, explainable, inexpensive, and testable. Buyers can see why an asset matches, and the service can later be replaced with ML or LLM ranking without coupling the UI to an external provider.

### Why a modular monolith?

The product is small and shares one database and deployment. Keeping domain logic in feature modules provides separation of responsibilities without distributed-service complexity, network failure modes, or unnecessary infrastructure.

## AI tools usage

AI coding assistants were used for repository exploration, architecture discussion, implementation assistance, debugging, test scaffolding, and documentation review. Generated code was reviewed against the requirements, compiled, linted, tested, and exercised against a local PostgreSQL instance. Final technical decisions and code ownership remain with the developer.

## Assumptions and limitations

- Authentication is intentionally simplified to three seeded demo identities selected server-side by role-specific repositories.
- There are no sessions, passwords, payments, transaction execution, legal diligence, or document workflows.
- Messaging is an internal database record with a simple contact form; email notifications and conversation threads are not implemented.
- Matching is keyword and range based, not financial advice or an AI recommendation.
- Asset `ARCHIVED` is the MVP moderation/removal state; there is no separate review workflow.
- The `/goal` development dashboard and other future operational tooling are not part of the current implemented route set.

## Security considerations

- Zod validates user-controlled form and query input at server boundaries.
- Prisma parameterizes database queries, avoiding string-built SQL.
- Admin, buyer, and seller repositories derive the current demo identity on the server and verify active roles.
- Seller updates include the authenticated seller ID in the database predicate, preventing cross-seller modifications.
- Admin actions do not trust a client-supplied role and prevent the demo admin from suspending itself.
- Secrets belong in environment variables and are excluded from version control.

## License

This project is licensed under the [MIT License](LICENSE).

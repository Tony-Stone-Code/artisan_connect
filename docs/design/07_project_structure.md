# Deliverable 7: Project Structure & DevOps Plan

## 1. Monorepo Structure

We will use **npm workspaces** for a simple monorepo setup.

```text
artisanconnect-ghana/
├── apps/
│   ├── web/                  # Next.js 15 frontend
│   │   ├── app/              # App Router pages
│   │   ├── components/       # Shared UI components
│   │   │   └── ai/           # AI-specific UI (chat widget, bio generator)
│   │   ├── lib/              # Utilities, API client
│   │   └── styles/           # Global styles
│   └── api/                  # Express.js backend
│       ├── src/
│       │   ├── controllers/
│       │   ├── services/
│       │   │   └── ai/       # Groq-Only AI Service Module
│       │   │       ├── groq.client.ts
│       │   │       ├── prompts/
│       │   │       ├── ai.service.ts
│       │   │       ├── ai.logger.ts
│       │   │       └── ai.rate-limiter.ts
│       │   ├── middleware/
│       │   ├── routes/
│       │   ├── models/
│       │   ├── utils/
│       │   ├── websocket/    # Socket.io Server
│       │   └── email/        # Resend Email integration
│       └── prisma/           # Schema & migrations (if using Prisma) or pure SQL setup
├── packages/
│   └── shared/               # Shared TS types, constants, role enums
├── docs/
│   └── design/               # All design artifacts
├── supabase/                 # Supabase configuration & local dev
├── package.json              # npm workspaces root
└── docker-compose.yml        # Local development dependencies
```

## 2. Environment Configuration
Key environment variables required:
- `GROQ_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `MAPBOX_ACCESS_TOKEN`
- `RESEND_API_KEY`
- `SUPERADMIN_EMAIL`
- `SUPERADMIN_PASSWORD`

## 3. DevOps & Deployment Pipeline

- **Frontend Hosting:** Vercel
  - Automatically builds and deploys `apps/web` from the `main` branch.
- **Backend Hosting:** Railway
  - Automatically builds and deploys `apps/api` (Node.js + Socket.io) from `main`.
- **Database:** Supabase
  - Managed PostgreSQL instance with `pgvector` enabled.
- **CI/CD:** GitHub Actions
  - Runs linting, type-checking, and tests on Pull Requests.

## 4. Testing Strategy
- **Unit Tests:** Jest or Vitest for core backend services and AI logic.
- **API Tests:** Supertest to validate endpoints and middleware (RBAC).
- **E2E Tests:** Playwright for critical user journeys (Registration, Search, Quoting, Payment).

## 5. Security & Rate Limiting
- **Groq API Limits:** The backend AI service implements a strict rate limiter to stay within the 30 req/min free tier.
- **Supabase JWTs:** All protected routes validate JWTs using Supabase's provided secrets.
- **RBAC:** 4 tiers (Customer, Artisan, Admin, Superadmin) enforced strictly at the API gateway layer.

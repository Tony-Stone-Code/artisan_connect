# Deliverable 7 — Project Structure & DevOps Plan

> **ArtisanConnect Ghana** · AI-Powered Artisan Discovery Platform
> Version 1.0 · June 2026

---

## Table of Contents

1. [Complete Monorepo Structure](#1-complete-monorepo-structure)
2. [npm Workspaces Configuration](#2-npm-workspaces-configuration)
3. [Environment Configuration](#3-environment-configuration)
4. [Docker Compose — Local Dev](#4-docker-compose--local-dev)
5. [Deployment Pipeline](#5-deployment-pipeline)
6. [Testing Strategy](#6-testing-strategy)
7. [Superadmin Seed Script](#7-superadmin-seed-script)
8. [Development Workflow](#8-development-workflow)

---

## 1. Complete Monorepo Structure

The project uses an **npm workspaces monorepo** with two applications (`apps/web`, `apps/api`) and one shared library (`packages/shared`). Turborepo is deliberately excluded — npm workspaces provides sufficient orchestration for this project's scale.

```mermaid
graph TD
    Root["artisanconnect-ghana/"]
    Apps["apps/"]
    Packages["packages/"]
    Docs["docs/"]
    Infra["Infrastructure Files"]

    Root --> Apps
    Root --> Packages
    Root --> Docs
    Root --> Infra

    Apps --> Web["web/ - Next.js 15"]
    Apps --> API["api/ - Express.js"]
    Packages --> Shared["shared/ - Types + Constants"]
    Docs --> Design["design/ - Design Documents"]
    Infra --> Docker["docker-compose.yml"]
    Infra --> GHA[".github/workflows/"]
    Infra --> Supa["supabase/"]

    style Root fill:#1a1a2e,stroke:#e94560,color:#fff
    style Web fill:#0d7377,stroke:#14ffec,color:#fff
    style API fill:#7b2d8e,stroke:#f0a500,color:#fff
    style Shared fill:#2d6187,stroke:#78c4d4,color:#fff
```

### Full File Tree

```
artisanconnect-ghana/
│
├── apps/
│   ├── web/                                    # ── Next.js 15 Frontend ──
│   │   ├── app/                                # App Router (file-based routing)
│   │   │   ├── (auth)/                         # Auth route group
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx                # Email/password login
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx                # Customer/artisan registration
│   │   │   │   ├── forgot-password/
│   │   │   │   │   └── page.tsx                # Password reset request
│   │   │   │   ├── reset-password/
│   │   │   │   │   └── page.tsx                # Password reset confirmation
│   │   │   │   ├── verify-email/
│   │   │   │   │   └── page.tsx                # Email verification callback
│   │   │   │   └── layout.tsx                  # Centered card layout (no navbar)
│   │   │   │
│   │   │   ├── (onboarding)/                   # Artisan onboarding wizard
│   │   │   │   ├── step-1/
│   │   │   │   │   └── page.tsx                # Personal info + profile photo
│   │   │   │   ├── step-2/
│   │   │   │   │   └── page.tsx                # Service selection + specializations
│   │   │   │   ├── step-3/
│   │   │   │   │   └── page.tsx                # Location + Mapbox pin drop
│   │   │   │   ├── step-4/
│   │   │   │   │   └── page.tsx                # Portfolio upload + AI bio generation
│   │   │   │   ├── step-5/
│   │   │   │   │   └── page.tsx                # Availability setup + review
│   │   │   │   └── layout.tsx                  # Stepper layout with progress bar
│   │   │   │
│   │   │   ├── (customer)/                     # Customer-only pages
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx                # Overview: recent searches, active requests
│   │   │   │   ├── requests/
│   │   │   │   │   ├── page.tsx                # All service requests
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx            # Create new request
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx            # Request detail + quotes
│   │   │   │   ├── favorites/
│   │   │   │   │   └── page.tsx                # Saved artisans
│   │   │   │   ├── search-history/
│   │   │   │   │   └── page.tsx                # Past search queries
│   │   │   │   ├── messages/
│   │   │   │   │   └── page.tsx                # Chat inbox
│   │   │   │   ├── reviews/
│   │   │   │   │   └── page.tsx                # Reviews left by customer
│   │   │   │   ├── settings/
│   │   │   │   │   └── page.tsx                # Profile + notification prefs
│   │   │   │   └── layout.tsx                  # Customer sidebar layout
│   │   │   │
│   │   │   ├── (artisan)/                      # Artisan-only pages
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx                # AI insights, stats, job overview
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx                # Edit profile + AI bio regeneration
│   │   │   │   ├── portfolio/
│   │   │   │   │   └── page.tsx                # Manage portfolio items
│   │   │   │   ├── availability/
│   │   │   │   │   └── page.tsx                # Weekly schedule manager
│   │   │   │   ├── jobs/
│   │   │   │   │   ├── page.tsx                # Incoming requests
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx            # Job detail
│   │   │   │   ├── quotes/
│   │   │   │   │   ├── page.tsx                # All quotes sent
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx            # Quote detail
│   │   │   │   ├── messages/
│   │   │   │   │   └── page.tsx                # Chat inbox
│   │   │   │   ├── reviews/
│   │   │   │   │   └── page.tsx                # Reviews received
│   │   │   │   ├── verification/
│   │   │   │   │   └── page.tsx                # Verification status + document upload
│   │   │   │   ├── settings/
│   │   │   │   │   └── page.tsx                # Account + notification settings
│   │   │   │   └── layout.tsx                  # Artisan sidebar layout
│   │   │   │
│   │   │   ├── (admin)/                        # Admin-only pages
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx                # Platform metrics + charts
│   │   │   │   ├── verification/
│   │   │   │   │   ├── page.tsx                # Pending verifications queue
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx            # Review verification docs
│   │   │   │   ├── users/
│   │   │   │   │   ├── page.tsx                # User list + filters
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx            # User detail + actions
│   │   │   │   ├── moderation/
│   │   │   │   │   ├── page.tsx                # Flagged content queue
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx            # Review reported content
│   │   │   │   ├── audit-log/
│   │   │   │   │   └── page.tsx                # Admin action audit trail
│   │   │   │   ├── analytics/
│   │   │   │   │   └── page.tsx                # Search trends, user growth, etc.
│   │   │   │   ├── categories/
│   │   │   │   │   └── page.tsx                # Manage service categories + subcategories
│   │   │   │   └── layout.tsx                  # Admin sidebar layout
│   │   │   │
│   │   │   ├── (superadmin)/                   # Superadmin-only pages
│   │   │   │   ├── admin-management/
│   │   │   │   │   └── page.tsx                # Promote/demote admin users
│   │   │   │   ├── system-settings/
│   │   │   │   │   └── page.tsx                # Platform-wide config
│   │   │   │   └── layout.tsx                  # Superadmin layout (extends admin)
│   │   │   │
│   │   │   ├── search/                         # Public search
│   │   │   │   ├── page.tsx                    # Search form + AI-powered results
│   │   │   │   └── loading.tsx                 # Skeleton loader
│   │   │   │
│   │   │   ├── artisan/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx                # Public artisan profile
│   │   │   │
│   │   │   ├── page.tsx                        # Landing page (hero, categories, CTA)
│   │   │   ├── layout.tsx                      # Root layout (providers, fonts, metadata)
│   │   │   ├── loading.tsx                     # Global loading state
│   │   │   ├── error.tsx                       # Global error boundary
│   │   │   ├── not-found.tsx                   # 404 page
│   │   │   └── globals.css                     # Tailwind imports
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                             # ── ShadCN/UI Primitives ──
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── popover.tsx
│   │   │   │   ├── command.tsx
│   │   │   │   ├── calendar.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   └── tooltip.tsx
│   │   │   │
│   │   │   ├── ai/                             # ── AI-Specific Components ──
│   │   │   │   ├── chat-widget.tsx             # Floating AI assistant
│   │   │   │   ├── bio-generator.tsx           # AI bio generation with preview
│   │   │   │   ├── insights-card.tsx           # Artisan performance insights
│   │   │   │   ├── search-suggestions.tsx      # AI-powered search autocomplete
│   │   │   │   └── ai-loading-spinner.tsx      # Branded AI processing indicator
│   │   │   │
│   │   │   ├── maps/                           # ── Mapbox Components ──
│   │   │   │   ├── artisan-map.tsx             # Search results map view
│   │   │   │   ├── location-picker.tsx         # Pin-drop location selector
│   │   │   │   ├── map-marker.tsx              # Custom artisan marker
│   │   │   │   ├── distance-badge.tsx          # Distance from user badge
│   │   │   │   └── map-controls.tsx            # Zoom, fullscreen, layer toggle
│   │   │   │
│   │   │   ├── chat/                           # ── WebSocket Chat Components ──
│   │   │   │   ├── chat-window.tsx             # Full chat interface
│   │   │   │   ├── message-bubble.tsx          # Single message display
│   │   │   │   ├── message-input.tsx           # Text input + attachment
│   │   │   │   ├── conversation-list.tsx       # Sidebar conversation list
│   │   │   │   ├── typing-indicator.tsx        # "[User] is typing..."
│   │   │   │   ├── online-status.tsx           # Green dot presence indicator
│   │   │   │   └── image-preview.tsx           # Inline image preview in chat
│   │   │   │
│   │   │   └── shared/                         # ── Common Components ──
│   │   │       ├── navbar.tsx                  # Top navigation bar
│   │   │       ├── footer.tsx                  # Site footer
│   │   │       ├── sidebar.tsx                 # Dashboard sidebar
│   │   │       ├── breadcrumbs.tsx             # Page breadcrumb trail
│   │   │       ├── data-table.tsx              # Reusable data table with pagination
│   │   │       ├── file-upload.tsx             # Drag-drop file upload
│   │   │       ├── image-gallery.tsx           # Portfolio image grid
│   │   │       ├── rating-stars.tsx            # Star rating display + input
│   │   │       ├── empty-state.tsx             # No-data placeholder
│   │   │       ├── confirmation-dialog.tsx     # "Are you sure?" modal
│   │   │       ├── notification-bell.tsx       # Header notification dropdown
│   │   │       ├── search-bar.tsx              # Main search input
│   │   │       ├── artisan-card.tsx            # Artisan result card
│   │   │       ├── category-grid.tsx           # Category browsing grid
│   │   │       ├── stat-card.tsx               # Dashboard metric card
│   │   │       ├── pagination.tsx              # Page navigation
│   │   │       └── error-fallback.tsx          # Component-level error boundary
│   │   │
│   │   ├── hooks/                              # ── Custom React Hooks ──
│   │   │   ├── use-auth.ts                     # Supabase auth state management
│   │   │   ├── use-socket.ts                   # Socket.io connection hook
│   │   │   ├── use-chat.ts                     # Chat message management
│   │   │   ├── use-notifications.ts            # Real-time notification listener
│   │   │   ├── use-search.ts                   # Search with debounce + history
│   │   │   ├── use-location.ts                 # Geolocation + Mapbox geocoding
│   │   │   ├── use-media-upload.ts             # File upload with progress
│   │   │   ├── use-infinite-scroll.ts          # Infinite scroll pagination
│   │   │   ├── use-debounce.ts                 # Generic debounce hook
│   │   │   └── use-local-storage.ts            # Type-safe localStorage
│   │   │
│   │   ├── lib/                                # ── Utilities & Clients ──
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts                   # Browser Supabase client
│   │   │   │   ├── server.ts                   # Server-side Supabase client
│   │   │   │   └── middleware.ts               # Next.js middleware helper
│   │   │   ├── api-client.ts                   # Axios instance w/ interceptors
│   │   │   ├── socket-client.ts                # Socket.io client instance
│   │   │   ├── mapbox.ts                       # Mapbox GL JS initialization
│   │   │   ├── utils.ts                        # cn(), formatDate, etc.
│   │   │   ├── validations.ts                  # Zod schemas (client-side)
│   │   │   └── constants.ts                    # UI constants, breakpoints
│   │   │
│   │   ├── styles/                             # ── Global Styles ──
│   │   │   └── globals.css                     # Tailwind base + custom tokens
│   │   │
│   │   ├── providers/                          # ── React Context Providers ──
│   │   │   ├── auth-provider.tsx               # Supabase session context
│   │   │   ├── socket-provider.tsx             # Socket.io connection context
│   │   │   ├── theme-provider.tsx              # Dark/light mode (next-themes)
│   │   │   ├── toast-provider.tsx              # Toast notification provider
│   │   │   └── query-provider.tsx              # TanStack Query provider
│   │   │
│   │   ├── public/                             # ── Static Assets ──
│   │   │   ├── logo.svg
│   │   │   ├── og-image.png                    # Open Graph social preview
│   │   │   ├── favicon.ico
│   │   │   └── icons/                          # Category icons
│   │   │
│   │   ├── middleware.ts                       # Next.js middleware (auth redirect)
│   │   ├── next.config.ts                      # Next.js configuration
│   │   ├── tailwind.config.ts                  # Tailwind CSS configuration
│   │   ├── postcss.config.js                   # PostCSS configuration
│   │   ├── components.json                     # ShadCN/UI configuration
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                                    # ── Express.js Backend ──
│       ├── src/
│       │   ├── controllers/                    # ── Route Handlers ──
│       │   │   ├── auth.controller.ts          # Login, register, refresh, logout
│       │   │   ├── user.controller.ts          # Profile CRUD, role queries
│       │   │   ├── artisan.controller.ts       # Artisan profile operations
│       │   │   ├── search.controller.ts        # Semantic + filtered search
│       │   │   ├── verification.controller.ts  # Submit + review verification
│       │   │   ├── request.controller.ts       # Service request CRUD
│       │   │   ├── quote.controller.ts         # Quote create, accept, reject
│       │   │   ├── review.controller.ts        # Review CRUD + aggregation
│       │   │   ├── payment.controller.ts       # Payment processing
│       │   │   ├── message.controller.ts       # Message history retrieval
│       │   │   ├── notification.controller.ts  # Notification CRUD + mark-read
│       │   │   ├── availability.controller.ts  # Schedule management
│       │   │   ├── favorite.controller.ts      # Toggle + list favorites
│       │   │   ├── portfolio.controller.ts     # Portfolio item CRUD
│       │   │   ├── report.controller.ts        # Submit + review reports
│       │   │   ├── category.controller.ts      # Category + subcategory CRUD
│       │   │   ├── share.controller.ts         # Share link generation
│       │   │   ├── admin.controller.ts         # Admin dashboard + actions
│       │   │   ├── superadmin.controller.ts    # Admin management + system config
│       │   │   ├── ai.controller.ts            # AI endpoints (bio, search, insights)
│       │   │   ├── email.controller.ts         # Email trigger endpoints
│       │   │   └── media.controller.ts         # Upload + delete media
│       │   │
│       │   ├── services/                       # ── Business Logic Layer ──
│       │   │   ├── auth.service.ts             # Supabase Auth SDK wrapper
│       │   │   ├── user.service.ts             # User profile operations
│       │   │   ├── search.service.ts           # pgvector semantic search
│       │   │   ├── verification.service.ts     # Document review workflow
│       │   │   ├── payment.service.ts          # Payment state machine
│       │   │   ├── messaging.service.ts        # Message persistence + Socket emit
│       │   │   ├── notification.service.ts     # Multi-channel notifications
│       │   │   ├── availability.service.ts     # Schedule conflict detection
│       │   │   ├── quoting.service.ts          # Quote lifecycle management
│       │   │   ├── media.service.ts            # Supabase Storage operations
│       │   │   ├── moderation.service.ts       # Content flagging + review
│       │   │   ├── admin.service.ts            # Platform analytics + admin ops
│       │   │   └── ai/                         # ── AI Service Module ──
│       │   │       ├── groq.client.ts          # Groq SDK wrapper + retry logic
│       │   │       ├── ai.service.ts           # AI orchestration layer
│       │   │       ├── ai.logger.ts            # Token usage + latency tracking
│       │   │       ├── ai.rate-limiter.ts      # 30 req/min token bucket
│       │   │       └── prompts/                # ── LLM Prompt Templates ──
│       │   │           ├── bio-generation.ts       # Artisan bio from portfolio
│       │   │           ├── search-enhancement.ts   # NL to structured query
│       │   │           ├── review-summary.ts       # Aggregate review insights
│       │   │           ├── category-matching.ts    # Fuzzy category resolution
│       │   │           ├── quote-suggestion.ts     # Smart pricing assistance
│       │   │           ├── moderation-check.ts     # Content safety screening
│       │   │           ├── portfolio-caption.ts    # AI image descriptions
│       │   │           └── artisan-insights.ts     # Performance analytics
│       │   │
│       │   ├── middleware/                     # ── Express Middleware ──
│       │   │   ├── auth.middleware.ts          # Supabase JWT verification
│       │   │   ├── rbac.middleware.ts          # 4-tier role authorization
│       │   │   ├── rate-limit.middleware.ts    # express-rate-limit config
│       │   │   ├── audit.middleware.ts         # Auto-log admin actions
│       │   │   ├── upload.middleware.ts        # Multer file upload config
│       │   │   ├── validation.middleware.ts    # Zod schema validation
│       │   │   ├── cors.middleware.ts          # CORS configuration
│       │   │   └── error.middleware.ts         # Global error handler
│       │   │
│       │   ├── routes/                         # ── API Route Definitions ──
│       │   │   ├── index.ts                   # Route aggregator + /health
│       │   │   ├── auth.routes.ts             # POST /auth/login, /auth/register, ...
│       │   │   ├── user.routes.ts             # GET/PUT /users/me, GET /users/:id
│       │   │   ├── artisan.routes.ts          # GET/PUT /artisans/:id
│       │   │   ├── search.routes.ts           # GET /search, GET /search/suggestions
│       │   │   ├── verification.routes.ts     # POST /verification/submit, ...
│       │   │   ├── request.routes.ts          # CRUD /requests
│       │   │   ├── quote.routes.ts            # CRUD /quotes
│       │   │   ├── review.routes.ts           # CRUD /reviews
│       │   │   ├── payment.routes.ts          # POST /payments/initiate, ...
│       │   │   ├── message.routes.ts          # GET /messages/:conversationId
│       │   │   ├── notification.routes.ts     # GET/PUT /notifications
│       │   │   ├── availability.routes.ts     # CRUD /availability
│       │   │   ├── favorite.routes.ts         # POST/DELETE/GET /favorites
│       │   │   ├── portfolio.routes.ts        # CRUD /portfolio
│       │   │   ├── report.routes.ts           # POST /reports, GET /reports (admin)
│       │   │   ├── category.routes.ts         # CRUD /categories
│       │   │   ├── share.routes.ts            # POST /share/:artisanId
│       │   │   ├── admin.routes.ts            # Admin-only endpoints
│       │   │   ├── superadmin.routes.ts       # Superadmin-only endpoints
│       │   │   ├── ai.routes.ts               # POST /ai/bio, /ai/search, ...
│       │   │   ├── email.routes.ts            # Internal email triggers
│       │   │   └── media.routes.ts            # POST/DELETE /media
│       │   │
│       │   ├── models/                        # ── Data Types ──
│       │   │   ├── index.ts                   # Re-exports all types
│       │   │   ├── prisma-types.ts            # Re-export Prisma generated types
│       │   │   └── custom-types.ts            # API-specific DTOs
│       │   │
│       │   ├── utils/                         # ── Utility Functions ──
│       │   │   ├── logger.ts                  # Winston / pino logger
│       │   │   ├── response.ts                # Standardized API response helper
│       │   │   ├── pagination.ts              # Offset/cursor pagination helpers
│       │   │   ├── date.ts                    # Date formatting + timezone
│       │   │   ├── crypto.ts                  # Hash, token generation
│       │   │   └── ghana-regions.ts           # Ghana region/city constants
│       │   │
│       │   ├── websocket/                     # ── Socket.io Server ──
│       │   │   ├── socket.ts                  # Socket.io initialization + namespaces
│       │   │   ├── handlers/
│       │   │   │   ├── chat.handler.ts        # Message send/receive events
│       │   │   │   ├── notification.handler.ts # Real-time notification push
│       │   │   │   ├── presence.handler.ts    # Online/offline tracking
│       │   │   │   └── typing.handler.ts      # Typing indicator events
│       │   │   └── middleware/
│       │   │       └── socket-auth.ts         # JWT auth for WS connections
│       │   │
│       │   ├── email/                         # ── Email Service ──
│       │   │   ├── email.service.ts           # Resend SDK wrapper
│       │   │   └── templates/                 # HTML email templates
│       │   │       ├── welcome.html           # New user welcome
│       │   │       ├── verification-approved.html  # Artisan verified
│       │   │       ├── verification-rejected.html  # Verification denied
│       │   │       ├── new-quote.html         # Customer receives quote
│       │   │       ├── quote-accepted.html    # Artisan notified of acceptance
│       │   │       ├── new-review.html        # Artisan receives review
│       │   │       └── password-reset.html    # Password reset link
│       │   │
│       │   ├── config/                        # ── Configuration ──
│       │   │   ├── env.ts                     # Environment variable validation (Zod)
│       │   │   ├── database.ts                # Prisma client singleton
│       │   │   ├── supabase.ts                # Supabase admin client
│       │   │   └── cors.ts                    # Allowed origins config
│       │   │
│       │   └── app.ts                         # Express app entry point
│       │
│       ├── prisma/                            # ── Prisma ORM ──
│       │   ├── schema.prisma                  # Full schema (21 tables)
│       │   ├── migrations/                    # Prisma migration history
│       │   │   └── .gitkeep
│       │   └── seed.ts                        # Superadmin + categories seed
│       │
│       ├── tests/                             # ── API Tests ──
│       │   ├── unit/
│       │   │   ├── services/
│       │   │   │   ├── auth.service.test.ts
│       │   │   │   ├── search.service.test.ts
│       │   │   │   ├── ai.service.test.ts
│       │   │   │   └── ...
│       │   │   └── middleware/
│       │   │       ├── auth.middleware.test.ts
│       │   │       ├── rbac.middleware.test.ts
│       │   │       └── ...
│       │   ├── integration/
│       │   │   ├── auth.test.ts
│       │   │   ├── search.test.ts
│       │   │   ├── verification.test.ts
│       │   │   └── ...
│       │   ├── helpers/
│       │   │   ├── test-db.ts                 # Test database setup/teardown
│       │   │   ├── factories.ts               # Test data factories
│       │   │   └── mocks.ts                   # Service mocks
│       │   └── setup.ts                       # Vitest global setup
│       │
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   └── shared/                                # ── Shared Library ──
│       ├── types/                             # Shared TypeScript types
│       │   ├── user.types.ts                  # User, ArtisanProfile types
│       │   ├── search.types.ts                # SearchQuery, SearchResult
│       │   ├── message.types.ts               # Message, Conversation
│       │   ├── notification.types.ts          # Notification types + payloads
│       │   ├── quote.types.ts                 # Quote, QuoteStatus
│       │   ├── review.types.ts                # Review, ReviewStats
│       │   ├── category.types.ts              # Category, Subcategory
│       │   ├── availability.types.ts          # TimeSlot, WeeklySchedule
│       │   ├── api.types.ts                   # ApiResponse<T>, PaginatedResponse
│       │   ├── socket.types.ts                # Socket event names + payloads
│       │   └── index.ts                       # Barrel export
│       ├── constants/                         # Shared constants
│       │   ├── roles.ts                       # UserRole enum + permissions map
│       │   ├── status.ts                      # VerificationStatus, QuoteStatus enums
│       │   ├── categories.ts                  # Default category list
│       │   ├── regions.ts                     # Ghana regions enum
│       │   ├── socket-events.ts               # Socket event name constants
│       │   ├── error-codes.ts                 # Standardized error codes
│       │   └── index.ts                       # Barrel export
│       ├── package.json
│       └── tsconfig.json
│
├── docs/                                      # ── Documentation ──
│   └── design/
│       ├── 01-prd.md                          # Product Requirements
│       ├── 02-features.md                     # Feature Specifications
│       ├── 03-tech-stack.md                   # Technology Stack
│       ├── 04-api-endpoints.md                # API Reference
│       ├── 05-database-schema.md              # Database Design
│       ├── 06-ai-integration.md               # AI/Groq Integration
│       ├── 07-project-structure.md            # This document
│       └── 08-implementation-plan.md          # Sprint plan
│
├── supabase/                                  # ── Supabase Local Dev Config ──
│   ├── config.toml                            # Supabase CLI configuration
│   └── migrations/                            # SQL migrations (RLS, functions)
│       ├── 00001_enable_pgvector.sql
│       ├── 00002_rls_policies.sql
│       └── .gitkeep
│
├── .github/                                   # ── GitHub Configuration ──
│   ├── workflows/
│   │   ├── ci.yml                             # Lint + test + build
│   │   └── deploy.yml                         # Deploy to Vercel + Railway
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
│
├── .env.example                               # Environment variable template
├── .gitignore
├── .eslintrc.json                             # ESLint configuration
├── .prettierrc                                # Prettier configuration
├── docker-compose.yml                         # Local dev PostgreSQL + pgvector
├── package.json                               # npm workspaces root
├── turbo.json                                 # Placeholder (not used, npm only)
├── LICENSE
└── README.md                                  # Project overview + quickstart
```

### Dependency Graph

```mermaid
graph LR
    Web["apps/web<br/>Next.js 15"]
    API["apps/api<br/>Express.js"]
    Shared["packages/shared<br/>Types + Constants"]

    Web -->|imports types| Shared
    API -->|imports types| Shared
    Web -->|HTTP + WebSocket| API
    API -->|Prisma ORM| DB["PostgreSQL<br/>+ pgvector"]
    API -->|SDK| Groq["Groq API"]
    API -->|SDK| Resend["Resend Email"]
    API -->|SDK| Supabase["Supabase Auth<br/>+ Storage"]
    Web -->|SDK| SupaClient["Supabase Auth<br/>Client"]
    Web -->|GL JS| Mapbox["Mapbox"]

    style Web fill:#0d7377,stroke:#14ffec,color:#fff
    style API fill:#7b2d8e,stroke:#f0a500,color:#fff
    style Shared fill:#2d6187,stroke:#78c4d4,color:#fff
    style DB fill:#336791,stroke:#fff,color:#fff
```

---

## 2. npm Workspaces Configuration

### Root `package.json`

```jsonc
{
  "name": "artisanconnect-ghana",
  "version": "1.0.0",
  "private": true,
  "description": "AI-powered artisan discovery platform for Ghana",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    // ─── Development ───
    "dev": "npm run dev --workspaces --if-present",
    "dev:web": "npm run dev -w apps/web",
    "dev:api": "npm run dev -w apps/api",

    // ─── Build ───
    "build": "npm run build --workspaces --if-present",
    "build:web": "npm run build -w apps/web",
    "build:api": "npm run build -w apps/api",

    // ─── Testing ───
    "test": "npm run test --workspaces --if-present",
    "test:api": "npm run test -w apps/api",
    "test:web": "npm run test -w apps/web",
    "test:e2e": "npm run test:e2e -w apps/web",
    "test:coverage": "npm run test:coverage --workspaces --if-present",

    // ─── Code Quality ───
    "lint": "npm run lint --workspaces --if-present",
    "lint:fix": "npm run lint:fix --workspaces --if-present",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,md}\"",
    "typecheck": "npm run typecheck --workspaces --if-present",

    // ─── Database ───
    "db:generate": "npm run db:generate -w apps/api",
    "db:migrate": "npm run db:migrate -w apps/api",
    "db:push": "npm run db:push -w apps/api",
    "db:seed": "npm run db:seed -w apps/api",
    "db:studio": "npm run db:studio -w apps/api",
    "db:reset": "npm run db:reset -w apps/api",

    // ─── Utilities ───
    "clean": "npm run clean --workspaces --if-present && rm -rf node_modules",
    "postinstall": "npm run db:generate"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "prettier": "^3.3.0",
    "typescript": "^5.5.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

### `apps/web/package.json`

```jsonc
{
  "name": "@artisanconnect/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "clean": "rm -rf .next out"
  },
  "dependencies": {
    // ── Framework ──
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",

    // ── Internal ──
    "@artisanconnect/shared": "*",

    // ── UI ──
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "@radix-ui/react-tooltip": "^1.1.0",
    "@radix-ui/react-popover": "^1.1.0",
    "@radix-ui/react-scroll-area": "^1.2.0",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-progress": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.4.0",
    "lucide-react": "^0.400.0",
    "cmdk": "^1.0.0",
    "next-themes": "^0.3.0",

    // ── Data Fetching ──
    "@tanstack/react-query": "^5.50.0",
    "axios": "^1.7.0",

    // ── Forms ──
    "react-hook-form": "^7.52.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.23.0",

    // ── Maps ──
    "mapbox-gl": "^3.5.0",
    "react-map-gl": "^7.1.0",

    // ── Real-time ──
    "socket.io-client": "^4.7.0",
    "@supabase/supabase-js": "^2.44.0",
    "@supabase/ssr": "^0.4.0",

    // ── Utilities ──
    "date-fns": "^3.6.0",
    "sonner": "^1.5.0",
    "react-dropzone": "^14.2.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@playwright/test": "^1.45.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.6.0",
    "eslint-config-next": "^15.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0",
    "vitest": "^2.0.0"
  }
}
```

### `apps/api/package.json`

```jsonc
{
  "name": "@artisanconnect/api",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "build": "tsc && tsc-alias",
    "start": "node dist/app.js",
    "lint": "eslint src/ --ext .ts",
    "lint:fix": "eslint src/ --ext .ts --fix",
    "typecheck": "tsc --noEmit",

    // ── Testing ──
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",

    // ── Database ──
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset",

    "clean": "rm -rf dist"
  },
  "dependencies": {
    // ── Framework ──
    "express": "^4.19.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "morgan": "^1.10.0",

    // ── Internal ──
    "@artisanconnect/shared": "*",

    // ── Database ──
    "@prisma/client": "^5.16.0",
    "pgvector": "^0.2.0",

    // ── Auth ──
    "@supabase/supabase-js": "^2.44.0",

    // ── AI ──
    "groq-sdk": "^0.5.0",

    // ── Real-time ──
    "socket.io": "^4.7.0",

    // ── Email ──
    "resend": "^3.4.0",

    // ── Validation ──
    "zod": "^3.23.0",

    // ── File Uploads ──
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.33.0",

    // ── Rate Limiting ──
    "express-rate-limit": "^7.3.0",

    // ── Utilities ──
    "uuid": "^10.0.0",
    "date-fns": "^3.6.0",
    "winston": "^3.13.0",
    "dotenv": "^16.4.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/compression": "^1.7.0",
    "@types/morgan": "^1.9.0",
    "@types/multer": "^1.4.0",
    "@types/uuid": "^10.0.0",
    "eslint": "^9.6.0",
    "@typescript-eslint/eslint-plugin": "^7.16.0",
    "@typescript-eslint/parser": "^7.16.0",
    "prisma": "^5.16.0",
    "supertest": "^7.0.0",
    "@types/supertest": "^6.0.0",
    "tsx": "^4.16.0",
    "tsc-alias": "^1.8.0",
    "typescript": "^5.5.0",
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0"
  }
}
```

### `packages/shared/package.json`

```jsonc
{
  "name": "@artisanconnect/shared",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    "./types": "./dist/types/index.js",
    "./constants": "./dist/constants/index.js"
  },
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "typescript": "^5.5.0"
  }
}
```

### Common Commands

| Task | Command | Scope |
|---|---|---|
| Install all deps | `npm install` | Root (hoists all) |
| Dev — all | `npm run dev` | Web + API + Shared |
| Dev — frontend only | `npm run dev:web` | Web only |
| Dev — backend only | `npm run dev:api` | API only |
| Build all | `npm run build` | All workspaces |
| Run all tests | `npm run test` | All workspaces |
| Lint all | `npm run lint` | All workspaces |
| Format all | `npm run format` | All files |
| Type-check all | `npm run typecheck` | All workspaces |
| Generate Prisma | `npm run db:generate` | API |
| Run migrations | `npm run db:migrate` | API |
| Seed database | `npm run db:seed` | API |
| Open Prisma Studio | `npm run db:studio` | API |
| Add dep to web | `npm install <pkg> -w apps/web` | Web |
| Add dep to api | `npm install <pkg> -w apps/api` | API |
| Clean everything | `npm run clean` | All + root node_modules |

---

## 3. Environment Configuration

### Environment Variable Inventory

| Variable | Used By | Required | Description |
|---|---|---|---|
| `DATABASE_URL` | API | ✅ | PostgreSQL connection string (Supabase or local) |
| `DIRECT_URL` | API | ✅ | Direct DB URL (bypasses connection pooler for migrations) |
| `GROQ_API_KEY` | API | ✅ | Groq API key for LLM + embeddings |
| `SUPABASE_URL` | API | ✅ | Supabase project URL |
| `SUPABASE_ANON_KEY` | API | ✅ | Supabase anon/public key |
| `SUPABASE_SERVICE_KEY` | API | ✅ | Supabase service role key (admin operations) |
| `JWT_SECRET` | API | ✅ | Supabase JWT secret (token verification) |
| `RESEND_API_KEY` | API | ✅ | Resend API key for transactional email |
| `RESEND_FROM_EMAIL` | API | ✅ | Sender email address (e.g., noreply@artisanconnect.gh) |
| `MAPBOX_ACCESS_TOKEN` | API | ✅ | Server-side Mapbox token (geocoding) |
| `SUPERADMIN_EMAIL` | API | ✅ | Initial superadmin email for seed script |
| `SUPERADMIN_PASSWORD` | API | ✅ | Initial superadmin password for seed script |
| `PORT` | API | ❌ | API server port (default: 4000) |
| `NODE_ENV` | Both | ❌ | `development` / `production` / `test` |
| `CORS_ORIGIN` | API | ❌ | Allowed origin for CORS (default: http://localhost:3000) |
| `RATE_LIMIT_WINDOW_MS` | API | ❌ | Rate limit window in ms (default: 60000) |
| `RATE_LIMIT_MAX_REQUESTS` | API | ❌ | Max requests per window (default: 100) |
| `LOG_LEVEL` | API | ❌ | Logging level (default: info) |
| `NEXT_PUBLIC_API_URL` | Web | ✅ | Backend API URL (e.g., http://localhost:4000/api) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Web | ✅ | Client-side Mapbox access token |
| `NEXT_PUBLIC_SUPABASE_URL` | Web | ✅ | Supabase project URL (client-side) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Web | ✅ | Supabase anon key (client-side) |
| `NEXT_PUBLIC_SOCKET_URL` | Web | ✅ | WebSocket server URL |
| `NEXT_PUBLIC_APP_URL` | Web | ❌ | Frontend app URL (for OG tags, share links) |

### `.env.example`

```bash
# ═══════════════════════════════════════════════════════════════════════════════
#  ArtisanConnect Ghana — Environment Variables
# ═══════════════════════════════════════════════════════════════════════════════
#  Copy this file to .env and fill in your values:
#    cp .env.example .env
#
#  NEVER commit the .env file to version control.
# ═══════════════════════════════════════════════════════════════════════════════

# ─── Database (PostgreSQL + pgvector) ────────────────────────────────────────
# For local dev with Docker: postgresql://postgres:postgres@localhost:5432/artisanconnect
# For Supabase: copy from Supabase Dashboard > Settings > Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/artisanconnect"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/artisanconnect"

# ─── Supabase ────────────────────────────────────────────────────────────────
# Dashboard > Settings > API
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_KEY="eyJ..."

# Dashboard > Settings > API > JWT Secret
JWT_SECRET="your-jwt-secret"

# ─── Groq AI ─────────────────────────────────────────────────────────────────
# https://console.groq.com/keys
GROQ_API_KEY="gsk_..."

# ─── Mapbox ──────────────────────────────────────────────────────────────────
# https://account.mapbox.com/access-tokens/
MAPBOX_ACCESS_TOKEN="pk.eyJ..."

# ─── Resend (Email) ──────────────────────────────────────────────────────────
# https://resend.com/api-keys
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@artisanconnect.gh"

# ─── Superadmin Seed ─────────────────────────────────────────────────────────
SUPERADMIN_EMAIL="admin@artisanconnect.gh"
SUPERADMIN_PASSWORD="CHANGE_ME_in_production_2024!"

# ─── API Server ──────────────────────────────────────────────────────────────
PORT=4000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
LOG_LEVEL="debug"

# ─── Rate Limiting ───────────────────────────────────────────────────────────
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# ─── Next.js Public Variables (NEXT_PUBLIC_ prefix = exposed to browser) ─────
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ..."
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
NEXT_PUBLIC_SOCKET_URL="http://localhost:4000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Environment Validation (Zod)

The API validates all environment variables at startup using Zod to fail fast on misconfiguration:

```typescript
// apps/api/src/config/env.ts
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32),

  // Groq
  GROQ_API_KEY: z.string().startsWith('gsk_'),

  // Mapbox
  MAPBOX_ACCESS_TOKEN: z.string().startsWith('pk.'),

  // Resend
  RESEND_API_KEY: z.string().startsWith('re_'),
  RESEND_FROM_EMAIL: z.string().email(),

  // Superadmin
  SUPERADMIN_EMAIL: z.string().email(),
  SUPERADMIN_PASSWORD: z.string().min(12),

  // Server
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
```

### Environment Flow by Deployment Target

```mermaid
flowchart LR
    subgraph Local["Local Development"]
        EnvFile[".env file"]
        Docker["Docker Compose<br/>PostgreSQL"]
    end

    subgraph CI["GitHub Actions"]
        Secrets["GitHub Secrets"]
    end

    subgraph Prod["Production"]
        VercelEnv["Vercel<br/>Environment Variables"]
        RailwayEnv["Railway<br/>Environment Variables"]
        SupaManaged["Supabase<br/>Managed DB"]
    end

    EnvFile --> Web["Next.js Dev"]
    EnvFile --> API["Express Dev"]
    Docker --> API

    Secrets --> Tests["CI Tests"]
    Secrets --> BuildCI["CI Build"]

    VercelEnv --> WebProd["Next.js Prod"]
    RailwayEnv --> APIProd["Express Prod"]
    SupaManaged --> APIProd

    style Local fill:#1a1a2e,stroke:#e94560,color:#fff
    style CI fill:#2d6187,stroke:#78c4d4,color:#fff
    style Prod fill:#0d7377,stroke:#14ffec,color:#fff
```

---

## 4. Docker Compose — Local Dev

The Docker Compose setup provides a local PostgreSQL instance with the `pgvector` extension pre-installed, matching the production Supabase environment.

### `docker-compose.yml`

```yaml
# ═══════════════════════════════════════════════════════════════════════════════
#  ArtisanConnect Ghana — Local Development Infrastructure
# ═══════════════════════════════════════════════════════════════════════════════
#  Usage:
#    docker compose up -d          # Start services
#    docker compose down           # Stop services
#    docker compose down -v        # Stop + delete volumes (reset data)
# ═══════════════════════════════════════════════════════════════════════════════

version: "3.9"

services:
  # ─── PostgreSQL + pgvector ──────────────────────────────────────────────────
  postgres:
    image: pgvector/pgvector:pg16
    container_name: artisanconnect-db
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: artisanconnect
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./supabase/migrations:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d artisanconnect"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # ─── pgAdmin (optional — database GUI) ─────────────────────────────────────
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: artisanconnect-pgadmin
    restart: unless-stopped
    ports:
      - "5050:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@artisanconnect.gh
      PGADMIN_DEFAULT_PASSWORD: admin
      PGADMIN_CONFIG_SERVER_MODE: "False"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      postgres:
        condition: service_healthy
    profiles:
      - tools    # Only starts with: docker compose --profile tools up

volumes:
  pgdata:
    driver: local
  pgadmin_data:
    driver: local
```

### pgvector Initialization

The `pgvector/pgvector:pg16` image includes the pgvector extension. It is enabled via the first Supabase migration:

```sql
-- supabase/migrations/00001_enable_pgvector.sql
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify installation
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
    RAISE EXCEPTION 'pgvector extension not available';
  END IF;
END $$;
```

### Docker Commands Quick Reference

| Task | Command |
|---|---|
| Start database | `docker compose up -d` |
| Start with pgAdmin | `docker compose --profile tools up -d` |
| View logs | `docker compose logs -f postgres` |
| Stop services | `docker compose down` |
| Reset all data | `docker compose down -v` |
| Connect via psql | `docker exec -it artisanconnect-db psql -U postgres -d artisanconnect` |
| pgAdmin URL | http://localhost:5050 |

---

## 5. Deployment Pipeline

### Architecture Overview

```mermaid
flowchart TD
    Dev["Developer"]
    GH["GitHub Repository"]
    GHA["GitHub Actions"]

    Dev -->|"git push"| GH
    GH -->|"trigger"| GHA

    subgraph CI["CI Pipeline"]
        Lint["Lint + Format Check"]
        TypeCheck["TypeScript Check"]
        Test["Unit + Integration Tests"]
        Build["Build All"]
        Lint --> TypeCheck --> Test --> Build
    end

    GHA --> CI

    subgraph Deploy["Deployment Targets"]
        Vercel["Vercel<br/>Next.js Frontend"]
        Railway["Railway<br/>Express.js API"]
        SupaDeploy["Supabase<br/>Managed Database"]
    end

    Build -->|"main branch"| Vercel
    Build -->|"main branch"| Railway

    subgraph VercelDetail["Vercel Config"]
        VRoot["Root: apps/web"]
        VBuild["Build: next build"]
        VEnv["Env vars from Vercel Dashboard"]
    end

    subgraph RailwayDetail["Railway Config"]
        RRoot["Root: apps/api"]
        RBuild["Build: npm run build"]
        RStart["Start: npm run start"]
        REnv["Env vars from Railway Dashboard"]
    end

    Vercel --> VercelDetail
    Railway --> RailwayDetail

    style CI fill:#1a1a2e,stroke:#e94560,color:#fff
    style Deploy fill:#0d7377,stroke:#14ffec,color:#fff
```

### Deployment Target Configuration

| Target | Service | Root Directory | Build Command | Start Command |
|---|---|---|---|---|
| **Frontend** | Vercel | `apps/web` | `cd ../.. && npm install && npm run build:web` | Auto (Next.js) |
| **Backend** | Railway | `apps/api` | `cd ../.. && npm install && npm run build:api` | `npm run start -w apps/api` |
| **Database** | Supabase | N/A | N/A | Managed |

### Vercel Configuration

```jsonc
// apps/web/vercel.json (optional — Vercel auto-detects Next.js)
{
  "framework": "nextjs",
  "installCommand": "cd ../.. && npm install",
  "buildCommand": "cd ../.. && npm run build:web",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_API_URL": "@next_public_api_url",
    "NEXT_PUBLIC_MAPBOX_TOKEN": "@next_public_mapbox_token",
    "NEXT_PUBLIC_SUPABASE_URL": "@next_public_supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@next_public_supabase_anon_key",
    "NEXT_PUBLIC_SOCKET_URL": "@next_public_socket_url",
    "NEXT_PUBLIC_APP_URL": "@next_public_app_url"
  }
}
```

### Railway Configuration

```toml
# apps/api/railway.toml
[build]
builder = "NIXPACKS"
buildCommand = "cd ../.. && npm install && npm run build:api"

[deploy]
startCommand = "cd ../.. && npm run start -w apps/api"
healthcheckPath = "/api/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

### GitHub Actions CI Workflow

```yaml
# .github/workflows/ci.yml
# ═══════════════════════════════════════════════════════════════════════════════
#  ArtisanConnect Ghana — Continuous Integration
# ═══════════════════════════════════════════════════════════════════════════════

name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: "20"

jobs:
  # ─── Lint & Format ──────────────────────────────────────────────────────────
  lint:
    name: Lint & Format
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Check formatting
        run: npm run format:check

      - name: Lint
        run: npm run lint

  # ─── Type Check ─────────────────────────────────────────────────────────────
  typecheck:
    name: TypeScript Check
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: npm run db:generate

      - name: Type check
        run: npm run typecheck

  # ─── Unit & Integration Tests ───────────────────────────────────────────────
  test:
    name: Tests
    runs-on: ubuntu-latest
    needs: typecheck

    services:
      postgres:
        image: pgvector/pgvector:pg16
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: artisanconnect_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U postgres"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/artisanconnect_test
      DIRECT_URL: postgresql://postgres:postgres@localhost:5432/artisanconnect_test
      NODE_ENV: test
      GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
      SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
      SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
      RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
      RESEND_FROM_EMAIL: test@artisanconnect.gh
      MAPBOX_ACCESS_TOKEN: ${{ secrets.MAPBOX_ACCESS_TOKEN }}
      SUPERADMIN_EMAIL: test-admin@artisanconnect.gh
      SUPERADMIN_PASSWORD: TestPassword123456!

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: npm run db:generate

      - name: Run migrations
        run: npx prisma migrate deploy --schema apps/api/prisma/schema.prisma

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Upload coverage report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: apps/api/coverage/

  # ─── Build ──────────────────────────────────────────────────────────────────
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: npm run db:generate

      - name: Build all workspaces
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: https://api.artisanconnect.gh
          NEXT_PUBLIC_MAPBOX_TOKEN: ${{ secrets.NEXT_PUBLIC_MAPBOX_TOKEN }}
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_SOCKET_URL: https://api.artisanconnect.gh
          NEXT_PUBLIC_APP_URL: https://artisanconnect.gh
```

### GitHub Actions Deploy Workflow

```yaml
# .github/workflows/deploy.yml
# ═══════════════════════════════════════════════════════════════════════════════
#  ArtisanConnect Ghana — Deployment
# ═══════════════════════════════════════════════════════════════════════════════

name: Deploy

on:
  push:
    branches: [main]

concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false    # Never cancel in-flight deploys

jobs:
  # ─── Deploy Database Migrations ─────────────────────────────────────────────
  migrate:
    name: Run Migrations
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: npm run db:generate

      - name: Deploy migrations
        run: npx prisma migrate deploy --schema apps/api/prisma/schema.prisma
        env:
          DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
          DIRECT_URL: ${{ secrets.PROD_DIRECT_URL }}

  # ─── Deploy Backend to Railway ──────────────────────────────────────────────
  deploy-api:
    name: Deploy API
    runs-on: ubuntu-latest
    needs: migrate
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install Railway CLI
        run: npm install -g @railway/cli

      - name: Deploy to Railway
        run: railway up --service artisanconnect-api
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  # ─── Deploy Frontend to Vercel ──────────────────────────────────────────────
  deploy-web:
    name: Deploy Web
    runs-on: ubuntu-latest
    needs: migrate
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Pull Vercel env
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Required GitHub Secrets

| Secret | Purpose |
|---|---|
| `GROQ_API_KEY` | AI service tests |
| `SUPABASE_URL` | Auth in tests |
| `SUPABASE_ANON_KEY` | Auth in tests |
| `SUPABASE_SERVICE_KEY` | Admin operations in tests |
| `JWT_SECRET` | Token verification in tests |
| `RESEND_API_KEY` | Email service tests |
| `MAPBOX_ACCESS_TOKEN` | Geocoding in tests |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Frontend build |
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend build |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend build |
| `PROD_DATABASE_URL` | Production migration |
| `PROD_DIRECT_URL` | Production migration (direct) |
| `RAILWAY_TOKEN` | Railway deployment |
| `VERCEL_TOKEN` | Vercel deployment |
| `VERCEL_ORG_ID` | Vercel project identification |
| `VERCEL_PROJECT_ID` | Vercel project identification |

---

## 6. Testing Strategy

### Testing Pyramid

```mermaid
graph TD
    subgraph Pyramid["Testing Pyramid"]
        E2E["🔺 E2E Tests<br/>Playwright<br/>~20 tests<br/>Critical user flows"]
        Integration["🔶 Integration Tests<br/>Supertest + Vitest<br/>~60 tests<br/>API endpoint testing"]
        Unit["🟩 Unit Tests<br/>Vitest<br/>~150 tests<br/>Services, middleware, utils"]
    end

    E2E ---|"10%"| Integration
    Integration ---|"30%"| Unit

    style E2E fill:#e94560,stroke:#fff,color:#fff
    style Integration fill:#f0a500,stroke:#fff,color:#000
    style Unit fill:#0d7377,stroke:#fff,color:#fff
```

### Coverage Targets

| Scope | Target | Enforced |
|---|---|---|
| Service modules (`services/`) | **80%** | CI fails below 75% |
| Middleware (`middleware/`) | **80%** | CI fails below 75% |
| Controllers (`controllers/`) | **60%** | CI warns below 55% |
| Frontend components | **60%** | CI warns below 50% |
| Overall project | **60%** | CI fails below 50% |

### Test Configuration

#### Vitest Config (API)

```typescript
// apps/api/vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/app.ts',
        'src/models/**',
        'src/config/**',
        'src/**/*.d.ts',
      ],
      thresholds: {
        // Per-directory thresholds
        'src/services/': {
          statements: 75,
          branches: 70,
          functions: 75,
          lines: 75,
        },
        'src/middleware/': {
          statements: 75,
          branches: 70,
          functions: 75,
          lines: 75,
        },
        // Global minimum
        statements: 50,
        branches: 45,
        functions: 50,
        lines: 50,
      },
    },
    testTimeout: 30000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
```

#### Vitest Config (Web)

```typescript
// apps/web/vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['components/**', 'hooks/**', 'lib/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

#### Playwright Config

```typescript
// apps/web/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev:api',
      port: 4000,
      reuseExistingServer: !process.env.CI,
      cwd: '../../',
    },
    {
      command: 'npm run dev:web',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      cwd: '../../',
    },
  ],
});
```

### Test File Structure

```
apps/api/tests/
├── setup.ts                          # Global test setup + teardown
├── helpers/
│   ├── test-db.ts                    # Test DB connection + cleanup
│   ├── factories.ts                  # Test data factory functions
│   ├── mocks.ts                      # Service mocks (Groq, Supabase, Resend)
│   └── auth.ts                       # Auth helper (generate test JWTs)
├── unit/
│   ├── services/
│   │   ├── auth.service.test.ts
│   │   ├── search.service.test.ts
│   │   ├── ai.service.test.ts
│   │   ├── verification.service.test.ts
│   │   ├── messaging.service.test.ts
│   │   ├── notification.service.test.ts
│   │   ├── payment.service.test.ts
│   │   ├── availability.service.test.ts
│   │   ├── quoting.service.test.ts
│   │   ├── media.service.test.ts
│   │   ├── moderation.service.test.ts
│   │   └── admin.service.test.ts
│   ├── middleware/
│   │   ├── auth.middleware.test.ts
│   │   ├── rbac.middleware.test.ts
│   │   ├── rate-limit.middleware.test.ts
│   │   ├── audit.middleware.test.ts
│   │   └── validation.middleware.test.ts
│   └── utils/
│       ├── pagination.test.ts
│       ├── response.test.ts
│       └── crypto.test.ts
└── integration/
    ├── auth.test.ts                  # POST /auth/login, /auth/register
    ├── search.test.ts                # GET /search + semantic matching
    ├── verification.test.ts          # Verification workflow
    ├── artisan.test.ts               # Artisan CRUD
    ├── review.test.ts                # Review CRUD + aggregation
    ├── quote.test.ts                 # Quote lifecycle
    ├── messaging.test.ts             # Message API (HTTP, not WS)
    ├── notification.test.ts          # Notification CRUD
    ├── favorites.test.ts             # Toggle + list
    ├── portfolio.test.ts             # Portfolio CRUD
    ├── admin.test.ts                 # Admin-only endpoints
    └── ai.test.ts                    # AI endpoint tests (mocked Groq)

apps/web/
├── tests/
│   └── setup.ts                     # Test setup for React components
├── components/__tests__/
│   ├── shared/
│   │   ├── navbar.test.tsx
│   │   ├── artisan-card.test.tsx
│   │   └── search-bar.test.tsx
│   ├── ai/
│   │   ├── chat-widget.test.tsx
│   │   └── bio-generator.test.tsx
│   └── chat/
│       ├── message-bubble.test.tsx
│       └── chat-window.test.tsx
├── hooks/__tests__/
│   ├── use-auth.test.ts
│   ├── use-search.test.ts
│   └── use-socket.test.ts
└── e2e/                             # Playwright E2E tests
    ├── auth.spec.ts                  # Login, register, logout flows
    ├── search.spec.ts                # Search + results + map view
    ├── onboarding.spec.ts            # Artisan onboarding wizard
    ├── artisan-profile.spec.ts       # View public artisan profile
    ├── messaging.spec.ts             # Send/receive messages
    ├── verification.spec.ts          # Submit verification docs
    ├── admin-dashboard.spec.ts       # Admin actions
    └── fixtures/
        ├── auth.fixture.ts           # Authenticated page objects
        └── test-data.ts              # Seed data for E2E
```

### Example Test Files

#### Unit Test — Search Service

```typescript
// apps/api/tests/unit/services/search.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchService } from '@/services/search.service';
import { prismaMock } from '../../helpers/mocks';

describe('SearchService', () => {
  let searchService: SearchService;

  beforeEach(() => {
    searchService = new SearchService(prismaMock);
    vi.clearAllMocks();
  });

  describe('searchArtisans', () => {
    it('should return artisans matching search query', async () => {
      const mockArtisans = [
        {
          id: '1',
          business_name: 'Kwame Woodworks',
          category: 'Carpentry',
          rating_average: 4.5,
          location_city: 'Accra',
        },
      ];

      prismaMock.$queryRaw.mockResolvedValue(mockArtisans);

      const result = await searchService.searchArtisans({
        query: 'carpenter in Accra',
        latitude: 5.6037,
        longitude: -0.1870,
        radius: 25,
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].business_name).toBe('Kwame Woodworks');
      expect(result.pagination.total).toBe(1);
    });

    it('should handle empty search results gracefully', async () => {
      prismaMock.$queryRaw.mockResolvedValue([]);

      const result = await searchService.searchArtisans({
        query: 'nonexistent service',
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });

    it('should save search to history for authenticated users', async () => {
      prismaMock.$queryRaw.mockResolvedValue([]);
      prismaMock.search_history.create.mockResolvedValue({} as any);

      await searchService.searchArtisans({
        query: 'plumber',
        userId: 'user-123',
        page: 1,
        limit: 10,
      });

      expect(prismaMock.search_history.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            user_id: 'user-123',
            query: 'plumber',
          }),
        })
      );
    });
  });
});
```

#### Integration Test — Auth Endpoints

```typescript
// apps/api/tests/integration/auth.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { app } from '@/app';
import { setupTestDb, teardownTestDb } from '../helpers/test-db';

const request = supertest(app);

describe('Auth API', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new customer', async () => {
      const response = await request
        .post('/api/auth/register')
        .send({
          email: 'test-customer@example.com',
          password: 'SecurePassword123!',
          full_name: 'Test Customer',
          role: 'customer',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test-customer@example.com');
      expect(response.body.data.user.role).toBe('customer');
    });

    it('should reject duplicate email', async () => {
      // First registration
      await request.post('/api/auth/register').send({
        email: 'duplicate@example.com',
        password: 'SecurePassword123!',
        full_name: 'First User',
        role: 'customer',
      });

      // Duplicate attempt
      const response = await request
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'SecurePassword123!',
          full_name: 'Second User',
          role: 'customer',
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('EMAIL_EXISTS');
    });

    it('should reject weak passwords', async () => {
      const response = await request
        .post('/api/auth/register')
        .send({
          email: 'weak-pass@example.com',
          password: '123',
          full_name: 'Weak Password User',
          role: 'customer',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return tokens for valid credentials', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'test-customer@example.com',
          password: 'SecurePassword123!',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('access_token');
      expect(response.body.data).toHaveProperty('refresh_token');
    });

    it('should reject invalid credentials', async () => {
      const response = await request
        .post('/api/auth/login')
        .send({
          email: 'test-customer@example.com',
          password: 'WrongPassword!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });
});
```

#### E2E Test — Search Flow

```typescript
// apps/web/e2e/search.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Artisan Search', () => {
  test('should search for artisans by query', async ({ page }) => {
    await page.goto('/');

    // Find and fill search bar
    const searchInput = page.getByPlaceholder(/find an artisan/i);
    await searchInput.fill('carpenter in Accra');
    await searchInput.press('Enter');

    // Should navigate to search results
    await expect(page).toHaveURL(/\/search\?q=carpenter/);

    // Should display results
    const results = page.locator('[data-testid="artisan-card"]');
    await expect(results.first()).toBeVisible({ timeout: 10000 });
  });

  test('should toggle between list and map view', async ({ page }) => {
    await page.goto('/search?q=plumber');

    // Default is list view
    await expect(page.locator('[data-testid="list-view"]')).toBeVisible();

    // Click map toggle
    await page.getByRole('button', { name: /map/i }).click();

    // Map should be visible
    await expect(page.locator('.mapboxgl-map')).toBeVisible();
  });

  test('should filter results by region', async ({ page }) => {
    await page.goto('/search?q=electrician');

    // Open filter panel
    await page.getByRole('button', { name: /filters/i }).click();

    // Select region
    await page.getByRole('combobox', { name: /region/i }).click();
    await page.getByRole('option', { name: /Greater Accra/i }).click();

    // Apply filters
    await page.getByRole('button', { name: /apply/i }).click();

    // URL should update
    await expect(page).toHaveURL(/region=greater-accra/);
  });
});
```

---

## 7. Superadmin Seed Script

The seed script creates the initial superadmin user (via Supabase Auth) and populates all default service categories and subcategories. It is **idempotent** — safe to run multiple times.

### `apps/api/prisma/seed.ts`

```typescript
// ═══════════════════════════════════════════════════════════════════════════════
//  ArtisanConnect Ghana — Database Seed Script
//  Creates initial superadmin user + default service categories
//
//  Usage: npm run db:seed  (or: npx tsx prisma/seed.ts)
// ═══════════════════════════════════════════════════════════════════════════════

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Service key required for admin operations
);

// ─── Default Service Categories + Subcategories ──────────────────────────────

interface CategorySeed {
  name: string;
  slug: string;
  description: string;
  icon: string;
  subcategories: {
    name: string;
    slug: string;
    description: string;
  }[];
}

const CATEGORIES: CategorySeed[] = [
  {
    name: 'Carpentry & Woodwork',
    slug: 'carpentry-woodwork',
    description: 'Custom furniture, wood carving, and structural woodwork',
    icon: 'hammer',
    subcategories: [
      { name: 'Furniture Making', slug: 'furniture-making', description: 'Custom tables, chairs, beds, wardrobes' },
      { name: 'Wood Carving', slug: 'wood-carving', description: 'Decorative carvings, sculptures, signage' },
      { name: 'Door & Window Frames', slug: 'door-window-frames', description: 'Custom door and window installations' },
      { name: 'Roof Trusses', slug: 'roof-trusses', description: 'Structural roof framing' },
      { name: 'Kitchen Cabinets', slug: 'kitchen-cabinets', description: 'Custom kitchen cabinetry' },
    ],
  },
  {
    name: 'Tailoring & Fashion',
    slug: 'tailoring-fashion',
    description: 'Custom clothing, alterations, and traditional wear',
    icon: 'scissors',
    subcategories: [
      { name: 'Traditional Wear', slug: 'traditional-wear', description: 'Kente, batakari, kaba & slit' },
      { name: 'Suits & Formal', slug: 'suits-formal', description: 'Custom suits, dresses, formal attire' },
      { name: 'Alterations', slug: 'alterations', description: 'Clothing repairs and modifications' },
      { name: 'Bridal & Event', slug: 'bridal-event', description: 'Wedding dresses, bridesmaid outfits' },
      { name: 'Embroidery', slug: 'embroidery', description: 'Custom embroidery and monogramming' },
    ],
  },
  {
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Pipe installation, repairs, and water systems',
    icon: 'wrench',
    subcategories: [
      { name: 'Pipe Installation', slug: 'pipe-installation', description: 'New pipe fitting and layout' },
      { name: 'Leak Repairs', slug: 'leak-repairs', description: 'Fixing leaking pipes and taps' },
      { name: 'Water Heater', slug: 'water-heater', description: 'Water heater install and repair' },
      { name: 'Drainage', slug: 'drainage', description: 'Drainage systems and unclogging' },
      { name: 'Bathroom Fitting', slug: 'bathroom-fitting', description: 'Full bathroom installations' },
    ],
  },
  {
    name: 'Electrical Work',
    slug: 'electrical-work',
    description: 'Wiring, installations, and electrical repairs',
    icon: 'zap',
    subcategories: [
      { name: 'House Wiring', slug: 'house-wiring', description: 'Residential electrical wiring' },
      { name: 'Appliance Repair', slug: 'appliance-repair', description: 'Fixing electrical appliances' },
      { name: 'Solar Installation', slug: 'solar-installation', description: 'Solar panel setup and maintenance' },
      { name: 'Generator Repair', slug: 'generator-repair', description: 'Generator maintenance and repair' },
      { name: 'CCTV & Security', slug: 'cctv-security', description: 'Security camera installation' },
    ],
  },
  {
    name: 'Masonry & Construction',
    slug: 'masonry-construction',
    description: 'Building, tiling, and structural work',
    icon: 'building',
    subcategories: [
      { name: 'Block Laying', slug: 'block-laying', description: 'Block wall construction' },
      { name: 'Tiling', slug: 'tiling', description: 'Floor and wall tiling' },
      { name: 'Plastering', slug: 'plastering', description: 'Wall plastering and finishing' },
      { name: 'Concrete Work', slug: 'concrete-work', description: 'Foundations, slabs, driveways' },
      { name: 'Renovation', slug: 'renovation', description: 'Building renovation and remodeling' },
    ],
  },
  {
    name: 'Painting & Decoration',
    slug: 'painting-decoration',
    description: 'Interior and exterior painting, wallpaper, decorative finishes',
    icon: 'paint-bucket',
    subcategories: [
      { name: 'Interior Painting', slug: 'interior-painting', description: 'Indoor wall and ceiling painting' },
      { name: 'Exterior Painting', slug: 'exterior-painting', description: 'Outdoor building painting' },
      { name: 'Wallpaper', slug: 'wallpaper', description: 'Wallpaper installation and removal' },
      { name: 'Decorative Finishes', slug: 'decorative-finishes', description: 'Textured walls, stucco, murals' },
      { name: 'POP Ceiling', slug: 'pop-ceiling', description: 'Plaster of Paris ceiling design' },
    ],
  },
  {
    name: 'Welding & Metalwork',
    slug: 'welding-metalwork',
    description: 'Gates, burglar-proofing, metal fabrication',
    icon: 'flame',
    subcategories: [
      { name: 'Gate Fabrication', slug: 'gate-fabrication', description: 'Custom metal gates' },
      { name: 'Burglar Proofing', slug: 'burglar-proofing', description: 'Window and door security bars' },
      { name: 'Handrails', slug: 'handrails', description: 'Staircase and balcony railings' },
      { name: 'Roofing Sheets', slug: 'roofing-sheets', description: 'Metal roofing installation' },
      { name: 'Tank Stands', slug: 'tank-stands', description: 'Water tank support structures' },
    ],
  },
  {
    name: 'Auto Mechanics',
    slug: 'auto-mechanics',
    description: 'Vehicle repair, maintenance, and diagnostics',
    icon: 'car',
    subcategories: [
      { name: 'Engine Repair', slug: 'engine-repair', description: 'Engine diagnosis and repair' },
      { name: 'Body Work', slug: 'body-work', description: 'Dent removal, panel beating' },
      { name: 'AC Repair', slug: 'ac-repair', description: 'Vehicle air conditioning' },
      { name: 'Electrical Systems', slug: 'electrical-systems', description: 'Auto electrical diagnosis' },
      { name: 'Spray Painting', slug: 'spray-painting', description: 'Vehicle respraying and touch-ups' },
    ],
  },
  {
    name: 'Hairdressing & Beauty',
    slug: 'hairdressing-beauty',
    description: 'Hair styling, braiding, barbering, and beauty services',
    icon: 'sparkles',
    subcategories: [
      { name: 'Braiding', slug: 'braiding', description: 'Hair braiding and threading' },
      { name: 'Barbering', slug: 'barbering', description: 'Haircuts and grooming' },
      { name: 'Wig Making', slug: 'wig-making', description: 'Custom wig construction' },
      { name: 'Makeup', slug: 'makeup', description: 'Professional makeup artistry' },
      { name: 'Nails', slug: 'nails', description: 'Manicure, pedicure, nail art' },
    ],
  },
  {
    name: 'Catering & Baking',
    slug: 'catering-baking',
    description: 'Event catering, custom cakes, and food services',
    icon: 'utensils',
    subcategories: [
      { name: 'Event Catering', slug: 'event-catering', description: 'Weddings, parties, corporate events' },
      { name: 'Custom Cakes', slug: 'custom-cakes', description: 'Birthday, wedding, special cakes' },
      { name: 'Pastries', slug: 'pastries', description: 'Bread, meat pies, pastries' },
      { name: 'Local Dishes', slug: 'local-dishes', description: 'Traditional Ghanaian cuisine' },
      { name: 'Small Chops', slug: 'small-chops', description: 'Finger foods and appetizers' },
    ],
  },
  {
    name: 'Photography & Videography',
    slug: 'photography-videography',
    description: 'Event coverage, portrait photography, video production',
    icon: 'camera',
    subcategories: [
      { name: 'Event Coverage', slug: 'event-coverage', description: 'Weddings, parties, ceremonies' },
      { name: 'Portrait Photography', slug: 'portrait-photography', description: 'Studio and outdoor portraits' },
      { name: 'Product Photography', slug: 'product-photography', description: 'Commercial product shots' },
      { name: 'Video Production', slug: 'video-production', description: 'Music videos, documentaries' },
      { name: 'Drone Photography', slug: 'drone-photography', description: 'Aerial photography and video' },
    ],
  },
  {
    name: 'Cleaning Services',
    slug: 'cleaning-services',
    description: 'Home cleaning, office cleaning, laundry services',
    icon: 'sparkle',
    subcategories: [
      { name: 'Home Cleaning', slug: 'home-cleaning', description: 'Regular domestic cleaning' },
      { name: 'Office Cleaning', slug: 'office-cleaning', description: 'Commercial space cleaning' },
      { name: 'Deep Cleaning', slug: 'deep-cleaning', description: 'Thorough deep-clean service' },
      { name: 'Laundry', slug: 'laundry', description: 'Washing, ironing, dry cleaning' },
      { name: 'Fumigation', slug: 'fumigation', description: 'Pest control and fumigation' },
    ],
  },
];

// ─── Seed Functions ──────────────────────────────────────────────────────────

async function seedSuperadmin(): Promise<void> {
  const email = process.env.SUPERADMIN_EMAIL!;
  const password = process.env.SUPERADMIN_PASSWORD!;

  console.log('🔐 Seeding superadmin user...');

  // Check if superadmin already exists
  const existingUser = await prisma.users.findFirst({
    where: { email, role: 'superadmin' },
  });

  if (existingUser) {
    console.log(`   ✅ Superadmin already exists: ${email}`);
    return;
  }

  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Skip email verification for seed user
    user_metadata: {
      full_name: 'System Administrator',
      role: 'superadmin',
    },
  });

  if (authError) {
    // If user exists in Auth but not in our DB, get existing user
    if (authError.message.includes('already been registered')) {
      console.log('   ⚠️  User exists in Supabase Auth, syncing to local DB...');

      const { data: listData } = await supabase.auth.admin.listUsers();
      const existingAuthUser = listData?.users?.find((u) => u.email === email);

      if (existingAuthUser) {
        await prisma.users.upsert({
          where: { id: existingAuthUser.id },
          update: { role: 'superadmin' },
          create: {
            id: existingAuthUser.id,
            email,
            full_name: 'System Administrator',
            role: 'superadmin',
            is_active: true,
          },
        });
        console.log(`   ✅ Superadmin synced: ${email}`);
        return;
      }
    }
    throw new Error(`Failed to create superadmin: ${authError.message}`);
  }

  // Create corresponding record in our users table
  await prisma.users.create({
    data: {
      id: authData.user.id,
      email,
      full_name: 'System Administrator',
      role: 'superadmin',
      is_active: true,
    },
  });

  console.log(`   ✅ Superadmin created: ${email}`);
}

async function seedCategories(): Promise<void> {
  console.log('📂 Seeding service categories...');

  let categoriesCreated = 0;
  let subcategoriesCreated = 0;
  let categoriesSkipped = 0;

  for (const category of CATEGORIES) {
    // Upsert category (idempotent)
    const existingCategory = await prisma.service_categories.findFirst({
      where: { slug: category.slug },
    });

    let categoryId: string;

    if (existingCategory) {
      categoryId = existingCategory.id;
      categoriesSkipped++;
    } else {
      const created = await prisma.service_categories.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          is_active: true,
          sort_order: CATEGORIES.indexOf(category),
        },
      });
      categoryId = created.id;
      categoriesCreated++;
    }

    // Upsert subcategories
    for (const sub of category.subcategories) {
      const existingSub = await prisma.service_subcategories.findFirst({
        where: {
          slug: sub.slug,
          category_id: categoryId,
        },
      });

      if (!existingSub) {
        await prisma.service_subcategories.create({
          data: {
            category_id: categoryId,
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            is_active: true,
            sort_order: category.subcategories.indexOf(sub),
          },
        });
        subcategoriesCreated++;
      }
    }
  }

  console.log(`   ✅ Categories: ${categoriesCreated} created, ${categoriesSkipped} already existed`);
  console.log(`   ✅ Subcategories: ${subcategoriesCreated} created`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log('  ArtisanConnect Ghana — Database Seed');
  console.log('═══════════════════════════════════════════════════');
  console.log('');

  try {
    await seedSuperadmin();
    console.log('');
    await seedCategories();

    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('  ✅ Seed completed successfully!');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
```

### Prisma Seed Configuration

Add the seed script to the API's `package.json` for Prisma to discover:

```jsonc
// apps/api/package.json (partial)
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### Seed Summary

| Seed Action | Records | Idempotent |
|---|---|---|
| Superadmin user (Supabase Auth + DB) | 1 | ✅ Skips if exists |
| Service categories | 12 | ✅ Upserts by slug |
| Service subcategories | 60 (12 × 5) | ✅ Upserts by slug + category |
| **Total** | **73** | |

### Category Overview

| # | Category | Subcategories | Icon |
|---|---|---|---|
| 1 | Carpentry & Woodwork | Furniture, Carving, Doors, Trusses, Cabinets | `hammer` |
| 2 | Tailoring & Fashion | Traditional, Suits, Alterations, Bridal, Embroidery | `scissors` |
| 3 | Plumbing | Pipes, Leaks, Heater, Drainage, Bathroom | `wrench` |
| 4 | Electrical Work | Wiring, Appliance, Solar, Generator, CCTV | `zap` |
| 5 | Masonry & Construction | Block, Tiling, Plastering, Concrete, Renovation | `building` |
| 6 | Painting & Decoration | Interior, Exterior, Wallpaper, Finishes, POP | `paint-bucket` |
| 7 | Welding & Metalwork | Gates, Burglar Proof, Handrails, Roofing, Tanks | `flame` |
| 8 | Auto Mechanics | Engine, Body, AC, Electrical, Spray | `car` |
| 9 | Hairdressing & Beauty | Braiding, Barbering, Wigs, Makeup, Nails | `sparkles` |
| 10 | Catering & Baking | Events, Cakes, Pastries, Local, Small Chops | `utensils` |
| 11 | Photography & Videography | Events, Portrait, Product, Video, Drone | `camera` |
| 12 | Cleaning Services | Home, Office, Deep Clean, Laundry, Fumigation | `sparkle` |

---

## 8. Development Workflow

### 8.1 Initial Setup (Clone to Running Dev)

```mermaid
flowchart TD
    A["Clone Repository"] --> B["Install Dependencies"]
    B --> C["Configure Environment"]
    C --> D["Start Database"]
    D --> E["Run Migrations"]
    E --> F["Seed Database"]
    F --> G["Start Dev Servers"]
    G --> H["Open Browser"]

    style A fill:#1a1a2e,stroke:#e94560,color:#fff
    style H fill:#0d7377,stroke:#14ffec,color:#fff
```

#### Step-by-Step Commands

```bash
# ─── 1. Clone the repository ─────────────────────────────────────────────────
git clone https://github.com/artisanconnect/artisanconnect-ghana.git
cd artisanconnect-ghana

# ─── 2. Install dependencies (all workspaces) ────────────────────────────────
npm install

# ─── 3. Configure environment ────────────────────────────────────────────────
cp .env.example .env
# Edit .env with your Supabase, Groq, Mapbox, Resend credentials

# ─── 4. Start local PostgreSQL + pgvector ─────────────────────────────────────
docker compose up -d

# Verify database is healthy:
docker compose ps     # Should show "healthy"

# ─── 5. Run Prisma migrations ────────────────────────────────────────────────
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Apply all migrations

# ─── 6. Seed database ────────────────────────────────────────────────────────
npm run db:seed       # Creates superadmin + 12 categories + 60 subcategories

# ─── 7. Start development servers ────────────────────────────────────────────
npm run dev           # Starts both web (3000) and api (4000) concurrently

# Or start individually:
# npm run dev:web     # http://localhost:3000
# npm run dev:api     # http://localhost:4000

# ─── 8. Open in browser ──────────────────────────────────────────────────────
# Frontend:  http://localhost:3000
# API:       http://localhost:4000/api/health
# pgAdmin:   docker compose --profile tools up -d  →  http://localhost:5050
# Prisma:    npm run db:studio  →  http://localhost:5555
```

### 8.2 Running Migrations

```bash
# ─── Create a new migration after changing schema.prisma ──────────────────────
npm run db:migrate
# Prisma prompts for migration name, e.g.: "add_artisan_availability_table"

# ─── Apply existing migrations (deploy / CI) ─────────────────────────────────
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma

# ─── Reset database (WARNING: deletes all data) ──────────────────────────────
npm run db:reset      # Drops, re-creates, re-migrates, re-seeds

# ─── Push schema changes without migration (prototyping only) ─────────────────
npm run db:push       # Direct schema sync, no migration file created
```

### 8.3 Starting Dev Servers

| Command | What it starts | URL |
|---|---|---|
| `npm run dev` | Both web + api | `:3000` + `:4000` |
| `npm run dev:web` | Next.js only | `http://localhost:3000` |
| `npm run dev:api` | Express.js only | `http://localhost:4000` |
| `npm run db:studio` | Prisma Studio | `http://localhost:5555` |

### 8.4 Adding a New Service Module

When adding a new backend service module (e.g., a "Reviews" module), follow this checklist:

```mermaid
flowchart TD
    A["1. Define Types<br/>packages/shared/types/"] --> B["2. Add Prisma Model<br/>apps/api/prisma/schema.prisma"]
    B --> C["3. Run Migration<br/>npm run db:migrate"]
    C --> D["4. Create Service<br/>apps/api/src/services/"]
    D --> E["5. Create Controller<br/>apps/api/src/controllers/"]
    E --> F["6. Define Routes<br/>apps/api/src/routes/"]
    F --> G["7. Register Routes<br/>apps/api/src/routes/index.ts"]
    G --> H["8. Write Tests<br/>apps/api/tests/"]
    H --> I["9. Add Frontend<br/>apps/web/"]

    style A fill:#2d6187,stroke:#78c4d4,color:#fff
    style I fill:#0d7377,stroke:#14ffec,color:#fff
```

#### Detailed Steps

**Step 1 — Shared Types** (`packages/shared/types/review.types.ts`)

```typescript
export interface Review {
  id: string;
  artisan_id: string;
  customer_id: string;
  rating: number;           // 1-5
  comment: string;
  created_at: string;
}

export interface CreateReviewDTO {
  artisan_id: string;
  rating: number;
  comment: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<number, number>;
}
```

**Step 2 — Prisma Model** (`apps/api/prisma/schema.prisma`)

```prisma
model reviews {
  id          String   @id @default(uuid()) @db.Uuid
  artisan_id  String   @db.Uuid
  customer_id String   @db.Uuid
  rating      Int      @db.SmallInt
  comment     String   @db.Text
  created_at  DateTime @default(now()) @db.Timestamptz(6)
  updated_at  DateTime @updatedAt @db.Timestamptz(6)

  artisan     artisan_profiles @relation(fields: [artisan_id], references: [id])
  customer    users            @relation(fields: [customer_id], references: [id])

  @@index([artisan_id])
  @@index([customer_id])
}
```

**Step 3 — Migration**

```bash
npm run db:migrate
# Enter name: add_reviews_table
```

**Step 4 — Service** (`apps/api/src/services/review.service.ts`)

```typescript
import { PrismaClient } from '@prisma/client';
import type { CreateReviewDTO, ReviewStats } from '@artisanconnect/shared/types';

export class ReviewService {
  constructor(private prisma: PrismaClient) {}

  async create(customerId: string, data: CreateReviewDTO) {
    // Validate customer has completed a job with this artisan
    // Create review
    // Update artisan rating_average and review_count
    // Send notification to artisan
  }

  async getByArtisan(artisanId: string, page: number, limit: number) {
    // Paginated reviews for an artisan
  }

  async getStats(artisanId: string): Promise<ReviewStats> {
    // Aggregate rating statistics
  }
}
```

**Step 5 — Controller** (`apps/api/src/controllers/review.controller.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '@/services/review.service';

export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  create = async (req: Request, res: Response, next: NextFunction) => { /* ... */ };
  getByArtisan = async (req: Request, res: Response, next: NextFunction) => { /* ... */ };
  getStats = async (req: Request, res: Response, next: NextFunction) => { /* ... */ };
}
```

**Step 6 — Routes** (`apps/api/src/routes/review.routes.ts`)

```typescript
import { Router } from 'express';
import { ReviewController } from '@/controllers/review.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/rbac.middleware';
import { validate } from '@/middleware/validation.middleware';
import { createReviewSchema } from '@/validations/review.validation';

const router = Router();
const controller = new ReviewController(/* inject service */);

router.post('/', authenticate, requireRole('customer'), validate(createReviewSchema), controller.create);
router.get('/artisan/:artisanId', controller.getByArtisan);
router.get('/artisan/:artisanId/stats', controller.getStats);

export default router;
```

**Step 7 — Register** (`apps/api/src/routes/index.ts`)

```typescript
import reviewRoutes from './review.routes';

// ... existing routes ...
router.use('/reviews', reviewRoutes);
```

**Step 8 — Tests** (`apps/api/tests/unit/services/review.service.test.ts`)

```typescript
describe('ReviewService', () => {
  it('should create a review and update artisan stats', async () => { /* ... */ });
  it('should prevent duplicate reviews for same job', async () => { /* ... */ });
  it('should calculate correct rating statistics', async () => { /* ... */ });
});
```

**Step 9 — Frontend** (hooks, components, pages as needed)

### 8.5 Git Workflow

```mermaid
gitgraph
    commit id: "initial"
    branch develop
    checkout develop
    commit id: "feature-base"
    branch feature/auth
    checkout feature/auth
    commit id: "auth-service"
    commit id: "auth-tests"
    checkout develop
    merge feature/auth id: "merge-auth"
    branch feature/search
    checkout feature/search
    commit id: "search-service"
    commit id: "pgvector-setup"
    checkout develop
    merge feature/search id: "merge-search"
    checkout main
    merge develop id: "v0.1.0" tag: "v0.1.0"
```

#### Branch Naming Convention

| Prefix | Usage | Example |
|---|---|---|
| `feature/` | New feature | `feature/ai-bio-generation` |
| `fix/` | Bug fix | `fix/search-pagination` |
| `refactor/` | Code refactoring | `refactor/auth-middleware` |
| `docs/` | Documentation | `docs/api-reference` |
| `test/` | Test additions | `test/verification-flow` |
| `chore/` | Tooling, CI, deps | `chore/update-dependencies` |

#### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(search): add pgvector semantic search with distance ranking
fix(auth): handle expired refresh tokens gracefully
docs(api): add OpenAPI spec for verification endpoints
test(messaging): add WebSocket integration tests
chore(deps): update Next.js to 15.1.0
```

### 8.6 Code Quality Tools

#### ESLint Configuration

```jsonc
// .eslintrc.json (root)
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "ignorePatterns": ["dist/", "node_modules/", ".next/"]
}
```

#### Prettier Configuration

```jsonc
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

#### `.gitignore`

```gitignore
# Dependencies
node_modules/

# Build outputs
dist/
.next/
out/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Prisma
apps/api/prisma/migrations/**/migration_lock.toml

# Testing
coverage/
playwright-report/
test-results/

# Misc
*.log
```

---

## Appendix A — Quick Reference Card

| What | Where |
|---|---|
| **Frontend code** | `apps/web/` |
| **Backend code** | `apps/api/src/` |
| **Shared types** | `packages/shared/types/` |
| **API routes** | `apps/api/src/routes/` |
| **Services** | `apps/api/src/services/` |
| **AI prompts** | `apps/api/src/services/ai/prompts/` |
| **DB schema** | `apps/api/prisma/schema.prisma` |
| **Seed script** | `apps/api/prisma/seed.ts` |
| **WebSocket handlers** | `apps/api/src/websocket/handlers/` |
| **Email templates** | `apps/api/src/email/templates/` |
| **UI components** | `apps/web/components/ui/` |
| **Custom hooks** | `apps/web/hooks/` |
| **API tests** | `apps/api/tests/` |
| **E2E tests** | `apps/web/e2e/` |
| **CI workflow** | `.github/workflows/ci.yml` |
| **Docker config** | `docker-compose.yml` |
| **Design docs** | `docs/design/` |

## Appendix B — Port Allocation

| Service | Port | URL |
|---|---|---|
| Next.js (frontend) | `3000` | http://localhost:3000 |
| Express.js (API) | `4000` | http://localhost:4000 |
| Socket.io (WS) | `4000` | ws://localhost:4000 |
| PostgreSQL | `5432` | postgresql://localhost:5432 |
| pgAdmin | `5050` | http://localhost:5050 |
| Prisma Studio | `5555` | http://localhost:5555 |

---

*Document version 1.0 · ArtisanConnect Ghana · June 2026*

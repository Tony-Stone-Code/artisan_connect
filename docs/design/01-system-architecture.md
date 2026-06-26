# System Architecture — ArtisanConnect Ghana

> **Document**: Deliverable 1 — System Architecture Diagram  
> **Version**: 1.0  
> **Last Updated**: 2026-06-20  
> **Status**: Draft  

---

## Table of Contents

1. [Overview](#overview)
2. [High-Level Architecture](#1-high-level-architecture)
3. [Backend Service Architecture](#2-backend-service-architecture)
4. [Data Flow Diagram — AI-Powered Search Pipeline](#3-data-flow-diagram--ai-powered-search-pipeline)
5. [AI Integration Map](#4-ai-integration-map)
6. [Infrastructure Diagram](#5-infrastructure-diagram)
7. [Key Design Decisions](#key-design-decisions)

---

## Overview

ArtisanConnect Ghana is an AI-powered artisan discovery platform that connects customers with skilled artisans across Ghana. The system is built on a modern three-tier architecture with an embedded intelligence layer powered by a single AI provider (Groq). The platform supports real-time messaging, semantic search with vector embeddings, identity verification through document vision analysis, and location-aware service matching via Mapbox.

### Core Tenets

| Tenet | Rationale |
|---|---|
| **Single AI Provider** | Groq provides LLM, embeddings, vision, and classification through one API — simplifying ops, billing, and rate-limit management. |
| **Supabase as Managed Backend** | PostgreSQL + Auth + Storage + Realtime in a single managed service reduces operational overhead for a lean team. |
| **pgvector for Semantic Search** | Embedding artisan services and search queries into the same vector space enables intent-aware discovery beyond keyword matching. |
| **4-Tier RBAC** | Customer → Artisan → Admin → Superadmin hierarchy enforces least-privilege across all API endpoints. |
| **Socket.io for Real-time** | Bi-directional WebSockets power chat, presence indicators, and push notifications without polling. |
| **Ghana-first Design** | SMS/WhatsApp sharing, Ghana Card verification, GHS currency, and location-aware search are first-class features. |

---

## 1. High-Level Architecture

The high-level architecture follows a layered pattern with clear boundaries between presentation, application logic, intelligence, and data persistence. Each layer communicates only with its adjacent layers, except for the AI layer which is accessed exclusively through the Application Layer's AI Service module.

```mermaid
block-beta
    columns 3

    block:PRESENTATION["Presentation Layer — Next.js 15 + React 19 + TypeScript"]:3
        columns 4
        A1["Landing Page"]
        A2["Auth Pages"]
        A3["Onboarding Flow"]
        A4["Search + Results"]
        A5["Customer Dashboard"]
        A6["Artisan Dashboard"]
        A7["Admin Dashboard"]
        A8["Superadmin Dashboard"]
        A9["Profile + Portfolio"]
        A10["Chat Interface"]
        A11["Service Request + Quotes"]
        A12["Social Sharing"]
    end

    space:3

    block:APPSERVER["Application Layer — Node.js + Express.js + TypeScript"]:3
        columns 4
        B1["Auth Service"]
        B2["User Service"]
        B3["Search Service"]
        B4["Verification Service"]
        B5["Payment Service"]
        B6["Messaging Service"]
        B7["Notification Service"]
        B8["AI Service"]
        B9["Availability Service"]
        B10["Quoting Service"]
        B11["Media Service"]
        B12["Moderation Service"]
        B13["Admin Service"]
        B14["RBAC Middleware"]
        B15["Socket.io Server"]
        B16["Rate Limiter"]
    end

    space:3

    block:INTEL["AI / Intelligence Layer — Groq API"]:3
        columns 4
        C1["LLM: Llama 3.3 70B"]
        C2["Embeddings"]
        C3["Vision: Ghana Card"]
        C4["Classification: Mixtral 8x7B"]
    end

    space:3

    block:DATA["Data Layer"]:3
        columns 4
        D1["PostgreSQL via Supabase"]
        D2["pgvector Store"]
        D3["Supabase Storage"]
        D4["Supabase Auth"]
    end

    space:3

    block:EXTERNAL["External Services"]:3
        columns 3
        E1["Mapbox GL JS"]
        E2["Resend Email"]
        E3["WhatsApp Share API"]
    end

    PRESENTATION --> APPSERVER
    APPSERVER --> INTEL
    APPSERVER --> DATA
    APPSERVER --> EXTERNAL
```

### Layer Responsibilities

| Layer | Technology | Responsibilities |
|---|---|---|
| **Presentation** | Next.js 15, React 19, TypeScript, Tailwind CSS, ShadCN/UI | Server-side rendering, client-side interactivity, responsive UI, Mapbox map rendering, Socket.io client |
| **Application** | Node.js, Express.js, TypeScript | API routing, business logic, 13 service modules, WebSocket server, RBAC enforcement, rate limiting |
| **AI / Intelligence** | Groq API (llama-3.3-70b-versatile, mixtral-8x7b-32768) | Intent extraction, embedding generation, document OCR, sentiment classification. Free tier: 30 req/min. |
| **Data** | PostgreSQL (Supabase), pgvector, Supabase Storage, Supabase Auth | 21 tables, vector similarity search, file uploads (images, documents), JWT-based auth |
| **External** | Mapbox, Resend, WhatsApp Web API | Geocoding, distance calculation, transactional email, social sharing |

### Key Design Decisions

- **Next.js 15 App Router** — Uses React Server Components for initial page loads (SEO, performance) and client components for interactive features (maps, chat, search).
- **Tailwind + ShadCN/UI** — Utility-first CSS with a headless component library ensures consistent design without heavy bundle overhead.
- **Social Sharing** — WhatsApp integration and copy-link are prioritised over Western social platforms, reflecting Ghana's communication patterns.
- **Supabase Auth over custom JWT** — Supabase manages token issuance, refresh, and email verification internally, reducing surface area for auth bugs.

---

## 2. Backend Service Architecture

The backend is decomposed into 13 service modules, each owning a distinct domain. Services communicate internally through direct function calls (not HTTP) since they are co-located in the same Express.js process. The AI Service acts as the single gateway to Groq — no other service calls Groq directly.

```mermaid
flowchart TB
    subgraph MW["Middleware Pipeline"]
        direction LR
        CORS["CORS"] --> RL["Rate Limiter"]
        RL --> AUTH_MW["Auth Middleware"]
        AUTH_MW --> RBAC["RBAC Guard"]
        RBAC --> VALIDATE["Request Validation"]
    end

    subgraph SERVICES["Service Modules"]
        direction TB

        subgraph CORE["Core Services"]
            AUTH["Auth Service"]
            USER["User Service"]
            ADMIN["Admin Service"]
        end

        subgraph DISCOVERY["Discovery Services"]
            SEARCH["Search Service"]
            AVAIL["Availability Service"]
            QUOTE["Quoting Service"]
        end

        subgraph TRUST["Trust and Safety"]
            VERIFY["Verification Service"]
            MOD["Moderation Service"]
            PAY["Payment Service"]
        end

        subgraph COMMS["Communication Services"]
            MSG["Messaging Service"]
            NOTIF["Notification Service"]
            MEDIA["Media Service"]
        end

        subgraph INTELLIGENCE["Intelligence Gateway"]
            AI["AI Service"]
            GROQ["Groq Client"]
            AI --> GROQ
        end
    end

    subgraph WS["WebSocket Layer"]
        SOCK["Socket.io Server"]
        ROOMS["Room Manager"]
        PRESENCE["Presence Tracker"]
        SOCK --> ROOMS
        SOCK --> PRESENCE
    end

    MW --> SERVICES

    %% Service Dependencies
    SEARCH --> AI
    SEARCH --> AVAIL
    VERIFY --> AI
    MOD --> AI
    USER --> AI
    QUOTE --> NOTIF
    MSG --> SOCK
    MSG --> NOTIF
    NOTIF --> SOCK
    AUTH --> USER
    ADMIN --> USER
    ADMIN --> MOD
    ADMIN --> VERIFY
    MEDIA --> AI
    PAY --> NOTIF
    PAY --> QUOTE

    %% External Dependencies
    SEARCH -.->|"Geocoding + Distance"| MAPBOX["Mapbox API"]
    NOTIF -.->|"Transactional Email"| RESEND["Resend API"]
    AUTH -.->|"JWT + Auth Emails"| SUPA_AUTH["Supabase Auth"]
    MEDIA -.->|"File Upload"| SUPA_STORE["Supabase Storage"]
    GROQ -.->|"LLM + Embeddings + Vision"| GROQ_API["Groq API"]

    %% Data Layer
    SERVICES -->|"Queries"| DB["PostgreSQL + pgvector"]
```

### Service Module Catalog

| Service | Domain | Key Responsibilities | Dependencies |
|---|---|---|---|
| **Auth** | Authentication | Login, register, password reset, session management, Supabase Auth integration | User, Supabase Auth |
| **User** | Profile Management | CRUD profiles, artisan onboarding, preference updates, role management | AI (bio generation) |
| **Search** | Artisan Discovery | Intent extraction, vector search, geo-filtering, composite ranking, result summarisation | AI, Availability, Mapbox |
| **Verification** | Identity | Ghana Card upload, OCR extraction, manual review queue, status tracking | AI (vision), Media |
| **Payment** | Transactions | Quote payments, payment tracking, escrow concepts, refund handling | Quoting, Notification |
| **Messaging** | Real-time Chat | 1:1 conversations, message persistence, read receipts, typing indicators | Socket.io, Notification |
| **Notification** | Alerts | In-app push, email dispatch, notification preferences, badge counts | Socket.io, Resend |
| **AI** | Intelligence Gateway | Groq client wrapper, rate-limit management, prompt templates, embedding cache | Groq API |
| **Availability** | Scheduling | Working hours, day-off management, real-time availability status | — |
| **Quoting** | Service Quotes | Quote creation, negotiation, acceptance/rejection, expiry management | Notification |
| **Media** | File Management | Image upload/resize, portfolio management, Ghana Card document handling | Supabase Storage, AI |
| **Moderation** | Content Safety | Review moderation, report handling, content flagging, automated screening | AI (classification) |
| **Admin** | Platform Management | User management, audit logs, analytics, verification review, system config | User, Moderation, Verification |

### Middleware Pipeline

Every HTTP request passes through the middleware pipeline in order:

1. **CORS** — Allows requests from the Vercel-hosted frontend origin.
2. **Rate Limiter** — Token-bucket per IP (general) and per user (authenticated). Prevents abuse.
3. **Auth Middleware** — Validates Supabase JWT, extracts user context, attaches to `req.user`.
4. **RBAC Guard** — Checks `req.user.role` against the route's required permission level.
5. **Request Validation** — Zod schemas validate request body, query params, and path params.

### WebSocket Architecture

Socket.io runs on the same Express server, sharing the auth middleware for the initial handshake. Key real-time features:

- **Room Manager** — Creates rooms per conversation (`chat:{conversationId}`) and per user (`user:{userId}`) for targeted messaging.
- **Presence Tracker** — Maintains online/offline/away status using heartbeats. Broadcasts presence changes to relevant rooms.
- **Event Taxonomy** — `message:new`, `message:read`, `typing:start`, `typing:stop`, `notification:new`, `presence:update`.

---

## 3. Data Flow Diagram — AI-Powered Search Pipeline

The search pipeline is the most AI-intensive flow in the system. It makes up to 4 Groq API calls per search request (intent extraction, query embedding, optional clarification, result summary). Given the 30 req/min free-tier limit, aggressive caching and debouncing are critical.

```mermaid
sequenceDiagram
    actor Customer
    participant FE as "Next.js Frontend"
    participant API as "Express API"
    participant SearchSvc as "Search Service"
    participant AISvc as "AI Service"
    participant Groq as "Groq API"
    participant PGV as "pgvector"
    participant PG as "PostgreSQL"
    participant Mapbox as "Mapbox API"

    Customer->>FE: Enter search query
    Note over Customer,FE: "I need a plumber in Accra<br/>who can fix a leaking pipe"

    FE->>API: POST /api/search
    API->>API: Auth + RBAC + Validate

    API->>SearchSvc: search(query, filters, location)

    rect rgb(240, 248, 255)
        Note over SearchSvc,Groq: Step 1 — Intent Extraction
        SearchSvc->>AISvc: extractIntent(query)
        AISvc->>Groq: chat.completions (Llama 3.3 70B)
        Note right of Groq: Structured JSON output:<br/>category, subcategory,<br/>location, urgency, keywords
        Groq-->>AISvc: Intent JSON
        AISvc-->>SearchSvc: Parsed intent
    end

    rect rgb(240, 255, 240)
        Note over SearchSvc,Groq: Step 2 — Vector Embedding
        SearchSvc->>AISvc: generateEmbedding(normalizedQuery)
        AISvc->>Groq: embeddings.create
        Groq-->>AISvc: 1536-dim vector
        AISvc-->>SearchSvc: Query embedding
    end

    rect rgb(255, 248, 240)
        Note over SearchSvc,PG: Step 3 — Multi-Signal Retrieval
        par Vector Search
            SearchSvc->>PGV: "cosine similarity search (top 50)"
            PGV-->>SearchSvc: Candidate artisans + similarity scores
        and Keyword Fallback
            SearchSvc->>PG: "Full-text search (tsvector)"
            PG-->>SearchSvc: Keyword matches
        end
    end

    rect rgb(248, 240, 255)
        Note over SearchSvc,Mapbox: Step 4 — Geo-Filtering and Distance
        SearchSvc->>Mapbox: "Geocode location string"
        Mapbox-->>SearchSvc: Coordinates
        SearchSvc->>SearchSvc: "Calculate distances, filter by radius"
    end

    rect rgb(255, 240, 245)
        Note over SearchSvc,SearchSvc: Step 5 — Composite Ranking
        SearchSvc->>SearchSvc: Score = w1*similarity + w2*rating<br/>+ w3*proximity + w4*availability<br/>+ w5*verificationBonus
        Note right of SearchSvc: Weights tuned for<br/>relevance vs locality
    end

    rect rgb(240, 255, 255)
        Note over SearchSvc,Groq: Step 6 — Result Summary
        SearchSvc->>AISvc: summarizeResults(topArtisans, query)
        AISvc->>Groq: chat.completions (Llama 3.3 70B)
        Groq-->>AISvc: Natural language summary
        AISvc-->>SearchSvc: Summary text
    end

    SearchSvc-->>API: Ranked results + summary
    API->>PG: "Log to search_history"
    API-->>FE: JSON response
    FE-->>Customer: Render results with map + summary
```

### Search Pipeline Design Decisions

| Decision | Rationale |
|---|---|
| **Intent extraction before embedding** | Parsing the user's natural-language query into structured fields (category, location, urgency) allows us to apply hard filters before vector search, dramatically reducing the candidate set. |
| **Hybrid retrieval (vector + keyword)** | Vector search excels at semantic matches ("fix leaky pipe" → plumber) while keyword search catches exact terms the embedding might miss (specific tool names, brand names). |
| **Geocode at query time** | User queries often contain fuzzy location references ("near Osu" or "in East Legon"). Mapbox geocoding normalizes these into coordinates for distance calculation. |
| **Composite ranking formula** | A weighted multi-signal score prevents any single factor (e.g., proximity) from dominating results. Weights are configurable via admin settings. |
| **Deferred summarisation** | The LLM summary is generated last, only for the top N results, to conserve Groq rate-limit budget. It can be skipped entirely under rate-limit pressure. |
| **Search history logging** | Every search is logged (query, intent, result count, latency) for analytics, recommendation improvement, and audit purposes. |

### Rate-Limit Budget per Search

| Groq Call | Model | Est. Tokens | Required? |
|---|---|---|---|
| Intent Extraction | llama-3.3-70b-versatile | ~200 in / ~150 out | Yes |
| Query Embedding | embedding model | ~50 in | Yes |
| Result Summary | llama-3.3-70b-versatile | ~500 in / ~200 out | Optional (can skip) |
| Clarification | llama-3.3-70b-versatile | ~100 in / ~80 out | Conditional |

At 30 req/min, the system can handle **~10 full search requests/min** (3 Groq calls each) or **~15/min** if summaries are cached or skipped.

---

## 4. AI Integration Map

All AI capabilities flow through the single **AI Service** module, which wraps the Groq client with rate limiting, retry logic, prompt template management, and response caching. This centralised design ensures consistent error handling and makes it easy to monitor Groq usage across the entire platform.

```mermaid
flowchart LR
    subgraph GROQ_CAPABILITIES["Groq API Capabilities"]
        CHAT["Chat Completions<br/>Llama 3.3 70B"]
        EMBED["Embeddings"]
        VISION["Vision<br/>Llama 3.3 70B"]
        CLASSIFY["Classification<br/>Mixtral 8x7B"]
    end

    subgraph CHAT_FEATURES["Chat Completion Features"]
        F1["Query Intent Extraction"]
        F2["Artisan Bio Generation"]
        F3["Service Request Clarifier"]
        F4["Dispute Summary"]
        F5["Admin Analytics Insights"]
        F6["Recommendation Chatbot"]
        F7["Search Result Summary"]
        F8["Quote Description Helper"]
    end

    subgraph EMBED_FEATURES["Embedding Features"]
        F9["Service Description Embedding"]
        F10["Search Query Embedding"]
        F11["Portfolio Item Embedding"]
    end

    subgraph VISION_FEATURES["Vision Features"]
        F12["Ghana Card OCR + Extraction"]
        F13["Portfolio Image Analysis"]
    end

    subgraph CLASSIFY_FEATURES["Classification Features"]
        F14["Review Sentiment Analysis"]
        F15["Content Moderation Screening"]
        F16["Service Category Auto-tag"]
    end

    CHAT --> F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8
    EMBED --> F9 & F10 & F11
    VISION --> F12 & F13
    CLASSIFY --> F14 & F15 & F16

    subgraph CONSUMERS["Consuming Service Modules"]
        S_SEARCH["Search Service"]
        S_USER["User Service"]
        S_VERIFY["Verification Service"]
        S_MOD["Moderation Service"]
        S_ADMIN["Admin Service"]
        S_QUOTE["Quoting Service"]
        S_MEDIA["Media Service"]
    end

    F1 & F7 & F10 --> S_SEARCH
    F2 & F6 --> S_USER
    F12 --> S_VERIFY
    F14 & F15 --> S_MOD
    F5 --> S_ADMIN
    F3 & F8 --> S_QUOTE
    F9 & F11 & F13 --> S_MEDIA
    F4 --> S_ADMIN
    F16 --> S_SEARCH
```

### AI Feature Catalog

| Feature | Groq Capability | Model | Trigger | Priority |
|---|---|---|---|---|
| **Query Intent Extraction** | Chat | llama-3.3-70b-versatile | Every search query | Critical |
| **Search Query Embedding** | Embeddings | Groq embeddings | Every search query | Critical |
| **Service Description Embedding** | Embeddings | Groq embeddings | Artisan profile create/update | Critical |
| **Search Result Summary** | Chat | llama-3.3-70b-versatile | After search ranking | Medium (skippable) |
| **Ghana Card OCR** | Vision | llama-3.3-70b-versatile | Verification upload | High |
| **Review Sentiment Analysis** | Classification | mixtral-8x7b-32768 | New review submitted | Medium |
| **Content Moderation Screening** | Classification | mixtral-8x7b-32768 | User-generated content | High |
| **Artisan Bio Generation** | Chat | llama-3.3-70b-versatile | Artisan onboarding | Low |
| **Service Request Clarifier** | Chat | llama-3.3-70b-versatile | Ambiguous service request | Low |
| **Dispute Summary** | Chat | llama-3.3-70b-versatile | Admin dispute review | Low |
| **Admin Analytics Insights** | Chat | llama-3.3-70b-versatile | Admin dashboard load | Low |
| **Recommendation Chatbot** | Chat | llama-3.3-70b-versatile | Customer interaction | Medium |
| **Portfolio Item Embedding** | Embeddings | Groq embeddings | Portfolio upload | Medium |
| **Portfolio Image Analysis** | Vision | llama-3.3-70b-versatile | Portfolio upload | Low |
| **Quote Description Helper** | Chat | llama-3.3-70b-versatile | Quote creation | Low |
| **Service Category Auto-tag** | Classification | mixtral-8x7b-32768 | Service creation | Medium |

### Rate-Limit Strategy

```
Priority Queue:
  P0 (Critical)  → Always execute. Block and retry on 429.
  P1 (High)      → Execute with single retry. Degrade gracefully.
  P2 (Medium)    → Execute if budget allows. Skip with fallback.
  P3 (Low)       → Queue for off-peak. User sees "generating..." state.
```

| Strategy | Implementation |
|---|---|
| **Priority Queue** | AI Service maintains a priority queue. Critical calls (search intent, embedding) pre-empt low-priority calls (bio generation). |
| **Response Caching** | Embedding results are cached in PostgreSQL. Identical queries within 24h reuse cached vectors. |
| **Debouncing** | Frontend debounces search input (300ms). Prevents rapid-fire Groq calls during typing. |
| **Graceful Degradation** | If Groq is unavailable or rate-limited, search falls back to keyword-only mode. Summaries are skipped. Sentiment defaults to "neutral". |
| **Batch Embedding** | When artisans update profiles, embedding generation is queued and batched (up to 10 per batch call). |

---

## 5. Infrastructure Diagram

The platform is deployed across four managed services, connected through HTTPS and WebSocket protocols. This serverless/managed approach eliminates the need for infrastructure operations, aligning with the lean team's capacity.

```mermaid
flowchart TB
    subgraph CLIENTS["Client Devices"]
        BROWSER["Web Browser"]
        MOBILE["Mobile Browser"]
    end

    subgraph VERCEL["Vercel — Frontend Hosting"]
        NEXT["Next.js 15 App"]
        SSR["Server-Side Rendering"]
        STATIC["Static Assets + CDN"]
        EDGE["Edge Middleware"]
        NEXT --> SSR
        NEXT --> STATIC
        NEXT --> EDGE
    end

    subgraph RAILWAY["Railway — Backend Hosting"]
        EXPRESS["Express.js API Server"]
        SOCKETIO["Socket.io Server"]
        WORKER["Background Job Runner"]
        EXPRESS --> SOCKETIO
        EXPRESS --> WORKER
    end

    subgraph SUPABASE["Supabase — Managed Backend"]
        SUPA_DB["PostgreSQL Database"]
        SUPA_VEC["pgvector Extension"]
        SUPA_AUTH_SVC["Auth Service"]
        SUPA_STORE_SVC["Storage Buckets"]
        SUPA_RT["Realtime (DB webhooks)"]
        SUPA_DB --> SUPA_VEC
    end

    subgraph EXTERNAL_APIS["External APIs"]
        GROQ_EXT["Groq API<br/>LLM + Embeddings + Vision"]
        MAPBOX_EXT["Mapbox API<br/>Maps + Geocoding"]
        RESEND_EXT["Resend API<br/>Transactional Email"]
    end

    subgraph MONITORING["Observability"]
        LOGS["Railway Logs"]
        SENTRY["Error Tracking"]
        ANALYTICS["Vercel Analytics"]
    end

    BROWSER & MOBILE -->|"HTTPS"| VERCEL
    BROWSER & MOBILE -->|"WSS"| RAILWAY

    VERCEL -->|"HTTPS REST API"| RAILWAY
    RAILWAY -->|"PostgreSQL protocol"| SUPABASE
    RAILWAY -->|"HTTPS"| GROQ_EXT
    RAILWAY -->|"HTTPS"| MAPBOX_EXT
    RAILWAY -->|"HTTPS"| RESEND_EXT

    VERCEL -->|"Direct client calls"| SUPA_AUTH_SVC
    VERCEL -->|"Direct client calls"| SUPA_STORE_SVC

    RAILWAY --> MONITORING
    VERCEL --> ANALYTICS
```

### Deployment Topology

| Component | Platform | Plan | Key Config |
|---|---|---|---|
| **Frontend** | Vercel | Hobby / Pro | Auto-deploy from `main` branch. Preview deploys on PRs. Edge middleware for geo-routing. |
| **Backend API** | Railway | Starter / Developer | Single service running Express + Socket.io. Auto-scaling by Railway. Health check at `/api/health`. |
| **Database** | Supabase | Free / Pro | PostgreSQL 15 with pgvector extension. Connection pooling via Supavisor. Row-Level Security (RLS) policies. |
| **Auth** | Supabase Auth | Included | Email/password + magic links. JWT auto-refresh. Auth emails via Supabase's built-in provider. |
| **Storage** | Supabase Storage | Included | Buckets: `avatars`, `portfolios`, `ghana-cards` (private), `service-images`. Size limits enforced per bucket. |
| **AI** | Groq Cloud | Free | API key rotation not required at free tier. 30 req/min rate limit enforced client-side. |
| **Maps** | Mapbox | Free tier | 100K free tile loads/month, 100K free geocoding requests/month. |
| **Email** | Resend | Free / Pro | 100 emails/day free. Templates for: welcome, quote received, booking confirmed, verification status. |

### Network and Security

| Concern | Approach |
|---|---|
| **HTTPS everywhere** | Vercel and Railway provide automatic TLS certificates. All API communication is encrypted in transit. |
| **CORS** | Backend allows only the Vercel frontend origin. Credentials mode enabled for auth cookies. |
| **API Key Security** | All third-party API keys (Groq, Mapbox, Resend) stored as Railway environment variables. Never exposed to the frontend. |
| **Supabase RLS** | Row-Level Security ensures users can only access their own data at the database level, even if application logic has bugs. |
| **WebSocket Auth** | Socket.io handshake validates the Supabase JWT before upgrading to WebSocket. Unauthenticated connections are rejected. |
| **File Upload Security** | Supabase Storage buckets enforce file type whitelists (JPEG, PNG, PDF) and size limits (5MB avatars, 10MB documents). |
| **Ghana Card Privacy** | Ghana Card images are stored in a private bucket with RLS. Only the owning user and admin/superadmin roles can access them. Extracted data is stored separately and the image can be purged after verification. |

### Environment Configuration

```
# Railway Environment Variables
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...@db.supabase.co:5432/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_ANON_KEY=eyJ...
GROQ_API_KEY=gsk_...
MAPBOX_ACCESS_TOKEN=pk.eyJ...
RESEND_API_KEY=re_...
FRONTEND_URL=https://artisanconnect.vercel.app
JWT_SECRET=<from-supabase>
SOCKET_CORS_ORIGIN=https://artisanconnect.vercel.app
```

---

## Key Design Decisions

### Why These Choices?

| Decision | Alternatives Considered | Rationale |
|---|---|---|
| **Groq as sole AI provider** | OpenAI, Anthropic, Hugging Face | Groq offers LLM, embeddings, and vision in a single API with a generous free tier. Avoids multi-provider complexity. Fast inference via LPU hardware. |
| **Supabase over raw PostgreSQL** | AWS RDS, PlanetScale, Neon | Supabase bundles Auth, Storage, Realtime, and a dashboard with PostgreSQL. Dramatically reduces setup time and operational burden. |
| **pgvector over Pinecone** | Pinecone, Weaviate, Qdrant | Keeping vectors in PostgreSQL avoids a separate vector database, simplifies joins between vector results and relational data (ratings, availability), and reduces costs. |
| **Socket.io over Supabase Realtime** | Supabase Realtime, Pusher, Ably | Socket.io provides more control over room management, typing indicators, and presence tracking. Supabase Realtime is used only for DB webhook triggers. |
| **Railway over AWS/GCP** | AWS ECS, Google Cloud Run, Fly.io | Railway offers simple container deployment with built-in CI/CD, logging, and environment management. No Kubernetes knowledge required. |
| **Resend over SendGrid** | SendGrid, Mailgun, AWS SES | Resend has a modern API, excellent developer experience, and React Email integration for template management. |
| **Mapbox over Google Maps** | Google Maps Platform | Mapbox offers more customisable map styles, better pricing for tile loads, and the GL JS library is more performant for interactive features. |

### Scalability Considerations

The current architecture is designed for **MVP to early growth** (hundreds of concurrent users). Key scaling levers for future growth:

1. **Horizontal API scaling** — Railway supports multiple replicas. Socket.io would need a Redis adapter for cross-instance room management.
2. **Read replicas** — Supabase Pro supports read replicas for heavy search traffic.
3. **pgvector indexing** — IVFFlat or HNSW indexes on the embedding column as the artisan count grows beyond 10K.
4. **Groq tier upgrade** — Moving to a paid Groq plan removes the 30 req/min limit.
5. **CDN for media** — Supabase Storage integrates with CDN for portfolio images at scale.
6. **Background job queue** — Migrate from in-process worker to a dedicated job queue (BullMQ + Redis) for embedding generation, email sending, and moderation tasks.

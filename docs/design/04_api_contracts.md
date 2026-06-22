# Deliverable 4: API Contract Specification

## General Patterns
- **Base URL:** `/api/v1`
- **Authentication:** ****** (JWT)
- **Response Format:**
  - Success: `{ "data": { ... } }`
  - Error: `{ "error": { "code": "...", "message": "..." } }`

## 1. Authentication (`/auth`)

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/register` | POST | Public | Register new user via Supabase |
| `/login` | POST | Public | Login via Supabase, return JWT |
| `/logout` | POST | Public | Invalidate current session |
| `/forgot-password`| POST | Public | Send password reset email via Supabase |

**Example: `POST /register`**
*Request:*
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "role": "customer",
  "first_name": "Kofi",
  "last_name": "Mensah",
  "phone": "+233..."
}
```

## 2. Users (`/users`)

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/profile` | GET | Auth | Get current user profile |
| `/profile` | PUT | Auth | Update profile (name, phone, GPS) |
| `/profile/onboarding` | PUT | Auth | Mark onboarding as completed |

## 3. Artisans (`/artisans`)

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/` | GET | Public | List artisans (filters: category, rating, location) |
| `/:id` | GET | Public | Get public profile details |
| `/` | POST | Auth(A)| Create artisan profile |
| `/:id` | PUT | Auth(A)| Update profile (bio, radius) |

## 4. Search (`/search`)

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/semantic` | POST | Public | Groq-powered semantic search |
| `/nearby` | GET | Public | Location-based search (Mapbox + PostGIS) |
| `/history` | GET | Auth | View past searches |

## 5. Verification (`/verification`)

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/upload` | POST | Auth(A)| Upload ID + selfie, triggers Groq OCR |
| `/status` | GET | Auth(A)| Check verification status |
| `/:id/review`| PUT | Admin | Approve or reject verification |

## 6. Requests (`/requests`)

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/` | POST | Auth(C)| Create new service request |
| `/:id` | GET | Auth | View request details |
| `/:id/status`| PUT | Auth | Update status (e.g., in_progress, completed) |

## 7. Quotes (`/quotes`)

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/` | POST | Auth(A)| Send price quote for request |
| `/:requestId`| GET | Auth | List quotes for a request |
| `/:id/accept`| PUT | Auth(C)| Accept quote (locks price, triggers escrow) |
| `/:id/reject`| PUT | Auth(C)| Reject quote |

## 8. Escrow Payments (`/payments`)

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/escrow` | POST | Auth(C)| Fund escrow after accepting quote |
| `/:requestId/release`| PUT | Auth(C)| Release funds to artisan upon completion |

## 9. Messages (`/messages`)

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/conversations` | GET | Auth | List chat conversations |
| `/:convId` | GET | Auth | Get messages for conversation |

*(Real-time delivery handled via WebSocket)*

## 10. AI (Groq API Wrappers) (`/ai`)

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/generate-bio` | POST | Auth(A)| LLM generates artisan bio from bullets |
| `/clarify-request` | POST | Auth(C)| Clarify vague service requests |
| `/extract-card` | POST | Auth(A)| Extract data from Ghana Card via Vision |

## 11. Admin & Superadmin (`/admin`)

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/users` | GET | Admin | List all users |
| `/users/:id/suspend` | PUT | Admin | Suspend user account |
| `/users/:id/promote` | PUT | S-Admin| Promote user to Admin |
| `/users/:id/demote` | PUT | S-Admin| Demote Admin to User |
| `/verification-queue`| GET | Admin | View pending verifications |
| `/audit-log` | GET | Admin | View system audit trail |

*(Note: S-Admin = Superadmin)*

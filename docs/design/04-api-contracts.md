# Deliverable 4: API Contract Specification

> **ArtisanConnect Ghana — AI-Powered Artisan Discovery Platform**
> Version 1.0 · June 2026

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication Endpoints](#1-authentication)
3. [User Endpoints](#2-users)
4. [Artisan Endpoints](#3-artisans)
5. [Search Endpoints](#4-search)
6. [Verification Endpoints](#5-verification)
7. [Service Request Endpoints](#6-service-requests)
8. [Quote Endpoints](#7-quotes)
9. [Review Endpoints](#8-reviews)
10. [Payment Endpoints](#9-payments)
11. [Message Endpoints](#10-messages)
12. [Notification Endpoints](#11-notifications)
13. [Availability Endpoints](#12-availability)
14. [Favorites Endpoints](#13-favorites)
15. [Portfolio Endpoints](#14-portfolio)
16. [Report Endpoints](#15-reports)
17. [Category Endpoints](#16-categories)
18. [Share Endpoints](#17-share)
19. [Admin Endpoints](#18-admin)
20. [Superadmin Endpoints](#19-superadmin)
21. [AI Endpoints](#20-ai-groq)
22. [Email Endpoints](#21-email)
23. [Media Endpoints](#22-media)

---

## API Overview

### Base URL
```
Production: https://api.artisanconnect.gh/api/v1
Development: http://localhost:5000/api/v1
```

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <supabase_jwt_access_token>
```

### Standard Response Format
```json
{
  "success": true,
  "data": { },
  "message": "Operation completed successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "Must be a valid email address" }
    ]
  }
}
```

### Common Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid request body or params |
| 401 | `UNAUTHORIZED` | Missing or invalid JWT |
| 403 | `FORBIDDEN` | Insufficient role permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Duplicate resource |
| 429 | `RATE_LIMITED` | Too many requests (Groq or API) |
| 500 | `INTERNAL_ERROR` | Server error |

### Role Abbreviations
- 🌐 Public (no auth required)
- 👤 Authenticated (any role)
- 🛒 Customer only
- 🔧 Artisan only
- 🛡️ Admin + Superadmin
- 👑 Superadmin only

---

## 1. Authentication

### `POST /auth/register` 🌐

Register a new user with role selection.

**Request Body:**
```json
{
  "full_name": "Kwame Asante",
  "email": "kwame@example.com",
  "phone": "+233201234567",
  "password": "SecureP@ss123",
  "role": "customer"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `full_name` | string | ✅ | 2-100 chars |
| `email` | string | ✅ | Valid email, unique |
| `phone` | string | ✅ | Ghana format +233XXXXXXXXX |
| `password` | string | ✅ | Min 8 chars, 1 uppercase, 1 number |
| `role` | enum | ✅ | `customer` or `artisan` |

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "full_name": "Kwame Asante",
      "email": "kwame@example.com",
      "role": "customer",
      "onboarding_completed": false,
      "created_at": "2026-06-20T10:00:00Z"
    }
  },
  "message": "Registration successful. Please verify your email."
}
```

**Errors:** `409 CONFLICT` (email exists), `400 VALIDATION_ERROR`

---

### `POST /auth/login` 🌐

**Request Body:**
```json
{
  "email": "kwame@example.com",
  "password": "SecureP@ss123"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbG...",
    "refresh_token": "v1.MR...",
    "expires_in": 3600,
    "user": {
      "id": "uuid",
      "full_name": "Kwame Asante",
      "email": "kwame@example.com",
      "role": "customer",
      "avatar_url": "https://...",
      "onboarding_completed": true
    }
  }
}
```

**Errors:** `401 UNAUTHORIZED` (invalid credentials), `403 FORBIDDEN` (email not verified), `403 FORBIDDEN` (account suspended)

---

### `POST /auth/logout` 👤

Invalidates the current session.

**Headers:** `Authorization: Bearer <token>`

**Response: 200 OK**

---

### `POST /auth/forgot-password` 🌐

**Request Body:**
```json
{ "email": "kwame@example.com" }
```

**Response: 200 OK** (always returns success to prevent email enumeration)

---

### `POST /auth/reset-password` 🌐

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewSecureP@ss456"
}
```

**Response: 200 OK**

---

### `POST /auth/refresh` 👤

**Request Body:**
```json
{ "refresh_token": "v1.MR..." }
```

**Response: 200 OK** (new access_token + refresh_token)

---

## 2. Users

### `GET /users/profile` 👤

Get current user's profile.

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "full_name": "Kwame Asante",
    "email": "kwame@example.com",
    "phone": "+233201234567",
    "role": "customer",
    "avatar_url": "https://...",
    "latitude": 5.6037,
    "longitude": -0.1870,
    "region": "Greater Accra",
    "district": "Accra Metropolitan",
    "onboarding_completed": true,
    "created_at": "2026-06-20T10:00:00Z"
  }
}
```

---

### `PUT /users/profile` 👤

Update current user's profile.

**Request Body (partial update):**
```json
{
  "full_name": "Kwame A. Asante",
  "phone": "+233201234567",
  "latitude": 5.6037,
  "longitude": -0.1870,
  "region": "Greater Accra",
  "district": "Accra Metropolitan"
}
```

**Response: 200 OK** (updated user object)

---

### `PUT /users/profile/onboarding` 👤

Update onboarding progress.

**Request Body:**
```json
{
  "step": "set_location",
  "completed": true
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "onboarding_completed": false,
    "progress": 33,
    "completed_steps": ["set_location"],
    "remaining_steps": ["browse_categories", "first_search"]
  }
}
```

---

### `DELETE /users/profile` 👤

Soft-delete user account.

**Response: 200 OK**

---

## 3. Artisans

### `GET /artisans` 🌐

List artisans with filtering and pagination.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | int | 1 | Page number |
| `limit` | int | 20 | Items per page (max 50) |
| `category_id` | uuid | — | Filter by category |
| `subcategory_id` | uuid | — | Filter by subcategory |
| `verified` | boolean | — | Filter by verification status |
| `min_rating` | number | — | Minimum average rating |
| `available` | boolean | — | Currently available only |
| `lat` | number | — | Customer latitude (for distance) |
| `lng` | number | — | Customer longitude (for distance) |
| `radius_km` | number | 25 | Search radius in km |
| `sort` | string | `rating` | Sort: `rating`, `distance`, `reviews` |

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "full_name": "Ama Mensah",
        "avatar_url": "https://..."
      },
      "profession": "Plumber",
      "bio": "Experienced plumber serving the Greater Accra region...",
      "experience_years": 8,
      "service_radius_km": 15,
      "verification_status": "approved",
      "average_rating": 4.8,
      "total_reviews": 42,
      "availability_status": "available",
      "distance_km": 3.2,
      "services": [
        {
          "id": "uuid",
          "title": "Pipe Repair",
          "subcategory": { "id": "uuid", "name": "Pipe Repair" },
          "price_range_min": 50,
          "price_range_max": 200
        }
      ]
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 45 }
}
```

---

### `GET /artisans/:id` 🌐

Get full public profile of an artisan.

**Response: 200 OK** — includes services, portfolio items, reviews, availability schedule

---

## 4. Search

### `POST /search/semantic` 🌐

AI-powered semantic search using Groq + pgvector + Mapbox.

**Request Body:**
```json
{
  "query": "I need someone to fix my leaking pipe in Kasoa",
  "latitude": 5.5348,
  "longitude": -0.4175,
  "radius_km": 20,
  "filters": {
    "verified_only": true,
    "min_rating": 3.5,
    "available_now": false,
    "category_id": null
  }
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "intent": {
      "service_type": "Plumbing",
      "specific_issue": "Pipe leak repair",
      "urgency": "high",
      "search_query": "plumber pipe leak fix"
    },
    "summary": "Found 5 verified plumbers near Kasoa. Kwame A. is the closest (1.2km) with a 4.8★ rating.",
    "results": [
      {
        "artisan": { "id": "uuid", "name": "Kwame Asante", "avatar_url": "..." },
        "service": { "id": "uuid", "title": "Pipe Repair & Installation" },
        "scores": {
          "semantic_similarity": 0.92,
          "distance_score": 0.85,
          "rating_score": 0.96,
          "verification_score": 1.0,
          "final_score": 0.918
        },
        "distance_km": 1.2,
        "average_rating": 4.8,
        "verification_status": "approved",
        "availability_status": "available",
        "price_range": { "min": 50, "max": 200, "currency": "GHS" }
      }
    ],
    "total_results": 5,
    "ai_powered": true
  }
}
```

**Fallback Response** (when Groq unavailable): Same shape but `ai_powered: false`, no `intent`, no `summary`, keyword-matched results.

---

### `GET /search/nearby` 🌐

Simple location-based search without AI.

**Query Params:** `lat`, `lng`, `radius_km`, `category_id`, `page`, `limit`

**Response: 200 OK** — artisan list sorted by distance

---

### `GET /search/history` 🛒

Get customer's recent search queries.

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "query_text": "plumber in Kasoa",
      "result_count": 5,
      "created_at": "2026-06-20T09:30:00Z"
    }
  ]
}
```

---

### `GET /search/recently-viewed` 🛒

Get recently viewed artisan profiles.

**Response: 200 OK** — list of artisan profile summaries

---

## 5. Verification

### `POST /verification/upload` 🔧

Upload Ghana Card image + selfie for verification.

**Request:** `multipart/form-data`

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `card_image` | file | ✅ | JPEG/PNG, max 5MB |
| `selfie` | file | ✅ | JPEG/PNG, max 5MB |

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "verification_id": "uuid",
    "status": "pending",
    "ai_extraction": {
      "full_name": "Kwame Asante",
      "card_number": "GHA-XXXXXXXXXX-X",
      "date_of_birth": "1990-05-15",
      "expiry_date": "2030-12-31",
      "confidence_score": 0.94
    }
  },
  "message": "Documents uploaded. AI has extracted your card details for review."
}
```

---

### `GET /verification/status` 🔧

Get current verification status for the authenticated artisan.

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "status": "pending",
    "submitted_at": "2026-06-20T10:00:00Z",
    "card_image_url": "https://...",
    "selfie_url": "https://...",
    "admin_notes": null
  }
}
```

---

### `PUT /verification/:id/review` 🛡️

Admin reviews a verification submission.

**Request Body:**
```json
{
  "status": "approved",
  "notes": "Identity confirmed. Card and selfie match."
}
```

**Response: 200 OK**

---

## 6. Service Requests

### `POST /requests` 🛒

Create a new service request.

**Request Body:**
```json
{
  "artisan_id": "uuid",
  "service_id": "uuid",
  "description": "My kitchen pipe is leaking badly and flooding the floor",
  "preferred_date": "2026-06-25",
  "budget_min": 100,
  "budget_max": 300
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "pending",
    "ai_clarified_description": "Kitchen pipe leak causing flooding. Requires urgent pipe repair, possibly pipe replacement. Customer budget: GHS 100-300.",
    "created_at": "2026-06-20T10:00:00Z"
  }
}
```

---

### `GET /requests` 👤

List service requests for the authenticated user (as customer or artisan).

**Query Params:** `status`, `page`, `limit`, `sort`

**Response: 200 OK** — paginated request list with artisan/customer info, quote status

---

### `GET /requests/:id` 👤

Get full request details (only accessible to involved parties + admins).

**Response: 200 OK** — request + quotes + escrow + review data

---

### `PUT /requests/:id` 👤

Update request status.

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Allowed transitions:** See workflow diagram section 3.4

---

## 7. Quotes

### `POST /quotes` 🔧

Artisan sends a price quote for a service request.

**Request Body:**
```json
{
  "request_id": "uuid",
  "amount": 150.00,
  "description": "I will replace the leaking pipe section and test for additional leaks. Includes materials.",
  "valid_until": "2026-06-22T23:59:59Z"
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "amount": 150.00,
    "description": "I will replace the leaking pipe...",
    "status": "pending",
    "valid_until": "2026-06-22T23:59:59Z",
    "created_at": "2026-06-20T10:00:00Z"
  }
}
```

---

### `GET /quotes/:requestId` 👤

Get all quotes for a service request.

**Response: 200 OK** — list of quotes with artisan info

---

### `PUT /quotes/:id/accept` 🛒

Customer accepts a quote. Triggers escrow flow.

**Response: 200 OK**

---

### `PUT /quotes/:id/reject` 🛒

Customer rejects a quote. Request returns to pending.

**Response: 200 OK**

---

## 8. Reviews

### `POST /reviews` 🛒

Submit a review for a completed service request.

**Request Body:**
```json
{
  "request_id": "uuid",
  "rating": 5,
  "comment": "Kwame did an excellent job fixing my pipe. Very professional and on time."
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `request_id` | uuid | ✅ | Must be completed, no existing review |
| `rating` | int | ✅ | 1-5 |
| `comment` | string | ✅ | 10-1000 chars |

**Response: 201 Created** — includes AI sentiment analysis

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "rating": 5,
    "comment": "Kwame did an excellent job...",
    "sentiment": "positive",
    "created_at": "2026-06-20T10:00:00Z"
  }
}
```

---

### `GET /reviews/:artisanId` 🌐

Get paginated reviews for an artisan.

**Query Params:** `page`, `limit`, `sort` (newest/highest/lowest)

**Response: 200 OK** — paginated reviews with customer name + avatar

---

## 9. Payments

### `POST /payments/escrow` 🛒

Create escrow payment from accepted quote.

**Request Body:**
```json
{
  "request_id": "uuid"
}
```

Amount is automatically derived from the accepted quote.

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "amount": 150.00,
    "currency": "GHS",
    "status": "held",
    "created_at": "2026-06-20T10:00:00Z"
  },
  "message": "GHS 150.00 is now held in escrow."
}
```

---

### `PUT /payments/:id/release` 🛒

Customer releases escrow after confirming job completion.

**Response: 200 OK**

---

### `PUT /payments/:id/refund` 🛡️

Admin refunds escrow during dispute resolution.

**Response: 200 OK**

---

## 10. Messages

### `POST /messages` 👤

Send a message (via REST, also available via WebSocket).

**Request Body:**
```json
{
  "conversation_id": "uuid",
  "content": "Hello, when can you come to fix the pipe?"
}
```

**Response: 201 Created**

---

### `GET /messages/conversations` 👤

List all conversations for the authenticated user.

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "participant": {
        "id": "uuid",
        "full_name": "Kwame Asante",
        "avatar_url": "...",
        "is_online": true
      },
      "last_message": {
        "content": "I'll be there by 2pm",
        "created_at": "2026-06-20T09:30:00Z",
        "is_mine": false
      },
      "unread_count": 2
    }
  ]
}
```

---

### `GET /messages/conversations/:id` 👤

Get paginated messages in a conversation.

**Query Params:** `page`, `limit`, `before` (cursor-based pagination)

**Response: 200 OK** — message list with sender info, read status

---

## 11. Notifications

### `GET /notifications` 👤

Get notifications for the authenticated user.

**Query Params:** `page`, `limit`, `type`, `unread_only`

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "new_request",
      "title": "New Service Request",
      "content": "Ama Mensah has requested Pipe Repair",
      "is_read": false,
      "reference_type": "service_request",
      "reference_id": "uuid",
      "created_at": "2026-06-20T10:00:00Z"
    }
  ],
  "meta": { "unread_count": 5 }
}
```

---

### `PUT /notifications/:id/read` 👤

Mark a single notification as read.

**Response: 200 OK**

---

### `PUT /notifications/read-all` 👤

Mark all notifications as read.

**Response: 200 OK**

---

## 12. Availability

### `GET /availability/:artisanId` 🌐

Get an artisan's availability schedule.

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "status": "available",
    "schedule": [
      { "day_of_week": 0, "label": "Sunday", "is_available": false },
      { "day_of_week": 1, "label": "Monday", "start_time": "08:00", "end_time": "17:00", "is_available": true },
      { "day_of_week": 2, "label": "Tuesday", "start_time": "08:00", "end_time": "17:00", "is_available": true }
    ],
    "days_off": ["2026-06-25", "2026-07-04"]
  }
}
```

---

### `PUT /availability` 🔧

Update weekly schedule.

**Request Body:**
```json
{
  "schedule": [
    { "day_of_week": 1, "start_time": "08:00", "end_time": "17:00", "is_available": true },
    { "day_of_week": 0, "is_available": false }
  ]
}
```

**Response: 200 OK**

---

### `PUT /availability/status` 🔧

Toggle availability status.

**Request Body:**
```json
{ "status": "available" }
```

Allowed values: `available`, `busy`, `offline`

**Response: 200 OK**

---

### `POST /availability/day-off` 🔧

Mark a specific date as day off.

**Request Body:**
```json
{ "date": "2026-06-25" }
```

**Response: 201 Created**

---

## 13. Favorites

### `POST /favorites` 🛒

Bookmark an artisan.

**Request Body:**
```json
{ "artisan_id": "uuid" }
```

**Response: 201 Created**

**Errors:** `409 CONFLICT` (already favorited)

---

### `DELETE /favorites/:artisanId` 🛒

Remove a bookmark.

**Response: 200 OK**

---

### `GET /favorites` 🛒

List all favorited artisans.

**Query Params:** `page`, `limit`

**Response: 200 OK** — paginated artisan profile cards

---

## 14. Portfolio

### `POST /portfolio` 🔧

Add a portfolio item.

**Request:** `multipart/form-data`

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | string | ✅ | 5-100 chars |
| `description` | string | ❌ | Max 500 chars |
| `image` | file | ✅ | JPEG/PNG, max 5MB |
| `before_image` | file | ❌ | JPEG/PNG, max 5MB |
| `after_image` | file | ❌ | JPEG/PNG, max 5MB |

**Response: 201 Created**

---

### `PUT /portfolio/:id` 🔧

Update a portfolio item (title, description, reorder).

**Response: 200 OK**

---

### `DELETE /portfolio/:id` 🔧

Delete a portfolio item (also removes files from Supabase Storage).

**Response: 200 OK**

---

### `GET /portfolio/:artisanId` 🌐

Get an artisan's portfolio gallery.

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Kitchen Pipe Replacement",
      "description": "Complete pipe replacement for a customer in Kasoa",
      "image_url": "https://...",
      "before_image_url": "https://...",
      "after_image_url": "https://...",
      "display_order": 1,
      "created_at": "2026-06-15T10:00:00Z"
    }
  ]
}
```

---

## 15. Reports

### `POST /reports` 👤

Submit a report against a user or review.

**Request Body:**
```json
{
  "reported_user_id": "uuid",
  "reported_review_id": null,
  "reason": "fraud",
  "description": "This user is pretending to be a verified electrician but has no real skills."
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `reported_user_id` | uuid | ✅ | Cannot report self |
| `reported_review_id` | uuid | ❌ | If reporting a specific review |
| `reason` | enum | ✅ | `fraud`, `spam`, `inappropriate`, `fake_review`, `other` |
| `description` | string | ✅ | 20-1000 chars |

**Response: 201 Created**

---

### `GET /reports` 🛡️

Admin view of all reports.

**Query Params:** `status` (pending/reviewed/resolved/dismissed), `page`, `limit`

**Response: 200 OK** — reports with reporter and reported user info

---

### `PUT /reports/:id/review` 🛡️

Admin takes action on a report.

**Request Body:**
```json
{
  "action": "suspend",
  "notes": "Verified as fake profile. Account suspended."
}
```

Allowed actions: `warn`, `suspend`, `dismiss`

**Response: 200 OK**

---

## 16. Categories

### `GET /categories` 🌐

List all service categories with subcategories.

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Plumbing",
      "description": "Pipe repair, installation, and maintenance",
      "icon": "🔧",
      "subcategories": [
        { "id": "uuid", "name": "Pipe Repair" },
        { "id": "uuid", "name": "Toilet Installation" },
        { "id": "uuid", "name": "Water Heater" }
      ]
    }
  ]
}
```

---

### `GET /categories/:id/subcategories` 🌐

List subcategories for a specific category.

**Response: 200 OK**

---

### `POST /categories` 🛡️

Admin creates a new category.

**Request Body:**
```json
{
  "name": "Solar Installation",
  "description": "Solar panel installation and maintenance",
  "icon": "☀️"
}
```

**Response: 201 Created**

---

### `POST /categories/:id/subcategories` 🛡️

Admin creates a subcategory under a category.

**Request Body:**
```json
{
  "name": "Panel Installation",
  "description": "Installation of solar panels on rooftops"
}
```

**Response: 201 Created**

---

## 17. Share

### `GET /share/artisan/:id/share-link` 🌐

Generate a shareable link with Open Graph metadata for an artisan's profile.

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "url": "https://artisanconnect.gh/artisan/abc123",
    "title": "Kwame Asante - Verified Plumber on ArtisanConnect",
    "description": "⭐ 4.8 rating · 42 reviews · Serving Kasoa area · Verified ✓",
    "image": "https://storage.supabase.co/avatars/kwame.jpg",
    "whatsapp_url": "https://wa.me/?text=Check%20out%20Kwame%20on%20ArtisanConnect..."
  }
}
```

---

## 18. Admin

### `GET /admin/users` 🛡️

List all users with search and filtering.

**Query Params:** `search` (name/email), `role`, `is_suspended`, `page`, `limit`

**Response: 200 OK** — paginated user list with role badges

---

### `PUT /admin/users/:id/suspend` 🛡️

Suspend or unsuspend a user.

**Request Body:**
```json
{
  "is_suspended": true,
  "reason": "Multiple reports of fraudulent activity"
}
```

**Response: 200 OK** (action logged to audit_log)

---

### `GET /admin/analytics` 🛡️

Get platform analytics.

**Query Params:** `period` (7d/30d/90d/all)

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "users": { "total": 1250, "customers": 800, "artisans": 440, "admins": 10 },
    "registrations": { "this_period": 85, "change_pct": 12.5 },
    "requests": { "total": 3200, "completed": 2800, "disputed": 45 },
    "revenue": { "total_ghs": 125000, "released_ghs": 110000, "held_ghs": 15000 },
    "verifications": { "pending": 12, "approved": 380, "rejected": 48 },
    "ai_usage": { "total_calls": 15000, "avg_latency_ms": 180, "features": {} }
  }
}
```

---

### `GET /admin/verification-queue` 🛡️

Get pending verification submissions.

**Response: 200 OK** — list of pending verifications with AI extraction data

---

### `GET /admin/audit-log` 🛡️

Get admin activity audit log.

**Query Params:** `actor_id`, `action`, `target_type`, `from_date`, `to_date`, `page`, `limit`

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "actor": { "id": "uuid", "full_name": "Admin User", "role": "admin" },
      "action": "verify_artisan",
      "target_type": "verification",
      "target_id": "uuid",
      "details": { "status": "approved", "notes": "Identity confirmed" },
      "ip_address": "102.176.xx.xx",
      "created_at": "2026-06-20T10:00:00Z"
    }
  ]
}
```

---

### `GET /admin/reports` 🛡️

Alias for `GET /reports` with admin view.

---

## 19. Superadmin

### `PUT /superadmin/users/:id/promote` 👑

Promote a user to admin role.

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "previous_role": "customer",
    "new_role": "admin"
  },
  "message": "User promoted to admin successfully."
}
```

**Errors:** `403 FORBIDDEN` (not superadmin), `400` (target already admin/superadmin)

---

### `PUT /superadmin/users/:id/demote` 👑

Demote an admin to customer role.

**Response: 200 OK**

**Errors:** `403 FORBIDDEN` (not superadmin), `400` (cannot demote superadmin)

---

### `GET /superadmin/admins` 👑

List all admin and superadmin users.

**Response: 200 OK** — list of admin users with promotion dates

---

## 20. AI (Groq)

### `POST /ai/generate-bio` 🔧

Generate a professional bio using Groq LLM.

**Request Body:**
```json
{
  "profession": "Plumber",
  "experience_years": 8,
  "skills": ["Pipe repair", "Water heater installation", "Drainage systems"],
  "location": "Kasoa, Central Region"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "bio": "With over 8 years of hands-on experience in plumbing...",
    "word_count": 175,
    "model": "llama-3.3-70b-versatile",
    "latency_ms": 180
  }
}
```

---

### `POST /ai/clarify-request` 🛒

AI clarifies a vague service request description.

**Request Body:**
```json
{
  "description": "something wrong with my water"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "clarified_description": "Water supply issue - possible pipe leak, low water pressure, or water heater malfunction. Customer should specify: location of problem, when it started, and type of water system.",
    "suggested_questions": [
      "Where exactly is the water issue? (kitchen, bathroom, outdoor)",
      "Is the water leaking, not flowing, or discolored?",
      "When did the problem start?"
    ]
  }
}
```

---

### `POST /ai/analyze-review` 👤 (internal, triggered on review creation)

Analyze review sentiment using Groq.

**Request Body:**
```json
{
  "review_text": "Great work, but arrived 30 minutes late",
  "rating": 4
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "sentiment": "positive",
    "themes": ["quality_work", "punctuality_issue"],
    "rating_sentiment_match": true
  }
}
```

---

### `POST /ai/extract-card` 🔧 (internal, triggered on verification upload)

Extract Ghana Card details using Groq Vision.

**Request Body:** base64 encoded card image

**Response: 200 OK** — structured extraction JSON

---

### `POST /ai/summarize-dispute` 🛡️ (internal)

Generate AI dispute summary for admin review.

---

### `POST /ai/chat` 🛒

Customer recommendation chatbot (dual-mode).

**Request Body:**
```json
{
  "message": "I need help finding someone to paint my house",
  "conversation_history": [],
  "mode": "quick_guide"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "response": "I can help you find a painter! A few quick questions:\n1. How large is the area to be painted?\n2. Interior or exterior painting?\n3. What's your location?",
    "mode": "quick_guide",
    "step": 1,
    "search_triggered": false
  }
}
```

---

## 21. Email

### `POST /email/send` 🛡️ (internal service use)

Trigger a transactional email.

**Request Body:**
```json
{
  "template": "job-completed",
  "to_user_id": "uuid",
  "data": {
    "customer_name": "Ama",
    "artisan_name": "Kwame",
    "service": "Pipe Repair",
    "amount": 150
  }
}
```

**Response: 200 OK**

---

### `GET /email/logs` 🛡️

View email delivery logs.

**Query Params:** `user_id`, `template_type`, `status`, `page`, `limit`

**Response: 200 OK** — paginated email logs

---

## 22. Media

### `POST /media/upload` 👤

Upload a file (image) to Supabase Storage.

**Request:** `multipart/form-data`

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `file` | file | ✅ | JPEG/PNG/WebP, max 5MB |
| `bucket` | string | ✅ | `avatars`, `portfolios`, `verification-docs` |

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://storage.supabase.co/...",
    "original_name": "photo.jpg",
    "size_bytes": 245000,
    "mime_type": "image/jpeg"
  }
}
```

---

### `DELETE /media/:id` 👤

Delete an uploaded file (owner only).

**Response: 200 OK**

---

### `GET /media/user/:userId` 🛡️

List all media files for a user (admin only).

**Response: 200 OK** — paginated file list

---

## WebSocket Events (Socket.io)

In addition to REST endpoints, the following real-time events are available via Socket.io:

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `send_message` | `{conversation_id, content}` | Send a chat message |
| `typing_start` | `{conversation_id}` | User started typing |
| `typing_stop` | `{conversation_id}` | User stopped typing |
| `mark_read` | `{conversation_id, last_message_id}` | Mark messages as read |
| `join_room` | `{conversation_id}` | Join a chat room |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `new_message` | `{message}` | New message received |
| `user_typing` | `{user_id, conversation_id}` | Someone is typing |
| `user_stopped_typing` | `{user_id}` | Someone stopped typing |
| `messages_read` | `{conversation_id, read_by}` | Read receipt |
| `new_notification` | `{notification}` | Push notification |
| `user_online` | `{user_id}` | User came online |
| `user_offline` | `{user_id}` | User went offline |
| `availability_changed` | `{artisan_id, status}` | Artisan status update |

---

> **Next**: [Deliverable 5 — AI & Intelligence Layer](./05-ai-intelligence-layer.md) details the Groq-powered features, prompt templates, and search pipeline.

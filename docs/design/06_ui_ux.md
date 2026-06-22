# Deliverable 6: UI/UX Wireframes & Design System

## 1. Design System
- **Framework:** Tailwind CSS + ShadCN UI
- **Color Palette:**
  - Primary: Kente Gold (`#F2A900`)
  - Secondary: Forest Green (`#006B3F`)
  - Accent: Vibrant Red (`#D30000`)
  - Neutral: Slate/Gray scales (`#0f172a` to `#f8fafc`)
- **Typography:** Inter (Headings & Body)
- **Border Radius:** `rounded-lg` (8px) for cards, `rounded-md` (6px) for inputs.

## 2. Key Pages / Wireframe Concepts

### 2.1 Landing Page
- **Hero Section:** "Find Trusted Artisans in Ghana." Large search bar (powered by Groq intent extraction).
- **Featured Categories:** Grid of icons (Plumbing, Electrical, Carpentry).
- **How it Works:** 3 steps (Search -> Book -> Escrow Payment).
- **Testimonials:** Carousel of top reviews.

### 2.2 Customer Dashboard
- **My Requests:** Tabs for Pending, In Progress, Completed.
- **Favorites:** Grid of saved artisan cards.
- **Recent Searches:** Quick links to repeat past searches.

### 2.3 Artisan Dashboard
- **Stats:** Active jobs, pending quotes, rating, earnings.
- **Availability Toggle:** Online/Offline switch, schedule manager.
- **Pending Requests:** List of incoming customer requests needing quotes.
- **Verification Banner:** If pending or rejected, prominent banner linking to the upload form.

### 2.4 Search Results Page
- **Layout:** Two-column (Filters on left/top, Results on right) or Map View.
- **AI Summary Box:** "Found 5 verified plumbers near you..." (Groq generated).
- **Result Cards:** Artisan photo, name, rating, distance, AI-generated bio snippet, "Request Quote" button.

### 2.5 Profile Page (Public)
- **Header:** Cover photo, avatar, verification badge.
- **Bio:** AI-enhanced professional description.
- **Portfolio:** Grid of before/after photos.
- **Reviews:** List with sentiment tags.
- **Action Bar:** "Request Service", "Save to Favorites", "Share".

### 2.6 Chat & Quoting Interface
- **Chat Window:** Real-time messages (WebSocket).
- **Quote Widget:** Artisan can click "Send Quote" to embed a formal quote in the chat. Customer sees "Accept/Reject" buttons.

### 2.7 Admin Dashboard
- **Verification Queue:** Table of pending Ghana Card uploads with Groq Vision extractions alongside images.
- **Disputes:** List of active disputes with Groq-generated case summaries.
- **Reports:** Moderation queue for user reports.

## 3. UI/UX Flow for AI Features
- **Smart Search:** Seamless experience. User types freely, backend parses intent.
- **Bio Generator:** "✨ Generate Bio with AI" button on profile edit form. Shows skeleton loader while Groq generates.
- **Dispute Summary:** Admin sees a highlighted box at the top of the dispute page.

## 4. Mobile Responsiveness
- All views are mobile-first.
- Bottom navigation bar on mobile for Customers (Home, Search, Chat, Profile).
- Bottom navigation for Artisans (Dashboard, Requests, Chat, Profile).

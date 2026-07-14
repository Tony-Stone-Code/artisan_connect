# Deliverable 6: UI/UX Wireframes & Design System

> **ArtisanConnect Ghana — AI-Powered Artisan Discovery Platform**
> Version 1.0 · June 2026

---

## Table of Contents

1. [Design System](#1-design-system)
2. [Wireframes — Public Pages](#2-wireframes--public-pages)
3. [Wireframes — Customer Pages](#3-wireframes--customer-pages)
4. [Wireframes — Artisan Pages](#4-wireframes--artisan-pages)
5. [Wireframes — Admin Pages](#5-wireframes--admin-pages)
6. [Wireframes — Superadmin Pages](#6-wireframes--superadmin-pages)
7. [Wireframes — Shared Components](#7-wireframes--shared-components)

---

## 1. Design System

### 1.1 Color Palette

Ghana-inspired colors with modern dark/light mode support.

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--primary` | `#D4A843` (Ghana Gold) | `#D4A843` | Primary actions, CTAs, highlights |
| `--primary-hover` | `#B8922E` | `#E8BC5A` | Hover states |
| `--secondary` | `#006B3F` (Ghana Green) | `#00A86B` | Success states, verified badges |
| `--accent` | `#CE1126` (Ghana Red) | `#FF4757` | Alerts, warnings, notifications |
| `--bg-primary` | `#FFFFFF` | `#0F0F0F` | Page background |
| `--bg-secondary` | `#F8F9FA` | `#1A1A2E` | Card backgrounds |
| `--bg-tertiary` | `#F0F0F0` | `#16213E` | Sidebar, input backgrounds |
| `--text-primary` | `#1A1A1A` | `#F5F5F5` | Body text |
| `--text-secondary` | `#6B7280` | `#9CA3AF` | Secondary text, labels |
| `--border` | `#E5E7EB` | `#2D2D44` | Borders, dividers |
| `--verified-badge` | `#006B3F` | `#00A86B` | Verification checkmark |
| `--star-rating` | `#F59E0B` | `#FBBF24` | Star ratings |

### 1.2 Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 | Inter | 700 (Bold) | 32px / 2rem |
| H2 | Inter | 600 (Semibold) | 24px / 1.5rem |
| H3 | Inter | 600 | 20px / 1.25rem |
| Body | System Sans-Serif | 400 (Regular) | 16px / 1rem |
| Body Small | System Sans-Serif | 400 | 14px / 0.875rem |
| Caption | System Sans-Serif | 500 | 12px / 0.75rem |
| Button | Inter | 600 | 14px / 0.875rem |

### 1.3 Spacing Scale

Base unit: **4px**

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Inline spacing |
| `sm` | 8px | Tight spacing |
| `md` | 16px | Standard spacing |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Large gaps |
| `2xl` | 48px | Section margins |
| `3xl` | 64px | Page margins |

### 1.4 Border Radius

| Element | Radius |
|---------|--------|
| Cards | 12px |
| Inputs | 8px |
| Buttons | 8px |
| Avatars | 50% (circle) |
| Badges | 16px (pill) |
| Modals | 16px |

### 1.5 Shadows

| Level | Value | Usage |
|-------|-------|-------|
| `sm` | `0 1px 2px rgba(0,0,0,0.05)` | Inputs, small cards |
| `md` | `0 4px 6px rgba(0,0,0,0.07)` | Cards, dropdowns |
| `lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, popovers |
| `xl` | `0 20px 25px rgba(0,0,0,0.15)` | Floating elements |

### 1.6 Component Library (ShadCN)

| Component | Usage |
|-----------|-------|
| Button | Primary, Secondary, Ghost, Danger variants |
| Input | Text, Password, Search, Textarea |
| Select | Dropdown, Multi-select |
| Card | Artisan cards, request cards, stat cards |
| Dialog | Confirmations, forms, alerts |
| Badge | Status badges, role badges, verification |
| Avatar | User photos with fallback initials |
| Tabs | Dashboard sections, search views |
| Toast | Success, error, info notifications |
| Skeleton | Loading states for all cards |
| Sheet | Mobile sidebar navigation |
| Command | Search palette (Cmd+K) |

### 1.7 Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640px - 1024px | Two column, sidebar collapsed |
| Desktop | > 1024px | Full layout, sidebar expanded |

---

## 2. Wireframes — Public Pages

### 2.1 Landing Page

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect Ghana    [Login]  [Register as Artisan]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│           Find Trusted Artisans Near You                    │
│       Verified professionals at your doorstep               │
│                                                             │
│  ┌───────────────────────────────────────────────┐          │
│  │ 🔍 "I need a plumber to fix my leaking pipe"  │ [Search] │
│  └───────────────────────────────────────────────┘          │
│  📍 Kasoa, Greater Accra  |  [Use my location]             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Popular Categories:                                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ 🔧   │ │ ⚡   │ │ 🎨   │ │ 🪚   │ │ 🏗️   │ │ ❄️   │   │
│  │Plumb.│ │Elec. │ │Paint.│ │Carp. │ │Mason.│ │ AC   │   │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │
├─────────────────────────────────────────────────────────────┤
│  Featured Verified Artisans:                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │  [Avatar]    │ │  [Avatar]    │ │  [Avatar]    │          │
│  │  Kwame A.    │ │  Ama M.      │ │  Kofi E.     │          │
│  │  Plumber     │ │  Electrician │ │  Carpenter   │          │
│  │  ⭐ 4.8 (42) │ │  ⭐ 4.9 (38) │ │  ⭐ 4.7 (55) │          │
│  │  ✓ Verified  │ │  ✓ Verified  │ │  ✓ Verified  │          │
│  │  Kasoa       │ │  Tema        │ │  Accra       │          │
│  │ [View Profile]│ │ [View Profile]│ │ [View Profile]│         │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  How It Works:                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐               │
│  │ 1. Search │──▶│ 2. Book  │──▶│ 3. Pay   │               │
│  │ Find your │   │ Send a   │   │ Secure   │               │
│  │ artisan   │   │ request  │   │ escrow   │               │
│  └──────────┘   └──────────┘   └──────────┘               │
├─────────────────────────────────────────────────────────────┤
│  Trust Indicators:                                          │
│  ✓ Ghana Card Verified  |  🔒 Secure Escrow  |  ⭐ Rated   │
├─────────────────────────────────────────────────────────────┤
│  Footer: About | How It Works | For Artisans | Contact     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Search Results

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect    [Search Bar]     🔔  [Avatar ▾]      │
├─────────────────────────────────────────────────────────────┤
│  🤖 AI Summary: "Found 5 verified plumbers near Kasoa.     │
│     Kwame A. is the closest (1.2km) with a 4.8★ rating."   │
├──────────────────┬──────────────────────────────────────────┤
│  Filters:        │                                          │
│  Category: [▾]   │  ┌──────────────────────────────────┐   │
│  Subcategory:[▾] │  │                                  │   │
│  Distance: [▾]   │  │       🗺️ MAPBOX MAP VIEW         │   │
│  Rating: [▾]     │  │       (Interactive map with       │   │
│  ☑ Verified only │  │        artisan pins)              │   │
│  ☑ Available now │  │                                  │   │
│  Sort by: [▾]    │  └──────────────────────────────────┘   │
│                  │                                          │
│  [Map View] [List│  Results (5):                           │
│   View]          │  ┌──────────────────────────────────┐   │
│                  │  │ [Avatar] Kwame Asante     ❤️ 📤  │   │
│ 💬 AI Assistant  │  │ Plumber | ✓ Verified | 🟢 Online │   │
│ ┌──────────────┐ │  │ ⭐ 4.8 (42 reviews) | 1.2 km    │   │
│ │ Need help    │ │  │ GHS 50-200 | "Pipe repair..."   │   │
│ │ finding the  │ │  │ [View Profile] [Send Request]    │   │
│ │ right artisan│ │  └──────────────────────────────────┘   │
│ │ ?            │ │  ┌──────────────────────────────────┐   │
│ │ [Quick Guide]│ │  │ [Avatar] Ama Mensah        ❤️ 📤 │   │
│ │ [Full Chat]  │ │  │ Plumber | ✓ Verified | 🟡 Busy  │   │
│ └──────────────┘ │  │ ⭐ 4.6 (28 reviews) | 3.5 km    │   │
│                  │  │ ...                              │   │
│                  │  └──────────────────────────────────┘   │
└──────────────────┴──────────────────────────────────────────┘
```

Key elements: ❤️ = Favorite button, 📤 = Share button, 🟢/🟡/🔴 = availability status

### 2.2.1 Mobile Explore Feed (TikTok-Style)

```
┌─────────────────────────┐
│ 📱 ArtisanConnect Ghana │
├─────────────────────────┤
│ [Background Image/Video]│
│                         │
│                         │
│                         │
│                         │
│                 [Avatar]│
│                 [  +   ]│
│                         │
│                  [ ❤️ ] │
│                  (4.8)  │
│                         │
│                  [ 💬 ] │
│                  (42)   │
│                         │
│ Kwame Asante     [ 📤 ] │
│ ✓ Verified              │
│ 🔧 Plumber              │
│ "Expert pipe repair...  │
│ 📍 Kasoa                │
│ [ View Full Profile ]   │
└─────────────────────────┘
```
- **Swipe up/down** to view next/previous artisan.
- Highly immersive, full-screen mobile experience.
- Replaces standard grid view on mobile devices by default.


### 2.3 Artisan Public Profile

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect    [Search Bar]     🔔  [Avatar ▾]      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │  [Large Avatar]                                      │   │
│  │  Kwame Asante              ✓ Verified    🟢 Online  │   │
│  │  Professional Plumber                                │   │
│  │  📍 Kasoa, Greater Accra  |  🔧 8 years experience  │   │
│  │  ⭐ 4.8 average (42 reviews)                        │   │
│  │                                                      │   │
│  │  [❤️ Save]  [📤 Share]  [💬 Message]  [📋 Request]  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  [About] [Services] [Portfolio] [Reviews] [Availability]    │
├─────────────────────────────────────────────────────────────┤
│  About:                                                     │
│  "With over 8 years of dedicated plumbing experience        │
│   serving the Kasoa community..."                           │
│   ✨ AI-Generated Bio                                       │
├─────────────────────────────────────────────────────────────┤
│  Services (3):                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ Pipe Repair   │ │ Toilet Inst. │ │ Water Heater │       │
│  │ GHS 50-200    │ │ GHS 200-500  │ │ GHS 300-800  │       │
│  │ [Request]     │ │ [Request]     │ │ [Request]     │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
├─────────────────────────────────────────────────────────────┤
│  Portfolio:                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ [Before]  │ │ [After]  │ │ [Photo]  │ │ [Photo]  │     │
│  │ Kitchen   │ │ Kitchen  │ │ Bathroom │ │ Outdoor  │     │
│  │ Pipe Fix  │ │ Pipe Fix │ │ Remodel  │ │ Drainage │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
├─────────────────────────────────────────────────────────────┤
│  Reviews (42):                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  [Avatar] Ama M.  |  ⭐⭐⭐⭐⭐  |  2 days ago      │   │
│  │  "Excellent job fixing my kitchen pipe. Professional  │   │
│  │   and on time."                                       │   │
│  │  🟢 Positive sentiment  |  🚩 Report                 │   │
│  └──────────────────────────────────────────────────────┘   │
│  [Load more reviews]                                        │
├─────────────────────────────────────────────────────────────┤
│  Availability:                                              │
│  Mon: 8:00 - 17:00  ✅                                     │
│  Tue: 8:00 - 17:00  ✅                                     │
│  Wed: 8:00 - 17:00  ✅                                     │
│  Thu: 8:00 - 17:00  ✅                                     │
│  Fri: 8:00 - 17:00  ✅                                     │
│  Sat: 9:00 - 14:00  ✅                                     │
│  Sun: Off            ❌                                     │
│                                                             │
│  📍 Service Radius: 15km                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │       🗺️ MAPBOX MAP                                  │   │
│  │       (showing service area circle)                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.4 Onboarding Wizard

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect Ghana                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Welcome, Kwame! Let's set up your account.                 │
│                                                             │
│  Progress: ████████░░░░░░░░░ 33%                           │
│  Step 2 of 3                                                │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │  📍 Set Your Location                                │   │
│  │                                                      │   │
│  │  We use your location to find artisans near you.     │   │
│  │                                                      │   │
│  │  [📍 Use My Current Location]                        │   │
│  │                                                      │   │
│  │  Or enter your area:                                 │   │
│  │  ┌────────────────────────────────────────┐          │   │
│  │  │ 🔍 Search for your area...             │          │   │
│  │  └────────────────────────────────────────┘          │   │
│  │                                                      │   │
│  │  Region: [Greater Accra ▾]                           │   │
│  │  District: [Accra Metropolitan ▾]                    │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────┐            │   │
│  │  │     🗺️ MAPBOX MAP (confirm pin)      │            │   │
│  │  └──────────────────────────────────────┘            │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  [← Back]                              [Continue →]  [Skip] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Wireframes — Customer Pages

### 3.1 Customer Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect    [Search Bar]     🔔(3)  [Avatar ▾]   │
├──────────┬──────────────────────────────────────────────────┤
│ Sidebar  │  Welcome back, Ama! 👋                          │
│          │                                                  │
│ 🏠 Dash  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│ 🔍 Search│  │Active │ │Compl.│ │Pend. │ │Saved │          │
│ 📋 Reqs  │  │Reqs   │ │Jobs  │ │Quotes│ │Favs  │          │
│ ❤️ Favs  │  │  2    │ │  8   │ │  1   │ │  5   │          │
│ 🕐 Hist. │  └──────┘ └──────┘ └──────┘ └──────┘          │
│ 💬 Chat  │                                                  │
│ ⚙️ Sett. │  Active Requests:                               │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │ 🔧 Pipe Repair                             │  │
│          │  │ Artisan: Kwame Asante | Status: In Progress│  │
│          │  │ Quote: GHS 150 | Escrow: Held              │  │
│          │  │ ████████████░░ 75% complete                │  │
│          │  │ [View Details] [💬 Chat]                    │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
│          │  Recently Viewed Artisans:                       │
│          │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐              │
│          │  │[Ava]│ │[Ava]│ │[Ava]│ │[Ava]│              │
│          │  │Kofi │ │Yaw  │ │Abena│ │Nana │              │
│          │  │⭐4.7│ │⭐4.5│ │⭐4.9│ │⭐4.6│              │
│          │  └─────┘ └─────┘ └─────┘ └─────┘              │
│          │                                                  │
│          │  Favorite Artisans (5):                          │
│          │  ┌─────────────┐ ┌─────────────┐               │
│          │  │Kwame A. ❤️   │ │Ama M. ❤️    │               │
│          │  │Plumber ✓     │ │Electrician ✓│               │
│          │  │⭐ 4.8 | 1.2km│ │⭐ 4.9 | 3km │               │
│          │  │[View] [Book] │ │[View] [Book] │               │
│          │  └─────────────┘ └─────────────┘               │
└──────────┴──────────────────────────────────────────────────┘
```

### 3.2 Quote Review

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect    [Search Bar]     🔔  [Avatar ▾]      │
├──────────┬──────────────────────────────────────────────────┤
│ Sidebar  │  Quote from Kwame Asante                        │
│          │                                                  │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │  Service: Pipe Repair                      │  │
│          │  │  Your Description: "Kitchen pipe leaking"  │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │  💰 Price Quote                            │  │
│          │  │                                            │  │
│          │  │  Amount: GHS 150.00                        │  │
│          │  │                                            │  │
│          │  │  Description:                              │  │
│          │  │  "I will replace the leaking pipe section  │  │
│          │  │   and test for additional leaks. Price     │  │
│          │  │   includes materials and labor."           │  │
│          │  │                                            │  │
│          │  │  Valid until: June 22, 2026                │  │
│          │  │  ⏰ Expires in 2 days                      │  │
│          │  │                                            │  │
│          │  │  [✅ Accept Quote]  [❌ Decline]           │  │
│          │  │                                            │  │
│          │  │  💬 "Have questions? Chat with Kwame"      │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
│          │  About Kwame Asante:                             │
│          │  ✓ Verified | ⭐ 4.8 (42 reviews) | 1.2 km     │
└──────────┴──────────────────────────────────────────────────┘
```

---

## 4. Wireframes — Artisan Pages

### 4.1 Artisan Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect    [Search Bar]     🔔(5)  [Avatar ▾]   │
├──────────┬──────────────────────────────────────────────────┤
│ Sidebar  │  Welcome, Kwame! 👋     Status: [🟢 Available ▾]│
│          │                                                  │
│ 🏠 Dash  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│ 👤 Profile│ │Income │ │Active│ │Pend. │ │Rating│          │
│ 📂 Port. │  │ This  │ │Jobs  │ │Quotes│ │      │          │
│ 📋 Jobs  │  │ Month │ │      │ │      │ │      │          │
│ 💰 Quotes│  │GHS    │ │  3   │ │  2   │ │ ⭐   │          │
│ 📅 Avail.│  │ 1,250 │ │      │ │      │ │ 4.8  │          │
│ 💬 Chat  │  └──────┘ └──────┘ └──────┘ └──────┘          │
│ ⚙️ Sett. │                                                  │
│          │  Incoming Requests (2):                          │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │ 🆕 Pipe Repair Request                     │  │
│          │  │ Customer: Ama Mensah | 📍 2.3 km away     │  │
│          │  │ "Kitchen pipe leaking badly"                │  │
│          │  │ Budget: GHS 100-300 | Date: June 25        │  │
│          │  │ [Send Quote] [Decline] [💬 Chat]           │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
│          │  Pending Quotes (2):                             │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │ 💰 Quote: GHS 150 | Toilet Installation    │  │
│          │  │ Sent to: Kofi M. | ⏰ Expires in 1 day    │  │
│          │  │ Status: Awaiting customer response          │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
│          │  Verification: ✓ Approved | Ghana Card Verified │
└──────────┴──────────────────────────────────────────────────┘
```

### 4.2 Availability Settings

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect    [Search Bar]     🔔  [Avatar ▾]      │
├──────────┬──────────────────────────────────────────────────┤
│ Sidebar  │  Availability Settings                          │
│          │                                                  │
│          │  Current Status: [🟢 Available ▾]               │
│          │                                                  │
│          │  Weekly Schedule:                                │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │ Day        │ Available │ Hours             │  │
│          │  ├────────────┼───────────┼───────────────────┤  │
│          │  │ Monday     │ [✅]      │ [08:00] - [17:00] │  │
│          │  │ Tuesday    │ [✅]      │ [08:00] - [17:00] │  │
│          │  │ Wednesday  │ [✅]      │ [08:00] - [17:00] │  │
│          │  │ Thursday   │ [✅]      │ [08:00] - [17:00] │  │
│          │  │ Friday     │ [✅]      │ [08:00] - [17:00] │  │
│          │  │ Saturday   │ [✅]      │ [09:00] - [14:00] │  │
│          │  │ Sunday     │ [❌]      │ Off               │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
│          │  Days Off (specific dates):                      │
│          │  ┌──────────────────────┐                       │
│          │  │ 📅 June 25, 2026     │ [Remove]             │
│          │  │ 📅 July 4, 2026      │ [Remove]             │
│          │  └──────────────────────┘                       │
│          │  [+ Add Day Off]                                │
│          │                                                  │
│          │  [Save Changes]                                  │
└──────────┴──────────────────────────────────────────────────┘
```

### 4.3 Portfolio Manager

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect    [Search Bar]     🔔  [Avatar ▾]      │
├──────────┬──────────────────────────────────────────────────┤
│ Sidebar  │  My Portfolio                    [+ Add Item]   │
│          │                                                  │
│          │  ┌──────────────┐ ┌──────────────┐              │
│          │  │ ┌──────────┐ │ │ ┌──────────┐ │              │
│          │  │ │ [Before]  │ │ │ │ [Photo]  │ │              │
│          │  │ │ [After]   │ │ │ │          │ │              │
│          │  │ └──────────┘ │ │ └──────────┘ │              │
│          │  │ Kitchen Pipe │ │ Bathroom     │              │
│          │  │ Replacement  │ │ Renovation   │              │
│          │  │ "Complete    │ │ "Full bath   │              │
│          │  │  pipe repl." │ │  remodel..." │              │
│          │  │ [Edit] [Del] │ │ [Edit] [Del] │              │
│          │  │ ↕ Drag order │ │ ↕ Drag order │              │
│          │  └──────────────┘ └──────────────┘              │
│          │                                                  │
│          │  ┌──────────────────────────────────────────┐    │
│          │  │  Add Portfolio Item                      │    │
│          │  │  Title: [________________________]       │    │
│          │  │  Description: [____________________]     │    │
│          │  │  Main Photo: [Choose File]               │    │
│          │  │  Before Photo: [Choose File] (optional)  │    │
│          │  │  After Photo: [Choose File] (optional)   │    │
│          │  │  [Upload & Save]                         │    │
│          │  └──────────────────────────────────────────┘    │
└──────────┴──────────────────────────────────────────────────┘
```

### 4.4 Quoting Interface

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect    [Search Bar]     🔔  [Avatar ▾]      │
├──────────┬──────────────────────────────────────────────────┤
│ Sidebar  │  Send Quote — Pipe Repair Request               │
│          │                                                  │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │  Request Details:                          │  │
│          │  │  Customer: Ama Mensah | 📍 2.3 km         │  │
│          │  │  Service: Pipe Repair                      │  │
│          │  │  Description: "Kitchen pipe leaking badly  │  │
│          │  │  and flooding the floor"                   │  │
│          │  │  💡 AI Clarified: "Kitchen pipe leak       │  │
│          │  │  causing floor flooding. Likely requires   │  │
│          │  │  pipe section replacement."                │  │
│          │  │  Budget: GHS 100-300                       │  │
│          │  │  Preferred Date: June 25, 2026             │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │  Your Quote:                               │  │
│          │  │  Amount (GHS): [150.00__________]          │  │
│          │  │  Description:                              │  │
│          │  │  [I will replace the leaking pipe section  │  │
│          │  │   and test for additional leaks. Price     │  │
│          │  │   includes materials and labor.________]   │  │
│          │  │  Valid for: [48 hours ▾]                   │  │
│          │  │                                            │  │
│          │  │  [Send Quote]  [Decline Request]           │  │
│          │  └────────────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────────┘
```

---

## 5. Wireframes — Admin Pages

### 5.1 Admin Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect    [Search Bar]     🔔(8)  [Admin ▾]    │
├──────────┬──────────────────────────────────────────────────┤
│ Sidebar  │  Admin Dashboard                  Period: [30d ▾]│
│          │                                                  │
│ 🏠 Dash  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│ ✅ Verify│  │Users │ │Reqs  │ │Rev.  │ │Disp. │          │
│ 👥 Users │  │      │ │      │ │      │ │      │          │
│ 🚩 Moder.│  │1,250 │ │ 320  │ │GHS   │ │  3   │          │
│ 📊 Analyt│  │ ↑12% │ │ ↑8%  │ │12.5K │ │ ↓2   │          │
│ 📂 Categ.│  └──────┘ └──────┘ └──────┘ └──────┘          │
│ 📝 Audit │                                                  │
│ ⚙️ Sett. │  🤖 AI Insights:                                │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │ 📈 Registrations up 15% — artisan signups │  │
│          │  │ ⚠️ Dispute rate increased to 3.2%         │  │
│          │  │ 💡 High demand for electricians in Tema    │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
│          │  Pending Verifications (12):                     │
│          │  ┌──────┐ ┌──────┐ ┌──────┐                    │
│          │  │ [Card]│ │ [Card]│ │ [Card]│                    │
│          │  │Kwame  │ │Ama   │ │Kofi  │ [View All →]       │
│          │  └──────┘ └──────┘ └──────┘                    │
│          │                                                  │
│          │  Pending Reports (5):                            │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │ 🚩 Fraud report on user Yaw K.             │  │
│          │  │ Reported by: Ama M. | 2 hours ago          │  │
│          │  │ [Review]                                    │  │
│          │  └────────────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────────┘
```

### 5.2 Moderation Queue

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect    Admin Panel     🔔  [Admin ▾]        │
├──────────┬──────────────────────────────────────────────────┤
│ Sidebar  │  Moderation Queue           Filter: [All ▾]     │
│          │                                                  │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │ 🚩 Report #1 — Fraud                       │  │
│          │  │ Reported: Yaw Kwaku (Artisan)               │  │
│          │  │ By: Ama Mensah (Customer) | 2 hours ago     │  │
│          │  │                                             │  │
│          │  │ Reason: "This person claims to be a         │  │
│          │  │ verified electrician but did terrible work   │  │
│          │  │ and demanded more money than quoted."        │  │
│          │  │                                             │  │
│          │  │ User History: 3 previous reports | 2.1⭐    │  │
│          │  │                                             │  │
│          │  │ [⚠️ Warn User] [🔴 Suspend] [✖️ Dismiss]   │  │
│          │  │ Admin Notes: [_________________________]     │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │ 🚩 Report #2 — Fake Review                 │  │
│          │  │ Reported Review: ⭐⭐⭐⭐⭐ on Kofi E.      │  │
│          │  │ By: Nana A. (Customer) | 1 day ago          │  │
│          │  │ Reason: "This review is fake — the reviewer │  │
│          │  │ has never used the service."                 │  │
│          │  │ [⚠️ Warn] [🗑️ Remove Review] [✖️ Dismiss]  │  │
│          │  └────────────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────────┘
```

### 5.3 Audit Log

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect    Admin Panel     🔔  [Admin ▾]        │
├──────────┬──────────────────────────────────────────────────┤
│ Sidebar  │  Admin Audit Log                                │
│          │                                                  │
│          │  Filters: [Action ▾] [Admin ▾] [Date Range ▾]   │
│          │                                                  │
│          │  ┌──────────────────────────────────────────────┐│
│          │  │ Time          │ Admin    │ Action    │ Target ││
│          │  ├──────────────┼──────────┼───────────┼────────┤│
│          │  │ 10:30 today  │ Admin A  │ Verified  │ Kwame  ││
│          │  │              │          │ artisan   │ Asante ││
│          │  ├──────────────┼──────────┼───────────┼────────┤│
│          │  │ 09:15 today  │ Admin B  │ Suspended │ Yaw K. ││
│          │  │              │          │ user      │        ││
│          │  ├──────────────┼──────────┼───────────┼────────┤│
│          │  │ Yesterday    │ Super    │ Promoted  │ Admin  ││
│          │  │ 14:00        │ Admin    │ to admin  │ C      ││
│          │  ├──────────────┼──────────┼───────────┼────────┤│
│          │  │ Yesterday    │ Admin A  │ Dismissed │ Report ││
│          │  │ 11:30        │          │ report    │ #45    ││
│          │  └──────────────────────────────────────────────┘│
│          │                                                  │
│          │  [← Previous]  Page 1 of 12  [Next →]           │
└──────────┴──────────────────────────────────────────────────┘
```

---

## 6. Wireframes — Superadmin Pages

### 6.1 Admin Management

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect    Superadmin Panel     [Superadmin ▾]   │
├──────────┬──────────────────────────────────────────────────┤
│ Sidebar  │  Admin Management                               │
│          │                                                  │
│ 🏠 Dash  │  Current Admins (3):                            │
│ 👑 Admins│  ┌────────────────────────────────────────────┐  │
│ ⚙️ System│  │ [Avatar] Admin User A                      │  │
│          │  │ admin@example.com | Role: Admin             │  │
│          │  │ Promoted: June 1, 2026                      │  │
│          │  │ [Demote to Customer]                         │  │
│          │  ├────────────────────────────────────────────┤  │
│          │  │ [Avatar] Admin User B                      │  │
│          │  │ admin2@example.com | Role: Admin            │  │
│          │  │ Promoted: June 10, 2026                     │  │
│          │  │ [Demote to Customer]                         │  │
│          │  ├────────────────────────────────────────────┤  │
│          │  │ [Avatar] You (Superadmin)         👑       │  │
│          │  │ super@example.com | Role: Superadmin        │  │
│          │  │ Seeded at deployment                         │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
│          │  Promote New Admin:                              │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │ Search user: [_____________] [Search]       │  │
│          │  │                                             │  │
│          │  │ Results:                                     │  │
│          │  │ [Avatar] Kwame Asante (Artisan)  [Promote]  │  │
│          │  │ [Avatar] Ama Mensah (Customer)   [Promote]  │  │
│          │  └────────────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────────┘
```

---

## 7. Wireframes — Shared Components

### 7.1 Chat Interface

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect    [Search Bar]     🔔  [Avatar ▾]      │
├──────────┬──────────────────────────────────────────────────┤
│Conversa- │  💬 Kwame Asante              🟢 Online         │
│tions     │  Plumber | ✓ Verified                            │
│          │                                                  │
│┌────────┐│  ┌────────────────────────────────────────────┐  │
││Kwame A.││  │ Kwame: I can come tomorrow at 2pm.        │  │
││🟢 Online│  │       Is that okay?            10:30 AM ✓✓ │  │
││Last: 5m ││  │                                            │  │
│├────────┤│  │ You: Yes, that works! Please bring         │  │
││Ama M.  ││  │      the materials.             10:32 AM ✓ │  │
││🔴 Offline│  │                                            │  │
││Last: 2h ││  │ Kwame: Sure, I'll bring everything.       │  │
│├────────┤│  │       See you tomorrow!          10:33 AM  │  │
││Kofi E. ││  │                                            │  │
││🟡 Busy  ││  │                     Kwame is typing...     │  │
│└────────┘│  └────────────────────────────────────────────┘  │
│          │                                                  │
│[Search   │  ┌────────────────────────────┐                 │
│ chats]   │  │ Type a message...          │ [📎] [Send →]   │
│          │  └────────────────────────────┘                 │
└──────────┴──────────────────────────────────────────────────┘
```

### 7.2 AI Chatbot Widget

```
┌──────────────────────────────┐
│  🤖 ArtisanConnect Assistant │  ✕
├──────────────────────────────┤
│                              │
│  Hi! I can help you find     │
│  the right artisan. 😊       │
│                              │
│  How would you like to       │
│  search?                     │
│                              │
│  ┌────────────────────────┐  │
│  │ ⚡ Quick Guide         │  │
│  │ Answer 2-3 questions   │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ 💬 Tell Me More        │  │
│  │ Describe your problem  │  │
│  └────────────────────────┘  │
│                              │
│  ─── Quick Guide Mode ───   │
│                              │
│  What service do you need?   │
│  [Plumbing] [Electrical]     │
│  [Painting] [Carpentry]      │
│  [Other: ________]           │
│                              │
├──────────────────────────────┤
│ [Type a message...   ] [→]  │
└──────────────────────────────┘
```

### 7.3 Ghana Card Verification Upload

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 ArtisanConnect    [Search Bar]     🔔  [Avatar ▾]      │
├──────────┬──────────────────────────────────────────────────┤
│ Sidebar  │  Ghana Card Verification                        │
│          │                                                  │
│          │  Status: ⏳ Not Started                          │
│          │                                                  │
│          │  Step 1: Upload Ghana Card Photo                 │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │                                            │  │
│          │  │     📷 Click or drag to upload             │  │
│          │  │     your Ghana Card photo                  │  │
│          │  │                                            │  │
│          │  │     JPEG or PNG, max 5MB                   │  │
│          │  │                                            │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
│          │  Step 2: Take a Selfie                           │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │     📷 Click to take a selfie              │  │
│          │  │     (for identity matching)                │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
│          │  Step 3: AI Extraction Preview                   │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │  🤖 AI extracted the following details:    │  │
│          │  │  Name: [Kwame Asante__________] ✅ 94%     │  │
│          │  │  Card #: [GHA-012345678-9_____] ✅ 91%     │  │
│          │  │  DOB: [1990-05-15_____________] ✅ 88%     │  │
│          │  │  Expiry: [2030-12-31__________] ✅ 96%     │  │
│          │  │                                            │  │
│          │  │  ⚠️ Please verify and correct if needed    │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
│          │  [Submit for Verification]                       │
└──────────┴──────────────────────────────────────────────────┘
```

---

> **Next**: [Deliverable 7 — Project Structure & DevOps Plan](./07-project-structure.md) defines the monorepo layout, deployment pipeline, and testing strategy.

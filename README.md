# ArtisanConnect Ghana

A trust-first digital marketplace that securely connects customers with verified artisans through AI-assisted discovery, verification, booking, and escrow-managed payments.

## Prerequisites
- Node.js >= 18
- npm >= 9

## Getting Started

1. Install dependencies
```bash
npm install
```

2. Environment Variables
You will need to set up `.env` files in both `apps/web` and `apps/api`.
Copy the sample env files:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### Required API Keys
- Groq API Key (for AI features)
- Supabase credentials (DB and Auth)
- Mapbox Access Token (for maps and geocoding)
- Resend API Key (for transactional emails)

3. Start development servers
```bash
npm run dev
```

- Frontend: http://localhost:3000
- API Server: http://localhost:4000

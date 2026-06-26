# Setup Guide

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop (for local database)
- Git

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd artisanconnect-ghana
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy `.env.example` to `.env` and fill in the missing API keys (Groq, Mapbox, Supabase, Resend).
   ```bash
   cp .env.example .env
   ```

4. **Start the local database:**
   ```bash
   docker-compose up -d
   ```

5. **Run the development servers:**
   ```bash
   npm run dev
   ```
   This will start both the Next.js frontend (http://localhost:3000) and Express.js backend (http://localhost:5000).

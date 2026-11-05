# ==============================================================================
# Multi-Stage Production Dockerfile for ArtisanConnect (Next.js 16 Standalone)
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. Base Image
# ------------------------------------------------------------------------------
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ------------------------------------------------------------------------------
# 2. Dependencies
# ------------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

# Copy package manifests across monorepo workspaces
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/prisma ./apps/web/prisma

# Install exact dependencies
RUN npm ci

# Generate Prisma client for linux-musl target
RUN cd apps/web && npx prisma generate

# ------------------------------------------------------------------------------
# 3. Builder
# ------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the web application (creates .next/standalone)
RUN npm run build --workspace=@artisanconnect/web

# ------------------------------------------------------------------------------
# 4. Production Runner
# ------------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Secure non-root execution
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets
COPY --from=builder /app/apps/web/public ./apps/web/public

# Setup .next permissions
RUN mkdir -p apps/web/.next && chown nextjs:nodejs apps/web/.next

# Copy standalone distribution
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

# Standalone server runner
CMD ["node", "apps/web/server.js"]

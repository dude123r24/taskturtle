FROM node:18-slim AS base

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies: use npm install (not npm ci) so optional deps
# resolve for the build platform. npm ci + lockfile from macOS skips
# linux native bindings (npm/cli#4828).
RUN npm install --include=optional --no-audit --no-fund

# Generate Prisma client
RUN npx prisma generate

# Copy source
COPY . .

# Build args for env vars needed at build time
ARG DATABASE_URL
ARG AUTH_SECRET
ARG AUTH_GOOGLE_ID
ARG AUTH_GOOGLE_SECRET
ARG AUTH_URL
ARG AUTH_TRUST_HOST
ARG GEMINI_API_KEY
ARG NEXT_PUBLIC_APP_URL

# Build Next.js
RUN npm run build

# --- Production stage ---
FROM node:18-slim AS runner

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production

# Copy built app and dependencies
COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/next.config.js ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]

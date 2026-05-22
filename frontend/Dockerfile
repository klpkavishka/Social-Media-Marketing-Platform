# Stage 1: Builder
FROM node:20-alpine as builder

WORKDIR /app

# Accept build arguments for AUTH0
ARG AUTH0_SECRET=change-this-to-a-long-random-value-in-production
ARG AUTH0_DOMAIN=dev.auth0.local
ARG AUTH0_CLIENT_ID=dev-client-id
ARG AUTH0_CLIENT_SECRET=dev-client-secret
ARG AUTH0_AUDIENCE=http://localhost:4000

# Set environment variables
ENV AUTH0_SECRET=$AUTH0_SECRET \
    AUTH0_DOMAIN=$AUTH0_DOMAIN \
    AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID \
    AUTH0_CLIENT_SECRET=$AUTH0_CLIENT_SECRET \
    AUTH0_AUDIENCE=$AUTH0_AUDIENCE

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build application
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Set environment
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production --legacy-peer-deps --legacy-peer-deps
# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (res) => {if (res.statusCode !== 200) { throw new Error(res.statusCode); } else { process.exit(0); }})" || exit 1

# Run application
CMD ["npm", "start"]

# Stage 1: Builder
FROM node:20-alpine as builder

WORKDIR /app

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
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production --legacy-peer-deps
# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4000/api', (res) => {if (res.statusCode !== 200) throw new Error(res.statusCode)})" || exit 1

# Run application
CMD ["node", "dist/main.js"]

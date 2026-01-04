# Multi-stage Dockerfile for Angular Frontend
# Supports building for different environments (development, test, accp, production)

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build configuration argument
ARG CONFIGURATION=production

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application for the specified configuration
RUN npm run build -- --configuration=${CONFIGURATION}

# Production stage - using nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/dist/dubber /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

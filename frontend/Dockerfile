# Yellorn Frontend Dockerfile
# Multi-stage build for optimized production bundle
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine as production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Create non-root user
RUN addgroup -g 1001 -S yellorn && \
    adduser -S yellorn -u 1001

# Change ownership of nginx directories
RUN chown -R yellorn:yellorn /var/cache/nginx && \
    chown -R yellorn:yellorn /var/log/nginx && \
    chown -R yellorn:yellorn /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
    chown -R yellorn:yellorn /var/run/nginx.pid

# Switch to non-root user
USER yellorn

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Expose port
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

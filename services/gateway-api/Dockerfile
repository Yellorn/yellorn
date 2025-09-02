FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY services/gateway-api/package*.json ./
COPY shared/types/package*.json ./shared/types/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY services/gateway-api/src ./src
COPY services/gateway-api/tsconfig.json ./
COPY shared/types ./shared/types

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S yellorn -u 1001

# Change ownership of the app directory
RUN chown -R yellorn:nodejs /app
USER yellorn

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]

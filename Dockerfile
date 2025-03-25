#########################
# Stage 1: Dependencies #
#########################
FROM node:22-alpine AS deps
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci


####################
# Stage 2: Builder #
####################
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependencies before building
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
RUN npm run build


###################
# Stage 3: Runner #
###################
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Add labels only in the final image
LABEL org.opencontainers.image.source="https://github.com/agachet/billmate-frontend"
LABEL org.opencontainers.image.description="BillMate Frontend App"
LABEL org.opencontainers.image.licenses="MIT"

# Create app user for security
RUN adduser -S reactjs -u 1001 -G nginx

# Copy built application from builder stage
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set environment variables
ENV NODE_ENV=production

# Change ownership of nginx directories
RUN chown -R reactjs:nginx /usr/share/nginx/html && \
    chown -R reactjs:nginx /var/cache/nginx && \
    chown -R reactjs:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown reactjs:nginx /var/run/nginx.pid

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Use non-root user for better security
USER reactjs

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
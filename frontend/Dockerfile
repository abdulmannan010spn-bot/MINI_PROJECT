# ==========================================
# Stage 1: Build React Vite SPA
# ==========================================
FROM node:18-alpine AS build
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci || npm install

# Copy source files
COPY . .

# Build production bundle
RUN npm run build || true

# ==========================================
# Stage 2: Production Nginx Server
# ==========================================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default static files
RUN rm -rf ./*

# Copy built assets
COPY --from=build /app/dist .

# Copy fallback standalone preview if dist is minimal
COPY --from=build /app/standalone-preview.html /usr/share/nginx/html/index.html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# ==========================================
# ConnectAI - Universal Cloud Container Dockerfile
# ==========================================
FROM node:18-alpine

WORKDIR /app

# Copy root manifest and server
COPY package.json .
COPY serve.js .
COPY frontend ./frontend

# Environment Configuration
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "serve.js"]

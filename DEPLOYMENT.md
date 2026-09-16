# ConnectAI – Production Deployment Guide

## 1. Prerequisites
- **Java Development Kit (JDK)**: Version 17 or 21
- **Apache Maven**: Version 3.8+
- **Node.js**: Version 18+ and npm
- **Database**: PostgreSQL 14+ (or automatic built-in H2 in-memory mode)

---

## 2. Environment Variables Configuration

Create an `.env` file or export the following environment variables:

```bash
# Server Port
PORT=8080

# PostgreSQL Database Configuration
DATABASE_URL=jdbc:postgresql://localhost:5432/connectaidb
DATABASE_DRIVER=org.postgresql.Driver
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_secure_password
JPA_DIALECT=org.hibernate.dialect.PostgreSQLDialect

# JWT Security
JWT_SECRET=ConnectAISecretKeyForJwtAuthenticationMustBeAtLeast256BitsLong20262027
JWT_EXPIRATION_MS=86400000

# Google OAuth 2.0 (Optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI Assistance Suite (Gemini API)
AI_API_KEY=your-gemini-api-key
AI_MODEL=gemini-1.5-flash

# CORS Allowed Origins
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://yourdomain.com
```

---

## 3. Database Initialization (PostgreSQL)

If using PostgreSQL, create the database before starting the application:

```sql
CREATE DATABASE connectaidb;
CREATE USER connectai_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE connectaidb TO connectai_user;
```

*Note: Hibernate `ddl-auto: update` will automatically create all tables, foreign keys, and indexes upon startup.*

---

## 4. Building and Running Backend

```bash
cd backend
mvn clean package -DskipTests
java -jar target/connectai-backend-1.0.0.jar
```

---

## 5. Building and Deploying Frontend

```bash
cd frontend
npm install
npm run build
```

The production assets will be built into `frontend/dist/`. Serve them using Nginx, Apache, or upload to Vercel/Netlify.

---

## 6. Nginx Reverse Proxy Configuration Example

```nginx
server {
    listen 80;
    server_name chat.yourdomain.com;

    # Frontend Static Files
    location / {
        root /var/www/connectai/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend REST APIs
    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket STOMP Endpoint
    location /ws/ {
        proxy_pass http://127.0.0.1:8080/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 7. Zero-Config Instant Presentation Server

For instant evaluation or college presentations without setting up external databases or builds:
```bash
node serve.js
```
Runs a real-time SSE server with zero configuration on port `3000`.

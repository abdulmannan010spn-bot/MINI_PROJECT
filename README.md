# ConnectAI – AI Integrated People Chat Application
> *"Human conversations, intelligently assisted."*

**Major Academic Project (2026–2027)**  
*Department of Information Technology, Ajay Kumar Garg Engineering College (AKGEC), Ghaziabad*  
**Team**: Abdul Mannan (2400270130006), Aditya Maurya (2400270130018), Aditya Vishwakarma (2400270130021), Abhishek Gangwar (2400270130011)  
**Project Guide / Mentor**: Mr. Sudhakar Dwivedi  

---

## 🌟 1. Project Concept & Core Value
ConnectAI is a modern, full-stack real-time communication platform built **for people to talk with people**, enhanced by an unobtrusive, human-centered **AI Assistance Layer**.

### 🔒 Human-in-the-Loop Safeguard (Core Design Principle)
- **AI Never Impersonates Users**: AI is not a bot in the chat room; it only assists human senders.
- **Explicit Review Before Sending**: All smart suggestions, translations, tone rewrites, and summaries are generated as drafts that the user must review, edit, insert, or reject.
- **Visual Separation**: AI-generated suggestions are clearly distinguished from sent human messages.

---

## 🚀 2. Key Features

### 💬 Real-Time Human Chat
- **1-on-1 Direct Messaging** with dynamic thread creation and online presence detection.
- **Group Channels** with multi-user creation, admin roles, and member management.
- **Rich Media & Voice**: High-fidelity voice notes with audio player, photo sharing with modal lightbox.
- **Emoji Reactions & Receipts**: Multi-emoji reactions, sent/delivered/read receipts, live typing indicators.

### 🤖 AI Assistance Suite
1. **Contextual Smart Replies**: 3 instant response chips tailored to conversation context.
2. **Multi-Tone Message Rewrite**: 6 expressive tones (*Professional, Casual, Polite, Concise, Expanded, Academic*).
3. **Live 7+ Language Translation**: Instant translation between English, Hindi, Spanish, French, German, Japanese, Arabic, Russian, and Portuguese.
4. **Conversation Digest & Summaries**: Multi-message summarization with bullet points and action items.
5. **Content Safety & Moderation**: Proactive screening for toxic phrasing with polite alternative suggestions.

---

## 🛠️ 3. Technology Stack

### Backend
- **Language & Runtime**: Java 17+, Spring Boot 3.2+
- **Security**: Spring Security 6, JJWT (`0.11.5`), BCrypt password hashing, Google OAuth 2.0
- **Data & ORM**: Spring Data JPA, Hibernate, PostgreSQL (production) + H2 in-memory fallback
- **Real-Time Communication**: Spring WebSocket STOMP message broker (`/ws`, `/topic`, `/app`)
- **Validation & Tools**: Jakarta Validation, Lombok

### Frontend
- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS / Modern CSS Variables (Dark & Light theme support)
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **Real-Time Layer**: WebSocket STOMP Client & Server-Sent Events (SSE) fallback

---

## 📂 4. Project Directory Structure

```
beautiful-lovelace/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/connectai/
│           │   ├── ConnectAiApplication.java
│           │   ├── config/              # Security, CORS, WebSocket, DataInitializer
│           │   ├── controller/          # REST Controllers (Auth, User, Chat, Group, AI, Notif)
│           │   ├── dto/                 # Clean Request/Response Data Transfer Objects
│           │   ├── entity/              # JPA Database Entities (User, Conversation, Message, etc.)
│           │   ├── exception/           # Global Exception Handling & Error Responses
│           │   ├── repository/          # Spring Data JPA Repositories
│           │   ├── security/            # JWT Token Service & Authentication Filters
│           │   ├── service/             # Business Logic & AI Suite Implementations
│           │   └── websocket/           # STOMP Message Handlers & Event Listeners
│           └── resources/
│               ├── application.yml      # Dual DB Config (PostgreSQL + H2 Fallback)
│               └── application-example.yml
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── standalone-preview.html          # High-fidelity single-bundle presentation UI
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── components/                  # Sidebar, ChatArea, MessageInput, AIAssistantPanel, etc.
│       ├── context/                     # AuthContext, ChatContext, ThemeContext
│       ├── pages/                       # LoginPage, RegisterPage, ChatDashboard, ProfilePage
│       └── services/                    # Axios API client, WebSocket STOMP, AI Service
├── serve.js                             # Zero-config LAN presentation server daemon (Port 3000)
├── DEPLOYMENT.md                        # Full deployment & production setup guide
└── README.md
```

---

## ⚡ 5. Quick Start & Demonstration

### Option A: Instant Live Presentation Runner (Port 3000)
Run the built-in Node.js live daemon to test cross-device real-time messaging on localhost and Wi-Fi LAN:
```bash
node serve.js
```
- **Localhost URL**: `http://localhost:3000`
- **LAN / Mobile URL**: `http://<YOUR_LOCAL_IP>:3000` (e.g. `http://20.20.11.233:3000`)

### Option B: Spring Boot Backend + React Frontend
1. **Start Backend**:
   ```bash
   cd backend
   mvn clean spring-boot:run
   ```
   *REST APIs & STOMP WebSockets will run at `http://localhost:8080`.*  
   *H2 Web Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:connectaidb`).*

2. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *React SPA will open at `http://localhost:5173`.*

---

## 👥 6. Demo Accounts (Pre-Seeded)

| Full Name | Role | Email / Login | Password |
|---|---|---|---|
| **Abdul Mannan** | Team Lead / Author | `abdul@connectai.app` | `pass123` |
| **Aditya Maurya** | Collaborator / Author | `aditya@connectai.app` | `pass123` |
| **Mr. Sudhakar Dwivedi** | Faculty Guide / Mentor | `sudhakar@connectai.app` | `pass123` |
| **Dr. Neha Sharma** | Department Coordinator | `neha@connectai.app` | `pass123` |
| **Demo Evaluator** | Guest Evaluator | `demo@connectai.app` | `pass123` |

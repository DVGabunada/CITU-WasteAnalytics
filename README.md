# CITU-WasteAnalytics — 5S+ Waste Monitoring & Awareness System

A comprehensive waste management monitoring and awareness system built for Cebu Institute of Technology – University (CIT-U). This web application provides administrators with tools to track, analyze, and manage campus waste data, while also offering students an interactive awareness and survey platform.

---

## 📋 Table of Contents

- [Tech Stack](#️-tech-stack)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Sample Credentials](#-sample-credentials)
- [Recent Updates](#-recent-updates)
- [Project Structure](#-project-structure)

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version |
|---|---|
| React | ^19.2.0 |
| Vite | ^7.2.4 |
| Material UI (MUI) | ^7.3.8 |
| MUI Icons | ^7.3.8 |
| MUI X Date Pickers | ^8.27.0 |
| React Router DOM | ^7.13.0 |
| Recharts | ^3.7.0 |
| Framer Motion | ^12.34.0 |
| Emotion (React & Styled) | ^11.14.0 |
| date-fns | ^4.1.0 |
| jsPDF | ^4.2.1 |
| jsPDF AutoTable | ^5.0.7 |
| XLSX | ^0.18.5 |
| prop-types | ^15.8.1 |

### Backend

| Technology | Description |
|---|---|
| Spring Boot | Java-based REST API (`/api/v3`) |
| Firebase Firestore | NoSQL Database |
| Firebase Auth | Student authentication |
| Render | Backend & Frontend Hosting |

### AI Integration

| Technology | Description |
|---|---|
| Sea-Lion AI (AI Singapore) | EcoBot — AI waste management assistant |
| Model | `aisingapore/Gemma-SEA-LION-v4-27B-IT` |

### Development Tools

| Tool | Version |
|---|---|
| ESLint | ^9.39.1 |
| Node.js | 18+ (recommended) |
| npm | 9+ |

---

## ✨ Features

- **Landing Page** — Animated introduction to the 5S+ Waste Monitoring System
- **Student Login** — Firebase-authenticated login with CIT-U email (`@cit.edu`) and Student ID
- **Admin Portal** — Secure `/admin` login with username/password and SHA-256 password hashing
- **Dashboard** — KPI cards and charts showing total waste, top offices, and monthly trends
- **Monitoring** — Real-time waste data monitoring per office and waste category
- **Insights** — Deep analytics with trend analysis and exportable reports (PDF / Excel)
- **Data Entry** — Admin form for recording waste collection entries
- **Data Logs** — Full CRUD table with row-level editing and multi-row deletion
- **Awareness** — Interactive 5S+ educational content for students
- **Survey** — Student feedback survey integrated with the backend API
- **Quiz** — Gamified waste management knowledge quiz with mascot feedback
- **EcoBot AI Chatbot** — Floating AI assistant powered by Sea-Lion for waste management Q&A
- **Dark / Light Mode** — Full theme toggle with MUI theme integration

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git
- Java 17+ (for backend)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/DVGabunada/CITU-WasteAnalytics.git
cd CITU-WasteAnalytics/waste-analytics
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file inside the `waste-analytics/` folder:

```env
# Spring Boot backend base URL
VITE_API_BASE_URL=http://localhost:8080/api/v3

# Sea-Lion AI API key (get a free key at https://sea-lion.ai)
VITE_SEALION_API_KEY=your_key_here
```

4. **Start the development server**

```bash
npm run dev
```

5. **Open in browser**

```
http://localhost:5173
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

---

## 📦 Deployment

### Frontend Deployment (Render Static Site)

1. Push the repository to GitHub
2. Create a new **Static Site** on [Render](https://render.com)
3. Configure the service:

| Setting | Value |
|---|---|
| Root Directory | `waste-analytics` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

4. Add environment variables in the Render **Environment** tab:

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com/api/v3` |
| `VITE_SEALION_API_KEY` | `your_sea_lion_api_key` |

5. In the **Redirects/Rewrites** tab, add a rewrite rule for SPA routing:

| Source | Destination | Type |
|---|---|---|
| `/*` | `/index.html` | Rewrite |

### Backend Deployment (Render Web Service)

The Spring Boot backend is hosted on Render at:

```
https://your-backend.onrender.com/api/v3
```

Backend deployment is handled through Render's automatic deployment from the GitHub repository.

> ⚠️ **Free Tier Note:** The backend may spin down after 15 minutes of inactivity. The first request after inactivity may take 30–50 seconds to respond (cold start).

---

## 🔐 Sample Credentials

### Admin Account

| Field | Value |
|---|---|
| URL | `/admin` |
| Username | `admin` |
| Password | *(set during first-time registration)* |
| Role | Admin |

### Student / Guest Account

| Field | Value |
|---|---|
| URL | `/login` |
| Email | Any valid `@cit.edu` email |
| Student ID | Any valid CIT-U student ID |
| Role | Guest (read-only access) |

---

## 🔄 Recent Updates

### May 2026

**Deployment Fixes**
- Fixed `/admin` and all deep-link routes returning 404 on Render by adding a `_redirects` file and Redirects/Rewrites rule
- Added `VITE_API_BASE_URL` production environment variable support for backend connectivity
- Added `https://citu-wasteanalytics.onrender.com` to backend CORS allowed origins

**AI Chatbot (EcoBot)**
- Integrated Sea-Lion AI (`aisingapore/Gemma-SEA-LION-v4-27B-IT`) as EcoBot waste assistant
- Added 15-second request timeout to prevent frozen UI
- Added CORS/network error detection with user-friendly messages
- Added 401 Unauthorized detection and rate-limit handling

**Admin Portal**
- Implemented secure `/admin` route with dedicated `AdminLoginPage`
- SHA-256 password hashing using browser Web Crypto API
- Tab-based Login / Register Account interface

### April 2026

**Data Entry & Data Logs**
- Fixed input focus loss bug on text fields during data entry
- Implemented row-level editing in Data Logs table
- Added multi-row deletion support

**Survey Module**
- Integrated `SurveyController` backend API (`POST /api/v3/survey/add`)
- Aggregated survey results via `GET /api/v3/survey/totalResult`

---

## 📁 Project Structure

```
CITU-WasteAnalytics/
├── waste-analytics/              # React + Vite frontend
│   ├── public/
│   │   ├── _redirects            # Render SPA routing rule
│   │   └── *.png                 # Static assets & mascot images
│   └── src/
│       ├── api/
│       │   └── api.js            # REST API calls to Spring Boot backend
│       ├── components/
│       │   ├── AIChatbot.jsx     # EcoBot AI floating chatbot
│       │   ├── Charts/           # Recharts chart components
│       │   ├── KPICard.jsx       # Reusable KPI stat card
│       │   ├── Layout.jsx        # Main authenticated layout & sidebar
│       │   ├── MascotBubble.jsx  # CIT-U mascot speech bubble
│       │   └── ProtectedRoute.jsx # Auth & role guard HOC
│       ├── context/
│       │   ├── AuthContext.jsx   # Authentication state & admin login logic
│       │   └── ThemeContext.jsx  # Dark/light mode toggle context
│       ├── data/                 # Local data stores and mock data
│       ├── hooks/                # Custom React hooks
│       ├── pages/
│       │   ├── AdminLoginPage.jsx  # Secure admin login & registration
│       │   ├── Awareness.jsx       # 5S+ awareness content for students
│       │   ├── Dashboard.jsx       # KPI overview dashboard
│       │   ├── DataEntry.jsx       # Waste data entry form
│       │   ├── DataLogs.jsx        # Full CRUD data log table
│       │   ├── Insights.jsx        # Analytics & exportable reports
│       │   ├── LandingPage.jsx     # Public landing page
│       │   ├── LoginPage.jsx       # Student/guest login
│       │   ├── Monitoring.jsx      # Real-time waste monitoring
│       │   ├── QuizPage.jsx        # Waste knowledge quiz
│       │   └── Survey.jsx          # Student feedback survey
│       ├── theme/                # MUI light & dark theme config
│       ├── App.jsx               # Route definitions
│       └── main.jsx              # React entry point
└── render.yaml                   # Render deployment configuration
```

---

## 📄 License

This project is academic and proprietary — developed for Cebu Institute of Technology – University (CIT-U).

---

## 👥 Contributors

**CITU-WasteAnalytics Development Team**
- Environmental Management Office, CIT-U

<div align="center">

# CollabSphere

**The developer network built for builders — find your team, ship your project.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-collabsphereweb.vercel.app-success?style=flat-square&logo=vercel)](https://collabsphereweb.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Express](https://img.shields.io/badge/Express-4-grey?style=flat-square&logo=express)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/Keerthanreddy01/collabsphere-web?style=flat-square)](https://github.com/Keerthanreddy01/collabsphere-web/stargazers)

</div>

---

## What is CollabSphere?

CollabSphere is a platform engineered for software developers, designers, and tech professionals to connect, form teams, and build together. It combines a real-time social feed, professional portfolios, project showcases, and hackathon team-building workflows into a single hub — think LinkedIn meets GitHub meets Devpost.

The project is a **monorepo** with two independently deployable services: a **Next.js 16 frontend** (deployed on Vercel) and an **Express/Node.js backend API** (Firebase-backed).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Scripts Reference](#scripts-reference)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Real-Time Feed** — Community updates, project launches, and technical discussions
- **Developer Profiles** — Portfolios with tech stacks, GitHub metrics, and availability status
- **Project Showcase** — Dedicated pages to demo and iterate on software projects
- **Hackathon Teambuilding** — Discover and assemble multidisciplinary teams for competitions
- **Direct Messaging** — Peer-to-peer conversations between builders
- **Smart Search & Filtering** — Find developers by role, stack, and availability
- **Security-First** — Input sanitization (DOMPurify), Firestore security rules, rate-limit-ready middleware, security event logging

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 + shadcn/ui (Radix primitives) |
| **Animations** | Framer Motion |
| **Backend Framework** | Express 4 (Node.js ≥ 18) |
| **Database & Auth** | Firebase v12 (Firestore + Authentication) |
| **Server SDK** | Firebase Admin SDK (service account) |
| **Validation** | Zod |
| **Security** | Helmet, DOMPurify, custom Firestore rules |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Browser / Client                                           │
│  Next.js 16 App Router (Vercel)                             │
│  ┌─────────────────┐  ┌──────────────────────────────────┐  │
│  │  React Pages    │  │  Next.js API Routes              │  │
│  │  (frontend/app) │  │  (frontend/app/api/*)            │  │
│  └────────┬────────┘  └───────────────┬──────────────────┘  │
│           │ Firebase Client SDK        │ Firebase Admin SDK   │
└───────────┼───────────────────────────┼─────────────────────┘
            │                           │
            ▼                           ▼
┌───────────────────────┐   ┌───────────────────────────────┐
│  Firebase (Google)    │   │  Express API (backend/)       │
│  ├── Firestore DB     │◄──│  ├── Helmet + CORS            │
│  ├── Authentication   │   │  ├── Auth middleware (JWT)    │
│  └── (Storage, FCM)   │   │  ├── Route controllers        │
└───────────────────────┘   │  └── Zod validation           │
                            └───────────────────────────────┘
```

**How they talk:**
- The **Next.js frontend** communicates with Firebase directly via the Firebase Web SDK (client-side Firestore queries, Firebase Auth).
- The **Express backend** communicates with Firebase via the Firebase Admin SDK (bypasses security rules — used for privileged operations like admin reads, waitlist management).
- The frontend calls the backend at `NEXT_PUBLIC_API_URL` for operations that require server-side authority or cannot be done safely client-side.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 ([download](https://nodejs.org/))
- **npm**, **yarn**, or **pnpm**
- A **Firebase project** with Authentication and Firestore enabled ([console](https://console.firebase.google.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/Keerthanreddy01/collabsphere-web.git
cd collabsphere-web
```

### 2. Set Up the Frontend

```bash
cd frontend
npm install           # or pnpm install
cp .env.example .env.local
```

Open `frontend/.env.local` and fill in your **Firebase Web SDK** credentials (found in Firebase Console → Project Settings → Your Apps → Web App).

```bash
npm run dev           # starts Next.js at http://localhost:3000
```

### 3. Set Up the Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and fill in:
- Your **Firebase Admin SDK** credentials (Firebase Console → Project Settings → Service Accounts → Generate new private key)
- `PORT`, `NODE_ENV`, and `FRONTEND_URL`

```bash
npm run dev           # starts Express at http://localhost:5000
```

> **Health check:** `GET http://localhost:5000/health` → `{ "status": "ok" }`

### 4. Deploy Firestore Rules

If you have the Firebase CLI installed:

```bash
firebase deploy --only firestore:rules
```

---

## Folder Structure

```
collabsphere/                   ← Monorepo root
├── frontend/                   ← Next.js 16 client (deployed to Vercel)
│   ├── app/                    ← App Router pages (23 routes)
│   ├── components/             ← Reusable UI components + shadcn/ui
│   ├── hooks/                  ← Custom React hooks
│   ├── lib/                    ← Firebase SDK helpers, sanitization, auth utils
│   ├── public/                 ← Static assets (images, icons, demo screenshots)
│   └── styles/                 ← Additional global CSS layers
│
├── backend/                    ← Express REST API (Node.js)
│   └── src/
│       ├── config/             ← Environment variable loading
│       ├── controllers/        ← HTTP request handlers
│       ├── middleware/         ← Auth, error handling, rate limiting
│       ├── models/             ← TypeScript interfaces + Zod schemas
│       ├── repositories/       ← Firestore data access layer
│       ├── routes/             ← Express routers per feature
│       ├── services/           ← Business logic layer
│       └── utils/              ← Shared utilities (response wrapper, pagination)
│
├── scripts/                    ← One-off utility and migration scripts
├── firestore.rules             ← Firestore security rules (deploy via Firebase CLI)
├── .env.example                ← Full env template for both frontend + backend
└── README.md
```

For a detailed description of every file, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

---

## Scripts Reference

Run these from the **monorepo root** (requires `npm install` at root first):

| Command | Description |
|---|---|
| `npm run dev:frontend` | Start Next.js dev server (port 3000) |
| `npm run dev:backend` | Start Express dev server (port 5000) |
| `npm run build:frontend` | Production build for Next.js |
| `npm run build:backend` | Compile TypeScript → `backend/dist/` |
| `npm run lint` | Lint both frontend and backend |
| `npm run install:all` | Install deps for root + both sub-packages |

Or run directly from each subfolder (`cd frontend && npm run dev`, etc.).

| Subfolder | Extra Scripts |
|---|---|
| `frontend/` | `dev`, `build`, `start`, `lint` |
| `backend/` | `dev`, `build`, `start`, `lint`, `test` |

---

## Contributing

We follow **Conventional Commits** for all commit messages.

### Commit Format

```
<type>(<scope>): <short description>

Types: feat | fix | docs | chore | refactor | style | test | perf
Scope: frontend | backend | rules | deps | ci  (optional but encouraged)

Examples:
  feat(frontend): add GitHub OAuth sign-in flow
  fix(rules): restrict message updates to sender only
  docs: update README setup instructions
  chore(deps): upgrade firebase-admin to v14
```

### Branch Naming

```
feature/<short-description>          # new features
fix/<issue-or-description>           # bug fixes
chore/<task>                         # maintenance
docs/<what-you-updated>              # documentation only
```

### PR process

1. Fork the repository
2. Create a branch from `main`: `git checkout -b feature/your-feature`
3. Make changes — **one logical concern per commit**
4. Push and open a Pull Request targeting `main`
5. Fill in the PR template; link the relevant issue if applicable
6. Request a review — PRs require at least one approval before merging

For first contributions, look for issues labeled `good first issue`.

---
## License

Distributed under the [MIT License](LICENSE).

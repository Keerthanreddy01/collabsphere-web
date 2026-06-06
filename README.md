# CollabSphere — Monorepo Root

> Developer collaboration platform. Frontend (Next.js) + Backend (Express API) live side by side.

## Repo Layout

```
collabsphere/
├── frontend/            ← Next.js 16 app (React 19, TypeScript, Firebase client)
│   ├── app/             ← Next.js App Router pages & layouts
│   ├── components/      ← Reusable UI components
│   ├── hooks/           ← Custom React hooks
│   ├── lib/             ← Firebase client SDK helpers & utilities
│   ├── public/          ← Static assets (images, icons, fonts)
│   ├── styles/          ← Global CSS
│   └── ...config files
│
├── backend/             ← Express REST API (TypeScript, Firebase Admin SDK)
│   ├── src/
│   │   ├── config/      ← Env config + Firebase Admin init
│   │   ├── controllers/ ← HTTP request handlers
│   │   ├── middleware/  ← Auth, error, rate-limit, logging
│   │   ├── models/      ← TypeScript interfaces + Zod schemas
│   │   ├── repositories/← Firestore CRUD queries
│   │   ├── routes/      ← Express routers
│   │   ├── services/    ← Business logic
│   │   ├── types/       ← Shared TypeScript types
│   │   ├── utils/       ← Pure helpers
│   │   ├── app.ts       ← Express app setup
│   │   └── server.ts    ← Server entry point
│   └── tests/           ← Jest + Supertest tests
│
└── README.md            ← This file
```

## Quick Start

```bash
# Frontend
cd frontend
npm install
npm run dev        # http://localhost:3000

# Backend
cd backend
npm install
cp .env.example .env
npm run dev        # http://localhost:5000
```

## Tech Stack

| Layer    | Tech |
|----------|------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| Backend  | Express 4, TypeScript, Firebase Admin SDK |
| Database | Firebase Firestore |
| Auth     | Firebase Authentication |
| Deploy   | Vercel (frontend) · Railway / Render (backend) |

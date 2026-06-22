# CollabSphere — Project Structure Reference

> **Follow this document every time you build a new feature.**
> It tells you exactly where every file should live and why.

---

## 📁 Root Layout

```
collabsphere/
├── frontend/          ← Next.js 16 client app
├── backend/           ← Express REST API
└── README.md          ← Monorepo overview
```


---

## 🖥️ FRONTEND — `frontend/`

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Firebase (client SDK)

```
frontend/
├── app/                          ← Next.js App Router (pages & layouts)
│   ├── layout.tsx                ← Root layout (fonts, providers, metadata)
│   ├── page.tsx                  ← Landing page (/)
│   ├── globals.css               ← Global styles imported by root layout
│   │
│   ├── dashboard/page.tsx        ← /dashboard
│   ├── explore/page.tsx          ← /explore
│   ├── projects/page.tsx         ← /projects (list)
│   ├── create/page.tsx           ← /create  (new project form)
│   ├── profile/page.tsx          ← /profile
│   ├── messages/page.tsx         ← /messages
│   ├── notifications/page.tsx    ← /notifications
│   ├── bookmarks/page.tsx        ← /bookmarks
│   ├── community/page.tsx        ← /community
│   ├── hackathons/page.tsx       ← /hackathons
│   ├── showcase/page.tsx         ← /showcase
│   ├── featured/page.tsx         ← /featured
│   ├── builders/page.tsx         ← /builders
│   ├── teams/page.tsx            ← /teams
│   ├── licenses/page.tsx         ← /licenses
│   ├── settings/page.tsx         ← /settings
│   ├── onboarding/page.tsx       ← /onboarding
│   ├── login/page.tsx            ← /login
│   └── signup/page.tsx           ← /signup
│
├── components/                   ← All reusable UI components
│   ├── ui/                       ← shadcn/ui primitives (DO NOT edit manually)
│   │   ├── button.tsx, input.tsx, dialog.tsx, ... (57 files)
│   ├── landing/                  ← Landing page section components
│   │   ├── hero-section.tsx
│   │   ├── features-section.tsx
│   │   ├── navigation.tsx
│   │   └── ... (14 files)
│   ├── dashboard/                ← Dashboard-specific components
│   │   ├── LeftSidebar.tsx
│   │   └── RightSidebar.tsx
│   ├── projects/                 ← Project-related components
│   │   ├── project-card.tsx
│   │   └── ship-project-dialog.tsx
│   ├── Sidebar.tsx               ← Main app navigation sidebar
│   ├── Aurora.tsx / Aurora.css   ← Animated aurora background effect
│   ├── ClickSpark.tsx            ← Click spark animation
│   ├── Folder.tsx / Folder.css   ← Folder component
│   ├── ProfileCard.tsx / .css    ← User profile card
│   ├── ReflectiveCard.tsx / .css ← Reflective card effect
│   └── theme-provider.tsx        ← next-themes provider wrapper
│
├── hooks/                        ← Custom React hooks
│   ├── useAuth.ts                ← Firebase auth state (user, loading, signOut)
│   ├── usePlatformStats.ts       ← Platform-wide stats (users, projects count)
│   ├── usePostViewTracker.ts     ← Track post views on mount
│   ├── use-toast.ts              ← Toast notification hook
│   └── use-mobile.ts             ← Responsive mobile detection hook
│
├── lib/                          ← Client-side helpers & Firebase SDK calls
│   ├── firebase.ts               ← Firebase app init (getApp / initializeApp)
│   ├── auth.ts                   ← Auth helpers (signIn, signUp, signOut, OAuth)
│   ├── profiles.ts               ← Firestore profile CRUD
│   ├── projects.ts               ← Firestore project CRUD
│   ├── posts.ts                  ← Firestore posts CRUD
│   ├── chats.ts                  ← Firestore chat/messaging queries
│   ├── notifications.ts          ← Firestore notifications queries
│   ├── stats.ts                  ← Platform statistics queries
│   ├── sanitize.ts               ← Input sanitization utilities
│   ├── security-logger.ts        ← Client-side security event logging
│   ├── env.ts                    ← Typed env variable access
│   └── utils.ts                  ← General utilities (cn, clsx wrapper)
│
├── public/                       ← Static files served as-is
│   ├── images/                   ← Page images (auth panels, shields, etc.)
│   ├── assets/demo/              ← Demo screenshots / gifs
│   ├── lanyard/                  ← Lanyard / badge assets
│   ├── icon.svg, apple-icon.png  ← Favicons
│   └── placeholder-*.png/svg     ← Generic placeholders
│
├── styles/
│   └── globals.css               ← Additional global CSS (Tailwind @layer base extensions)
│                                   NOTE: `app/globals.css` is imported by the root layout.
│                                   `styles/globals.css` holds supplementary base-layer rules.
│                                   Both are intentional; do not consolidate without testing.
│
├── .env.local                    ← Local secrets (never commit)
├── .env.example                  ← Template for required env vars
├── next.config.mjs               ← Next.js configuration
├── tailwind.config (inline)      ← Tailwind v4 config in postcss.config.mjs
├── tsconfig.json                 ← TypeScript config
├── components.json               ← shadcn/ui CLI config
└── package.json
```

---

## ⚙️ BACKEND — `backend/`

**Stack:** Node.js · Express 4 · TypeScript · Firebase Admin SDK · Zod

```
backend/
├── src/
│   ├── config/
│   │   └── index.ts              ← Port, NODE_ENV, CORS origin, Firebase credentials from process.env
│   │
│   ├── controllers/              ← [SCAFFOLDED] One file per feature — reads req, calls service, sends res
│   │   └── README.md
│   │
│   ├── middleware/               ← [SCAFFOLDED] Auth token verification, error handler, rate limiting
│   │   └── README.md
│   │
│   ├── models/                   ← [SCAFFOLDED] TypeScript interfaces + Zod schemas per feature
│   │   └── README.md
│   │
│   ├── repositories/             ← [SCAFFOLDED] Raw Firestore queries, no business logic
│   │   └── README.md
│   │
│   ├── routes/                   ← [SCAFFOLDED] Express.Router() per feature area
│   │   └── README.md
│   │
│   ├── services/                 ← [SCAFFOLDED] Business logic layer, calls repositories
│   │   └── README.md
│   │
│   ├── types/
│   │   └── index.ts              ← Shared types, enums, augmented Express types
│   │
│   ├── utils/                    ← [SCAFFOLDED] Response wrapper, pagination, sanitize helpers
│   │   └── README.md
│   │
│   ├── app.ts                    ← Express app: middleware stack, health check, route mounts
│   └── server.ts                 ← app.listen() entry point
│
├── tests/                        ← Jest + Supertest integration tests
│
├── .env.example                  ← Required env vars template (copy to .env)
├── .gitignore
├── package.json
└── tsconfig.json
```

> ℹ️ **Backend status:** The layered architecture is scaffolded and ready. Each folder (controllers, services, repositories, etc.) contains a `README.md` placeholder describing its purpose. The Express server runs and exposes a `/health` endpoint. Feature-specific routes are commented out in `app.ts` — add them as you build each feature following the checklist below.

---

## 🚀 Adding a New Feature — Checklist

Use this every time. Example: adding a **"Teams"** feature.

### Frontend Steps
1. **Page** → create `frontend/app/teams/page.tsx` (App Router page)
2. **Components** → add `frontend/components/teams/` folder with feature components
3. **Hook** → add `frontend/hooks/useTeams.ts` if you need local state/subscriptions
4. **Lib** → add `frontend/lib/teams.ts` for Firestore client-side queries
5. **Navigation** → update `frontend/components/Sidebar.tsx` with the new route

### Backend Steps (if the feature needs a server API)
1. **Model** → `backend/src/models/team.model.ts` — define `Team` interface + Zod schema
2. **Repository** → `backend/src/repositories/team.repository.ts` — raw Firestore CRUD
3. **Service** → `backend/src/services/team.service.ts` — business rules, call repository
4. **Controller** → `backend/src/controllers/team.controller.ts` — handle HTTP in/out
5. **Routes** → `backend/src/routes/team.routes.ts` — map paths to controller
6. **Mount** → register in `backend/src/app.ts`: `app.use("/api/teams", teamRouter)`
7. **Tests** → `backend/tests/team.test.ts`

---

## 🔐 Environment Variables

### Frontend (`frontend/.env.local`)
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

### Backend (`backend/.env`)
| Variable | Purpose |
|---|---|
| `PORT` | Server port (default 5000) |
| `NODE_ENV` | `development` / `production` |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_PRIVATE_KEY` | Service account private key |
| `FIREBASE_CLIENT_EMAIL` | Service account email |

---

## 🧱 Architecture Rules

| Rule | Detail |
|---|---|
| **No business logic in controllers** | Controllers only read req, call service, send res |
| **No Firestore calls in services** | Services call repositories; repositories own Firestore |
| **No `any` types** | Always use typed models or Zod inferred types |
| **`lib/` is client-only** | Never import Firebase Admin in `frontend/lib/` |
| **`repositories/` is server-only** | Never use Firebase Admin in frontend code |
| **Shared types** | Put in `backend/src/types/` and export; frontend mirrors with its own interfaces |
| **CSS** | Component-scoped CSS files live next to their component (e.g. `Aurora.css` next to `Aurora.tsx`) |

---

## 📦 Key Dependencies

### Frontend
| Package | Role |
|---|---|
| `next` 16 | Full-stack React framework |
| `react` 19 | UI library |
| `firebase` 12 | Client-side auth + Firestore |
| `tailwindcss` 4 | Utility CSS |
| `shadcn/ui` (radix) | Accessible UI primitives |
| `framer-motion` | Animations |
| `zod` | Schema validation |
| `react-hook-form` | Form state |

### Backend
| Package | Role |
|---|---|
| `express` 4 | HTTP server |
| `firebase-admin` 12 | Server-side Firestore + Auth |
| `zod` | Request body validation |
| `helmet` | Security headers |
| `cors` | Cross-origin requests |

---

*Last updated: June 2026 — update this document whenever the folder structure changes significantly.*

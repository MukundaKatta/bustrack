# 🚌 BusTrack

**Real-time school bus tracking with AI arrival prediction**

Built by [Team Zion](https://github.com/MukundaKatta) — an 8-person engineering squad learning how to ship real products as a team.

---

## 🎯 What is BusTrack?

BusTrack solves the "where's my bus?" problem that parents face every morning. A live map shows every active school bus in real time, with accurate ETA predictions based on traffic, weather, and historical patterns.

**Sprint 1 MVP:** Parents see buses moving on a live map with basic ETA calculation.

**Full Vision (Sprint 4):** Production-grade streaming pipeline with ML-powered arrival prediction.

---

## 🏗️ Tech Stack

### Web (Parent App + Admin Panel)
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Mapbox GL JS

### Mobile (Driver App)
- React Native + Expo
- Expo Location

### Backend
- Next.js API routes
- Prisma ORM
- NextAuth.js
- Zod

### Database
- PostgreSQL (Neon)

### Deployment
- Vercel (web)
- Neon (database)
- Expo Go (mobile)

---

## 📁 Repository Structure
<img width="1038" height="454" alt="image" src="https://github.com/user-attachments/assets/cf19f255-e74a-4d29-a3c8-a5b3e4c99448" />


---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm
- Git
- A GitHub account (you're here, so ✅)

### Setup

```bash
# Clone the repo
git clone https://github.com/MukundaKatta/bustrack.git
cd bustrack

# Install dependencies (once we have package.json)
npm install

# Set up environment variables
cp .env.example .env
# Fill in the values (ask tech lead for DB credentials)

# Run dev server
npm run dev
```

---

## 🌳 Branching Strategy

- `main` — production-ready code. Nobody commits directly.
- `dev` — integration branch. All feature branches merge here first.
- `feat/*` — new features. One branch per Jira ticket.
- `fix/*` — bug fixes.

**Rule:** No branch stays open for more than 2 days. Small PRs, merge often.

---

## 📝 Commit Message Format
type: short description [BT-XX]

**Types:** `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`

**Example:**
feat: add login form UI [BT-08]
---

## 🎫 Tickets

All tickets are tracked in Jira. Each commit and PR must reference a ticket ID (e.g. `[BT-08]`).

---

## 👥 Team Zion

| Role | Name |
|------|------|
| 🏗️ Tech Lead | Mukunda Rao Katta |
| 👑 Product Owner | Charan Lokku |
| 📊 Data / ML | Sanjana Vegesana |
| 🔧 Backend | Reema Sree S |
| 📱 Mobile | Tharun Kumar Potharasi |
| 🌐 Frontend | Manohar K |
| 🛠️ DevOps | Hareesh Duvvuru |
| 🎨 Admin Panel | Ravi Kiran V L |
| 📱 Mobile Support | Teju |

---

## 📅 Sprint 1 Goal

**By Friday of Week 2, a parent opens the app and watches a bus move across a live map of their city.**

That's it. That's the goal. Everything we build in the next 2 weeks ladders up to this one sentence.

---

**Free your mind. Then ship the ticket.**

— Team Zion 🚀

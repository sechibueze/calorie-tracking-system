# CalTrack API

REST API for a calorie-tracking app. Users log what they eat, get a warning on every day they reach their calorie limit, and admins manage all entries and see a weekly report.

## Features

- Food entries (name, calories, date/time) with filters by date range and a per-day summary
- Daily calorie limit (default **2,100 kcal**), configurable **per user**, with `limitReached` flagged per day
- Roles and permissions: `USER` manages their own entries; `ADMIN` manages everyone's and sees reports
- Food autocomplete from USDA FoodData Central, with graceful fallback to manual entry
- Admin report: entries added in the last 7 days vs the week before, and average calories per user
- Strict validation (Zod)

## Stack

Node.js · Express 5 · TypeScript · PostgreSQL · Prisma 7 · Zod · Winston · Vitest + Supertest · Docker Compose

## Quick start

```bash
cp .env.example .env
docker compose up -d postgres        # Postgres on localhost:5433
npm install
npx prisma migrate dev               # apply migrations
npm run db:seed                      # roles, demo users, tokens, 2 weeks of entries
npm run dev                          # http://localhost:3000
```

```bash
curl localhost:3000/api/v1/auth/me -H "Authorization: Bearer <token>"
```

## Demo users and tokens

| Role  | Email              | Password         | Daily limit |
| ----- | ------------------ | ---------------- | ----------- |
| ADMIN | admin@calorie.test | `@TopPassword29` | 2100        |
| USER  | alice@calorie.test | `@TopPassword29` | 2100        |
| USER  | bob@calorie.test   | `@TopPassword29` | 1800        |

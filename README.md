# LifeSum Tracker Foundation

This repository contains a clean starter for a simplified LifeSum-like nutrition tracker built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Included

- App Router layout and placeholder pages
- Shared UI shell for app pages and auth pages
- Prisma schema for users, profiles, meals, and meal entries
- PostgreSQL connection through `DATABASE_URL`

## Getting Started

1. Install dependencies with `npm install`.
2. Confirm the database connection in `.env`.
3. Generate the Prisma client with `npm run prisma:generate`.
4. Create the first migration with `npm run prisma:migrate`.
5. Start the app with `npm run dev`.

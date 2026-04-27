Redemption Week microsite for RCF FUTA.

Public site + protected `/admin` area in a single Next.js app.

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open `http://localhost:3000` with your browser to see the result.

## Environment variables

Copy `.env.example` to `.env.local` and fill in values.

```bash
cp .env.example .env.local
```

## Project structure (high-level)

- `src/app/*`: routes (public + `/admin`)
- `src/components/*`: shared UI components
- `src/lib/*`: utilities (env, data access)

## Deploy

This is intended to be deployed on Vercel and pointed at `rw.rcffuta.com`.

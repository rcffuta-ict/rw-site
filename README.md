Redemption Week microsite for RCF FUTA.

Public site + protected `/admin` area in a single Next.js app.

## Getting Started

First, ensure you have `mkcert` installed locally and run `mkcert -install`.
Then generate the local certificates in the root directory:

```bash
mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 ::1

```

Run the secure development server:

```bash
pnpm dev:ssl

```

Open `https://localhost:3000` with your browser to see the result.

## Environment variables

Copy `.env.example` to `.env.development` and fill in values.

```bash
cp .env.example .env.development
```

## Project structure (high-level)

- `src/app/*`: routes (public + `/admin`)
- `src/components/*`: shared UI components
- `src/lib/*`: utilities (env, data access)

## Deploy

This is intended to be deployed on Vercel and pointed at `rw.rcffuta.com`.

## Admin

The admin area is available at `/admin`. You will be prompted to log in with your email address.

You will receive an email with a link to log in. Click the link to log in.

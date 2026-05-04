# rw.rcffuta.com — Technical Engineering Specification

**Author:** Precious Olusola, ICT Coordinator, RCF FUTA
**Project:** Redemption Week 2026 Commerce Platform
**Document type:** Internal Engineering Reference
**Last updated:** April 2026

---

## 1. System Overview

rw.rcffuta.com is a commerce-first event microsite built as a single Next.js application. It serves two distinct audiences through separate route groups:

- **(public)** — no authentication required. Product catalogue, checkout, order fulfilment.
- **(admin)** — authenticated, role-gated. Order management, payment review, product management, financial reporting, verdict generation.

The system is intentionally standalone. It reuses the fellowship's existing Supabase project (shared database) but introduces new tables prefixed `rw_` to avoid collision with existing infrastructure. No existing tables are modified.

---

## 2. Repository Structure

```
rw.rcffuta.com/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                  # Landing /
│   │   │   ├── shop/
│   │   │   │   └── page.tsx              # /shop
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx              # /checkout
│   │   │   └── fulfil/
│   │   │       └── [orderRef]/
│   │   │           └── page.tsx          # /fulfil/[orderRef]
│   │   ├── (admin)/
│   │   │   ├── layout.tsx                # Auth guard + sidebar layout
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx              # /admin (dashboard)
│   │   │   │   ├── orders/
│   │   │   │   │   ├── page.tsx          # /admin/orders
│   │   │   │   │   └── [orderRef]/
│   │   │   │   │       └── page.tsx      # /admin/orders/[orderRef]
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── finance/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── verdicts/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── new/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── orders/
│   │   │   │   └── route.ts              # POST /api/orders — create order
│   │   │   ├── payments/
│   │   │   │   └── route.ts              # POST /api/payments — upload + extract
│   │   │   ├── payments/[id]/review/
│   │   │   │   └── route.ts              # POST /api/payments/[id]/review
│   │   │   └── verdicts/
│   │   │       └── route.ts              # POST /api/verdicts — generate PDF
│   │   └── layout.tsx                    # Root layout, fonts, providers
│   ├── components/
│   │   ├── ui/                           # Primitives: Button, Input, Badge, Card
│   │   ├── public/                       # Public-facing components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductDetailSheet.tsx
│   │   │   ├── CartContext.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── PaymentProgressBar.tsx
│   │   │   └── ReceiptUploadZone.tsx
│   │   └── admin/                        # Admin components
│   │       ├── OrdersTable.tsx
│   │       ├── PaymentReviewCard.tsx
│   │       ├── ProductVariantEditor.tsx
│   │       └── VerdictPreview.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                 # Browser Supabase client
│   │   │   ├── server.ts                 # Server Supabase client (cookies)
│   │   │   └── admin.ts                  # Service role client (API routes only)
│   │   ├── cloudinary.ts                 # Upload + signed URL helpers
│   │   ├── claude.ts                     # Receipt extraction via Claude Vision
│   │   ├── email.ts                      # Zoho SMTP via Nodemailer
│   │   ├── pdf.ts                        # Verdict PDF generation
│   │   ├── order-ref.ts                  # Order ref generator
│   │   └── validations.ts                # Zod schemas
│   ├── types/
│   │   └── database.ts                   # Generated Supabase types + RW types
│   └── middleware.ts                     # Auth + role guard for /admin routes
├── public/
├── tailwind.config.ts
├── next.config.ts
└── .env.local
```

---

## 3. Tech Stack

| Layer            | Technology                   | Version / Notes                                        |
| ---------------- | ---------------------------- | ------------------------------------------------------ |
| Framework        | Next.js                      | 15 (App Router)                                        |
| Language         | TypeScript                   | Strict mode                                            |
| Styling          | Tailwind CSS                 | v3                                                     |
| Database         | Supabase (PostgreSQL)        | Existing fellowship project                            |
| Auth             | Supabase Auth                | Email + password                                       |
| File storage     | Cloudinary                   | Private folder for receipts, public for product images |
| Receipt analysis | Anthropic Claude API         | `claude-sonnet-4-5`, Vision                            |
| Email            | Nodemailer + Zoho SMTP       | Existing SMTP credentials                              |
| PDF generation   | `@react-pdf/renderer`        | Server-side only                                       |
| Deployment       | Vercel                       | Subdomain `rw.rcffuta.com`                             |
| Validation       | Zod                          | API routes + form validation                           |
| State (cart)     | React Context + localStorage | Client-side, no server state                           |

---

## 4. Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # Server/API routes only — never expose to client

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_RECEIPT_FOLDER=rw_receipts      # private delivery type
CLOUDINARY_PRODUCTS_FOLDER=rw_products    # public delivery type

# Anthropic
ANTHROPIC_API_KEY=                  # Server only

# Zoho SMTP
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_USER=                          # fellowship zoho email
SMTP_PASS=
SMTP_FROM="RCF FUTA Redemption Week <noreply@rcffuta.com>"

# App
NEXT_PUBLIC_APP_URL=https://rw.rcffuta.com
```

**Rule:** Any variable without `NEXT_PUBLIC_` prefix is server-only. Never import `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `CLOUDINARY_API_SECRET`, or `SMTP_PASS` in any component or client-side code.

---

## 5. Database Schema

All new tables use the `rw_` prefix. They live in the same Supabase project as the fellowship's existing schema. No existing tables are touched.

### 5.1 `rw_products`

```sql
CREATE TABLE rw_products (
  id            uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text    NOT NULL,
  description   text,
  image_url     text,                    -- Cloudinary public URL
  base_price    integer NOT NULL,        -- in Naira (NOT kobo)
  is_available  boolean DEFAULT true,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
```

### 5.2 `rw_product_variants`

```sql
CREATE TABLE rw_product_variants (
  id             uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id     uuid    NOT NULL REFERENCES rw_products(id) ON DELETE CASCADE,
  size           text,                   -- 'S','M','L','XL','XXL','One Size', null if N/A
  color          text,                   -- e.g. 'Black', 'Navy Blue'
  design         text,                   -- e.g. 'Holy Spirit', 'Plain'
  price_override integer,               -- null = inherit base_price
  image_url      text,                   -- Cloudinary, variant-specific
  is_available   boolean DEFAULT true,
  created_at     timestamptz DEFAULT now()
);
```

**Computed price logic (TypeScript, not DB):**

```typescript
const effectivePrice = variant.price_override ?? product.base_price;
```

### 5.3 `rw_orders`

```sql
CREATE TABLE rw_orders (
  id              uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  order_ref       text    NOT NULL UNIQUE,  -- e.g. 'FF1234'
  customer_name   text    NOT NULL,
  customer_email  text    NOT NULL,
  customer_phone  text    NOT NULL,
  customer_note   text,
  status          text    NOT NULL DEFAULT 'pending'
    CHECK (status IN (
      'pending',
      'partially_paid',
      'paid',
      'confirmed',
      'in_production',
      'delivered',
      'flagged',
      'cancelled'
    )),
  total_amount    integer NOT NULL,         -- in Naira
  amount_paid     integer DEFAULT 0,        -- running total, in Naira
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE INDEX idx_rw_orders_order_ref ON rw_orders(order_ref);
CREATE INDEX idx_rw_orders_status    ON rw_orders(status);
CREATE INDEX idx_rw_orders_email     ON rw_orders(customer_email);
```

### 5.4 `rw_order_items`

```sql
CREATE TABLE rw_order_items (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid    NOT NULL REFERENCES rw_orders(id) ON DELETE CASCADE,
  variant_id  uuid    NOT NULL REFERENCES rw_product_variants(id),
  quantity    integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price  integer NOT NULL,    -- price snapshot at time of order, in Naira
  created_at  timestamptz DEFAULT now()
);
```

**Why snapshot the price:** If the admin updates a product's price after orders are placed, existing order totals must not change. `unit_price` is written once on insert and never updated.

### 5.5 `rw_payment_config`

```sql
CREATE TABLE rw_payment_config (
  id                    uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  min_initial_percent   integer NOT NULL DEFAULT 50
    CHECK (min_initial_percent BETWEEN 1 AND 100),
  is_installment_allowed boolean DEFAULT true,
  account_name          text    NOT NULL,
  account_number        text    NOT NULL,
  bank_name             text    NOT NULL,
  updated_by            uuid    REFERENCES profiles(id),
  updated_at            timestamptz DEFAULT now()
);
```

**Enforcement:** Only one row should ever exist. Enforce in the TypeScript layer by always using upsert on a fixed known ID (seed this row manually on first deploy). The settings UI never allows inserting a second row.

### 5.6 `rw_payments`

```sql
CREATE TABLE rw_payments (
  id                        uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                  uuid  NOT NULL REFERENCES rw_orders(id),
  amount_claimed            integer NOT NULL,       -- in Naira, what payer entered
  percent_of_total          integer,                -- computed on insert
  -- Cloudinary
  receipt_cloudinary_url    text  NOT NULL,
  receipt_cloudinary_public_id text,
  -- AI extraction
  extracted_sender_name     text,
  extracted_amount          integer,                -- in Naira
  extracted_date            date,
  extracted_time            text,
  extracted_bank            text,
  extraction_confidence     text
    CHECK (extraction_confidence IN ('high', 'medium', 'low')),
  amount_match              boolean,               -- extracted_amount = amount_claimed?
  -- Moderation
  status  text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'flagged', 'rejected')),
  reviewed_by   uuid REFERENCES profiles(id),
  reviewed_at   timestamptz,
  review_note   text,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX idx_rw_payments_order_id ON rw_payments(order_id);
CREATE INDEX idx_rw_payments_status   ON rw_payments(status);
```

### 5.7 `rw_roles`

```sql
CREATE TABLE rw_roles (
  id          uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  uuid  NOT NULL UNIQUE REFERENCES profiles(id),
  role        text  NOT NULL
    CHECK (role IN ('admin', 'moderator', 'ict')),
  assigned_by uuid  REFERENCES profiles(id),
  created_at  timestamptz DEFAULT now()
);
```

### 5.8 `rw_verdicts`

```sql
CREATE TABLE rw_verdicts (
  id                   uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_by         uuid  NOT NULL REFERENCES profiles(id),
  verdict_type         text  NOT NULL
    CHECK (verdict_type IN ('withdrawal_permit', 'production_manifest', 'combined')),
  financial_snapshot   jsonb,     -- totals + per-order breakdown at generation time
  production_snapshot  jsonb,     -- item quantities grouped by variant
  affected_order_ids   uuid[],    -- orders included in this verdict
  pdf_cloudinary_url   text,
  created_at           timestamptz DEFAULT now()
);
```

---

## 6. Row Level Security (RLS)

RLS is enabled on all `rw_` tables. Rules are designed so the client (browser) Supabase client can only read/write what it is entitled to. Sensitive operations go through server-side API routes using the service role key, which bypasses RLS intentionally.

### `rw_products` and `rw_product_variants`

```sql
-- Public can read available products/variants only
CREATE POLICY "public_read_available_products"
  ON rw_products FOR SELECT
  USING (is_available = true);

CREATE POLICY "public_read_available_variants"
  ON rw_product_variants FOR SELECT
  USING (is_available = true);

-- No public insert/update/delete
-- All mutations go through service role in API routes
```

### `rw_orders`

```sql
-- No direct client access
-- All reads and writes go through API routes (service role)
-- This prevents enumeration of other customers' orders
```

### `rw_payments`

```sql
-- No direct client access — all through API routes
```

### `rw_payment_config`

```sql
-- Public can read (account number must be visible on fulfilment page)
CREATE POLICY "public_read_payment_config"
  ON rw_payment_config FOR SELECT
  TO anon
  USING (true);

-- No public write
```

### `rw_roles`, `rw_verdicts`

```sql
-- Authenticated only, and only via API routes using service role
-- No direct client queries
```

---

## 7. API Routes

All API routes are in `src/app/api/`. They use the **service role** Supabase client. They never trust client-provided user IDs for sensitive operations — they derive identity from the Supabase session cookie.

### `POST /api/orders`

Creates a new order from a cart submission.

**Request body:**

```typescript
{
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_note?: string
  items: Array<{
    variant_id: string
    quantity: number
  }>
}
```

**Logic:**

1. Validate body with Zod
2. Fetch variant prices from DB (never trust client-provided prices)
3. Compute `total_amount` server-side
4. Generate `order_ref` — call `generateOrderRef()`, check uniqueness, retry up to 5× on collision
5. Insert `rw_orders` row
6. Insert `rw_order_items` rows
7. Send order confirmation email via Zoho SMTP
8. Return `{ order_ref, total_amount }`

**Response:**

```typescript
{ order_ref: string, total_amount: number }
```

---

### `POST /api/payments`

Handles receipt upload, Claude extraction, and payment record creation.

**Request:** `multipart/form-data`

```
order_ref: string
amount_claimed: number   (in Naira)
receipt: File            (image/jpeg or image/png)
```

**Logic:**

1. Validate fields
2. Fetch order by `order_ref` — confirm it exists and is not `delivered` or `cancelled`
3. Fetch `rw_payment_config` — check `is_installment_allowed`, compute minimum required amount
4. Validate `amount_claimed` ≥ minimum
5. Upload image to Cloudinary (private, `rw_receipts/` folder)
6. Call `extractReceiptData(imageUrl)` — Claude Vision API
7. Compute `percent_of_total = Math.round((amount_claimed / order.total_amount) * 100)`
8. Compute `amount_match = extracted_amount === amount_claimed`
9. Insert `rw_payments` row
10. Send "Receipt Received" email to customer
11. Return extracted data to client for preview display

**Response:**

```typescript
{
    payment_id: string;
    extracted: {
        sender_name: string | null;
        amount: number | null;
        date: string | null;
        time: string | null;
        bank: string | null;
        confidence: "high" | "medium" | "low";
        amount_match: boolean;
    }
}
```

---

### `POST /api/payments/[id]/review`

Moderator or admin approves, flags, or rejects a payment.

**Auth:** Requires active Supabase session + `rw_roles` row with role `admin` or `moderator`.

**Request body:**

```typescript
{
  action: 'approved' | 'flagged' | 'rejected'
  review_note?: string
}
```

**Logic:**

1. Verify session — get `profile_id` from session
2. Fetch `rw_roles` row for this profile — confirm `admin` or `moderator`
3. Fetch payment + associated order
4. Update `rw_payments` status, `reviewed_by`, `reviewed_at`, `review_note`
5. If `approved`:
    - Add `amount_claimed` to `order.amount_paid`
    - Recalculate order status:
        ```typescript
        function deriveOrderStatus(order): OrderStatus {
            const { amount_paid, total_amount, status } = order;
            if (
                status === "confirmed" ||
                status === "in_production" ||
                status === "delivered" ||
                status === "cancelled"
            )
                return status;
            if (amount_paid === 0) return "pending";
            if (amount_paid < total_amount) return "partially_paid";
            return "paid";
        }
        ```
    - Update `rw_orders` status + `amount_paid`
    - Send "Payment Confirmed" email to customer
6. If `flagged`:
    - Update order status to `flagged` if not already beyond it
    - Send "Payment Flagged" email to customer
7. If `rejected`:
    - No change to `amount_paid`
    - No email (rejected silently — flagged is the customer-facing action)

---

### `POST /api/verdicts`

Generates a verdict PDF. Admin only.

**Auth:** Requires `rw_roles.role = 'admin'`.

**Request body:**

```typescript
{
  verdict_type: 'withdrawal_permit' | 'production_manifest' | 'combined'
  order_ids: string[]   // must all be status 'confirmed'
}
```

**Logic:**

1. Auth check — admin only
2. Fetch all specified orders + their items + variants + products
3. Build `financial_snapshot`:
    ```typescript
    {
      total_collected: number,
      orders: Array<{ ref, customer, total, amount_paid }>
    }
    ```
4. Build `production_snapshot`:
    ```typescript
    // Group rw_order_items by variant, sum quantities
    Array<{
        product_name;
        size;
        color;
        design;
        total_qty;
    }>;
    ```
5. Generate PDF using `@react-pdf/renderer` server-side
6. Upload PDF to Cloudinary (`rw_verdicts/` folder, private)
7. Insert `rw_verdicts` row
8. Update all specified orders: status → `in_production`
9. Return `{ verdict_id, pdf_url }`

---

## 8. Key Library Modules

### `src/lib/order-ref.ts`

```typescript
import { createClient } from "@/lib/supabase/admin";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateCandidate(): string {
    const suffix = Array.from(
        { length: 4 },
        () => CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join("");
    return `FF${suffix}`;
}

export async function generateOrderRef(): Promise<string> {
    const supabase = createClient();
    for (let attempt = 0; attempt < 5; attempt++) {
        const ref = generateCandidate();
        const { data } = await supabase
            .from("rw_orders")
            .select("id")
            .eq("order_ref", ref)
            .maybeSingle();
        if (!data) return ref;
    }
    throw new Error("Failed to generate unique order ref after 5 attempts");
}
```

---

### `src/lib/claude.ts`

```typescript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ExtractedReceipt {
    sender_name: string | null;
    amount_ngn: number | null;
    date: string | null; // YYYY-MM-DD
    time: string | null; // HH:MM
    bank_name: string | null;
    confidence: "high" | "medium" | "low";
}

export async function extractReceiptData(
    imageBase64: string,
    mediaType: "image/jpeg" | "image/png"
): Promise<ExtractedReceipt> {
    const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 400,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: mediaType,
                            data: imageBase64,
                        },
                    },
                    {
                        type: "text",
                        text: `Extract details from this Nigerian bank transfer receipt.
Return ONLY valid JSON with exactly these keys:
{
  "sender_name": string or null,
  "amount_ngn": integer (Naira, no decimals) or null,
  "date": "YYYY-MM-DD" or null,
  "time": "HH:MM" or null,
  "bank_name": string or null,
  "confidence": "high" | "medium" | "low"
}
Set confidence to "high" if 4+ fields are clearly visible,
"medium" if 2-3 fields visible, "low" if fewer.
Return nothing except the JSON object.`,
                    },
                ],
            },
        ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    try {
        return JSON.parse(text.trim());
    } catch {
        return {
            sender_name: null,
            amount_ngn: null,
            date: null,
            time: null,
            bank_name: null,
            confidence: "low",
        };
    }
}
```

---

### `src/lib/email.ts`

```typescript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export type EmailTemplate =
    | "order_confirmation"
    | "receipt_received"
    | "payment_approved"
    | "payment_flagged";

export async function sendEmail(
    to: string,
    template: EmailTemplate,
    data: Record<string, unknown>
): Promise<void> {
    const { subject, html } = buildTemplate(template, data);
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
    });
}

function buildTemplate(
    template: EmailTemplate,
    data: Record<string, unknown>
): { subject: string; html: string } {
    // Each template returns subject + HTML string
    // Keep templates in /src/lib/email-templates/ as separate files
    // and import them here
    switch (template) {
        case "order_confirmation":
            return orderConfirmationTemplate(data);
        case "receipt_received":
            return receiptReceivedTemplate(data);
        case "payment_approved":
            return paymentApprovedTemplate(data);
        case "payment_flagged":
            return paymentFlaggedTemplate(data);
    }
}
```

---

### `src/lib/cloudinary.ts`

```typescript
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload receipt — private delivery, no public URL
export async function uploadReceipt(
    fileBuffer: Buffer,
    filename: string
): Promise<{ url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder: process.env.CLOUDINARY_RECEIPT_FOLDER,
                    resource_type: "image",
                    type: "authenticated", // private — requires signed URL to view
                    public_id: filename,
                },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve({ url: result.secure_url, public_id: result.public_id });
                }
            )
            .end(fileBuffer);
    });
}

// Generate a time-limited signed URL for admin to view a receipt
export function getSignedReceiptUrl(publicId: string): string {
    return cloudinary.url(publicId, {
        type: "authenticated",
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    });
}

// Upload product image — public
export async function uploadProductImage(
    fileBuffer: Buffer,
    filename: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder: process.env.CLOUDINARY_PRODUCTS_FOLDER,
                    resource_type: "image",
                    type: "upload", // public
                    public_id: filename,
                    transformation: [
                        { width: 1200, height: 1200, crop: "limit" },
                        { quality: "auto", fetch_format: "auto" },
                    ],
                },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve(result.secure_url);
                }
            )
            .end(fileBuffer);
    });
}
```

---

## 9. Authentication & Middleware

### Admin Auth Flow

1. Admin visits any `/admin/*` route
2. `middleware.ts` intercepts — checks for Supabase session cookie
3. If no session → redirect to `/admin/login`
4. If session exists → pass through to the route handler
5. Route handler (server component) fetches `rw_roles` for the session's `profile_id`
6. If no role found → redirect to `/` (not an admin)
7. Role is passed down as a prop/context — used for conditional UI rendering

### `src/middleware.ts`

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Only guard /admin routes
    if (!request.nextUrl.pathname.startsWith("/admin")) {
        return response;
    }

    // Skip the login page itself
    if (request.nextUrl.pathname === "/admin/login") {
        return response;
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                /* cookie handlers */
            },
        }
    );

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return response;
    // Note: role check happens in each admin page, not middleware
    // Middleware only checks for a valid session
}

export const config = {
    matcher: ["/admin/:path*"],
};
```

### `src/app/(admin)/admin/login/page.tsx`

Simple email + password form using `supabase.auth.signInWithPassword()`. On success, redirect to `/admin`. Supabase session is persisted via cookies automatically.

**Important:** The login page only accepts users who already exist in `auth.users` (Supabase Auth) AND have a row in `profiles` AND have a row in `rw_roles`. Meeting just one or two of these conditions is insufficient.

---

## 10. Order Status State Machine

```
pending
  └─► partially_paid   (first payment approved, amount < total)
        └─► paid        (all payments approved, amount = total)
              └─► confirmed    (moderator explicitly confirms — optional step)
                    └─► in_production  (verdict PDF generated)
                          └─► delivered  ✓ [TERMINAL]

Any non-terminal state ──► flagged   (payment issue raised)
  flagged ──► back to previous state  (on new approved payment)

Any non-terminal state ──► cancelled  ✗ [TERMINAL — admin/ict only]
```

**Status transitions are enforced in the API routes**, not in the DB. The DB `CHECK` constraint only validates allowed values, not the transition direction.

---

## 11. Cart Architecture

The cart is entirely client-side. No server state, no Supabase involvement until checkout submit.

```typescript
// src/components/public/CartContext.tsx

interface CartItem {
    variant_id: string;
    product_name: string;
    variant_label: string; // e.g. "L · Black · Holy Spirit"
    unit_price: number;
    quantity: number;
    image_url: string;
}

interface CartContext {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (variant_id: string) => void;
    updateQuantity: (variant_id: string, qty: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
}
```

Persisted to `localStorage` under key `rw_cart`. Hydrated on mount. Cart is cleared after successful order creation.

---

## 12. Verdict PDF Structure (`@react-pdf/renderer`)

```typescript
// src/lib/pdf.ts
// Called server-side only — in /api/verdicts route

import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

// PDF is rendered to a Buffer using ReactPDF.renderToBuffer()
// Buffer is then uploaded to Cloudinary

// Pages:
// Page 1 — Cover: logos, title, date, generated-by, document ref
// Page 2 — Financial Summary: total collected, per-order table
// Page 3 — Production Manifest: grouped variant table with quantities
// Page 4 — Authorisation: statement text, two signature lines
```

---

## 13. Supabase Client Setup

Three separate clients for three contexts:

```typescript
// src/lib/supabase/client.ts — browser, anon key
import { createBrowserClient } from "@supabase/ssr";
export const createClient = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

// src/lib/supabase/server.ts — server components, anon key + cookies
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
export const createClient = () => {
    const cookieStore = cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get: (name) => cookieStore.get(name)?.value } }
    );
};

// src/lib/supabase/admin.ts — API routes only, service role (bypasses RLS)
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
export const createClient = () =>
    createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
```

---

## 14. Zod Validation Schemas

```typescript
// src/lib/validations.ts

import { z } from "zod";

export const CreateOrderSchema = z.object({
    customer_name: z.string().min(2).max(100),
    customer_email: z.string().email(),
    customer_phone: z.string().min(10).max(15),
    customer_note: z.string().max(300).optional(),
    items: z
        .array(
            z.object({
                variant_id: z.string().uuid(),
                quantity: z.number().int().min(1).max(20),
            })
        )
        .min(1),
});

export const SubmitPaymentSchema = z.object({
    order_ref: z.string().regex(/^FF[A-Z0-9]{4}$/),
    amount_claimed: z.number().int().min(1),
});

export const ReviewPaymentSchema = z.object({
    action: z.enum(["approved", "flagged", "rejected"]),
    review_note: z.string().max(500).optional(),
});

export const GenerateVerdictSchema = z.object({
    verdict_type: z.enum(["withdrawal_permit", "production_manifest", "combined"]),
    order_ids: z.array(z.string().uuid()).min(1),
});

export const PaymentConfigSchema = z.object({
    account_name: z.string().min(2),
    account_number: z.string().min(10).max(10),
    bank_name: z.string().min(2),
    min_initial_percent: z.number().int().min(1).max(100),
    is_installment_allowed: z.boolean(),
});
```

---

## 15. TypeScript Types

```typescript
// src/types/database.ts (rw_ types only — add to existing file)

export type OrderStatus =
    | "pending"
    | "partially_paid"
    | "paid"
    | "confirmed"
    | "in_production"
    | "delivered"
    | "flagged"
    | "cancelled";

export type PaymentStatus = "pending" | "approved" | "flagged" | "rejected";
export type ExtractionConfidence = "high" | "medium" | "low";
export type RwRole = "admin" | "moderator" | "ict";
export type VerdictType = "withdrawal_permit" | "production_manifest" | "combined";

export interface RwProduct {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    base_price: number;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}

export interface RwProductVariant {
    id: string;
    product_id: string;
    size: string | null;
    color: string | null;
    design: string | null;
    price_override: number | null;
    image_url: string | null;
    is_available: boolean;
    created_at: string;
}

export interface RwOrder {
    id: string;
    order_ref: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_note: string | null;
    status: OrderStatus;
    total_amount: number;
    amount_paid: number;
    created_at: string;
    updated_at: string;
}

export interface RwOrderItem {
    id: string;
    order_id: string;
    variant_id: string;
    quantity: number;
    unit_price: number;
    created_at: string;
}

export interface RwPayment {
    id: string;
    order_id: string;
    amount_claimed: number;
    percent_of_total: number | null;
    receipt_cloudinary_url: string;
    receipt_cloudinary_public_id: string | null;
    extracted_sender_name: string | null;
    extracted_amount: number | null;
    extracted_date: string | null;
    extracted_time: string | null;
    extracted_bank: string | null;
    extraction_confidence: ExtractionConfidence | null;
    amount_match: boolean | null;
    status: PaymentStatus;
    reviewed_by: string | null;
    reviewed_at: string | null;
    review_note: string | null;
    created_at: string;
}

export interface RwRole {
    id: string;
    profile_id: string;
    role: RwRole;
    assigned_by: string | null;
    created_at: string;
}

// Enriched types for UI
export interface OrderWithItems extends RwOrder {
    items: Array<
        RwOrderItem & {
            variant: RwProductVariant & { product: RwProduct };
        }
    >;
    payments: RwPayment[];
}
```

---

## 16. First-Deploy Checklist

Before the site goes live, complete these steps in order:

- [ ] All `rw_` tables created in Supabase
- [ ] All indexes created
- [ ] RLS enabled on all `rw_` tables and policies applied
- [ ] `rw_payment_config` seeded with account details and minimum percent
- [ ] `rw_roles` row inserted manually for your own profile (role: `ict`)
- [ ] `rw_roles` row inserted for VP Admin profile (role: `admin`)
- [ ] Cloudinary folders created: `rw_receipts` (authenticated), `rw_products` (public)
- [ ] All environment variables set in Vercel project settings
- [ ] Zoho SMTP credentials verified (send a test email)
- [ ] Anthropic API key active and has sufficient credits
- [ ] `rw.rcffuta.com` subdomain DNS pointed to Vercel (CNAME)
- [ ] Vercel domain configured for the subdomain
- [ ] At least 2–3 products + variants seeded for demo

---

## 17. Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` must never appear in any client-side code or component. It only exists in API routes.
- `ANTHROPIC_API_KEY` is server-only. The Claude Vision call happens in `/api/payments`, never in the browser.
- Receipt images are stored as `authenticated` type in Cloudinary. They are never publicly accessible by URL. The admin dashboard fetches signed URLs (1-hour expiry) server-side.
- Product images are public (no sensitive data).
- The order ref (`FF1234`) is the only credential needed to access an order's fulfilment page. It is intentionally low-security (like a Remita RRR) — it grants access to pay, not to cancel or modify.
- Admin access requires both a valid Supabase session AND a row in `rw_roles`. Having a fellowship account alone is insufficient.

---

_Internal engineering reference — RCF FUTA ICT Unit · rw.rcffuta.com_

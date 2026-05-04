# RW-Site — Final Implementation Plan (Demo Build)

> **Stack:** Next.js 16 · App Router · Tailwind CSS v4 · TypeScript strict  
> **Mode:** Demo (no Supabase — mock data throughout)  
> **Theme:** "The Lord's Witnesses: The Purified Army"  
> **Event:** Redemption Week '26 — 38th Anniversary · RCFFUTA

---

## 0. Resolved Corrections (from review)

| Item | Resolution |
|---|---|
| `/fulfil/[orderRef]` | ❌ Removed. Route is `/fulfil` only — receives `?ref=FF3A9C` via query param or in-page input |
| Old routes (`/merch`, `/order`, `/gallery`, `/archive`, `/programme`) | ❌ Delete all — not preserved |
| Product variants | ✅ Full variant UX: colour swatches + size chips in a product drawer/sheet |
| Receipt submission | ✅ Show extracted data on upload → user confirms accuracy with checkbox → admin sees flag |
| Sponsors section | ✅ Renamed to **Sponsors & Partners** with actual package tiers from event-details.md |
| Supabase | ❌ Not in this build — demo mock data only |

---

## 1. Design System

### 1.1 Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `--rw-bg` | `#10001A` | Page background (deep dark wine-purple) |
| `--rw-bg-alt` | `#120002` | Alternate background (deep dark crimson) |
| `--rw-surface` | `#1A0008` | Card surface |
| `--rw-surface-2` | `#220010` | Elevated card |
| `--rw-crimson` | `#CD1A30` | Primary brand red |
| `--rw-red` | `#FF001E` | CTA red, accents |
| `--rw-fire` | `#FF0A00` | Flame orange-red |
| `--rw-orange` | `#FF9100` | Warm flame accent / highlights |
| `--rw-wine` | `#940011` | Dark red for borders, badges |
| `--rw-burgundy` | `#7A0C31` | Secondary surfaces |
| `--rw-white` | `#FFFFFF` | Pure white — "The Purified" |
| `--rw-text` | `#F5E6E8` | Body text (warm white) |
| `--rw-muted` | `#9E7A80` | Muted text |
| `--rw-border` | `rgba(205,26,48,0.2)` | Subtle crimson borders |

**Gradient references:**
- Hero glow: `radial-gradient from #CD1A30 → #FF9100 → transparent`
- Fire gradient: `linear-gradient(135deg, #FF0A00, #FF9100)`
- Dark overlay: `linear-gradient(to bottom, transparent, #10001A)`
- Primary button: `linear-gradient(135deg, #CD1A30, #FF001E)`

### 1.2 Typography

```
Display/Headings : Syne Bold 700–800 (Google Fonts)
Body             : Inter 400–600
Mono (order ref) : JetBrains Mono — for FF3A9C ref display
```

Import via `next/font/google` in root layout.

### 1.3 Visual Motifs

- **Flame / torch** — central motif (from official emblem). Use CSS flame-like gradients, glow effects
- **Glassmorphism cards** — `background: rgba(255,255,255,0.04)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(205,26,48,0.2)`
- **Grain texture overlay** — subtle noise on hero sections for cinematic depth
- **Micro-animations** — stagger fade-in on scroll, hover scale on cards, counter animations on stats
- **Order ref pill** — styled like a CSS color hex: monospace, surrounded by a glowing red pill

---

## 2. Route Structure

```
src/app/
├── layout.tsx                    ← Root: HTML wrapper + font setup only
├── globals.css                   ← Full design system
│
├── (public)/
│   ├── layout.tsx                ← Public nav + footer
│   ├── page.tsx                  ← / Landing page
│   ├── shop/
│   │   └── page.tsx              ← /shop — Product catalogue + cart
│   ├── checkout/
│   │   └── page.tsx              ← /checkout — 3-step order form
│   └── fulfil/
│       └── page.tsx              ← /fulfil?ref=FF3A9C — Standalone payment
│
├── (admin)/
│   ├── layout.tsx                ← Admin sidebar shell
│   └── admin/
│       ├── page.tsx              ← /admin — Dashboard
│       ├── login/
│       │   └── page.tsx          ← /admin/login
│       ├── orders/
│       │   ├── page.tsx          ← /admin/orders
│       │   └── [orderRef]/
│       │       └── page.tsx      ← /admin/orders/[orderRef]
│       ├── products/
│       │   ├── page.tsx          ← /admin/products
│       │   └── [id]/
│       │       └── page.tsx      ← /admin/products/[id]
│       ├── finance/
│       │   └── page.tsx          ← /admin/finance
│       ├── verdicts/
│       │   ├── page.tsx          ← /admin/verdicts
│       │   └── new/
│       │       └── page.tsx      ← /admin/verdicts/new
│       └── settings/
│           └── page.tsx          ← /admin/settings
│
└── api/                          ← (stub routes — not wired in demo)
    ├── orders/route.ts
    └── payments/route.ts
```

**Files to DELETE before build:**
- `src/app/page.tsx`
- `src/app/merch/` (entire dir)
- `src/app/order/` (entire dir)
- `src/app/gallery/` (entire dir)
- `src/app/archive/` (entire dir)
- `src/app/programme/` (entire dir)
- `src/app/admin/` (entire dir — replaced by `(admin)/admin/`)
- `src/app/shared/ui.ts` (replaced by new component system)
- `src/components/SiteHeader.tsx`
- `src/components/SiteFooter.tsx`

---

## 3. Landing Page — Section-by-Section Spec

### Section 1 · Hero (full-viewport)
- **Background:** `#10001A` with radial glow (crimson + orange) at top-right, grain texture overlay
- **Badge pill:** `38th Anniversary` in gold/orange — top of hero
- **Headline:** `REDEMPTION WEEK '26` — huge, white, Syne font, all caps
- **Sub-theme:** `"The Lord's Witnesses: The Purified Army"` — italic, muted
- **Meta chips:** 📅 Dates TBD · 📍 FUTA, Akure
- **CTAs:** `View Programme` (outlined) + `Shop Merch` (primary fire gradient)
- **Countdown timer:** floating card below CTAs — Days | Hours | Mins | Secs (animated flip)
- **Hero image:** large placeholder — right side on desktop, below on mobile (flame/rally aesthetic)
- **Scroll indicator:** animated chevron at bottom

### Section 2 · Celebrating 38 Years (rotating taglines)
- Four lines from event-details.md §2 — auto-rotating or staggered display
- *"Celebrating 38 years of influence. Strength. Consistency. GOD's faithfulness."*
- Stats strip beneath: `9,000+ Alumni | 900+ Members | 16 Units | 38 Years`

### Section 3 · Programme Preview
Seven night cards in a horizontal scroll (mobile) / 2×3+1 grid (desktop):

| Day | Night Name | Short Copy |
|---|---|---|
| Mon | Opening Ceremony | A grand, colorful opening celebrating Nigerian cultures... |
| Tue | Word Night | A deep dive into the undiluted Word of God... |
| Wed | Power Night | A night of impartations, healings, and activations... |
| Thu | Drama Night — Acts '26 | A rollercoaster of emotions, revival, and powerful storytelling... |
| Fri | Choir Concert | Dance like David danced. A night of praise and worship... |
| Sat | RIFE & Alumni Reunion | Alumni come home. Knowledge is passed down... |
| Sun | Handing Over Ceremony | The mantle is passed. Elijah to Elisha... |

Each card: Placeholder image · Day badge · Night name · Short copy · atmosphere tags

### Section 4 · Featured Merch
- 3 product cards (from demo data)
- Placeholder images in fire-theme gradient
- Price + variant hint ("4 colours · 5 sizes")
- "Shop the Collection →" CTA

### Section 5 · About the Fellowship
- Short para from event-details.md §1 short description
- Grid of 5 aims (§6 from event-details) as icon cards

### Section 6 · Photo Gallery Strip
- Horizontal scroll of 8 placeholder image cells (labeled)
- Label: "📸 Gallery photos coming soon"

### Section 7 · Sponsors & Partners
- Section heading: "Support the Vision"
- Sub: *"Partner with 38 years of impact. Reach 900+ students and alumni."*
- 4 sponsorship tier cards (Diamond / Gold / Silver / Bronze):
  - Tier badge + price + key inclusions (from event-details.md §7)
- Special tier card (custom)
- Contact info: Tobi + Ayobami (from event-details.md §7)
- "Get in touch →" button
- This section doubles as student businesses ad space (add a "Community Partners" subsection — placeholder logos grid)

### Section 8 · CTA Banner
> *"Just like birthdays and anniversaries, Redemption Week comes once every year..."*
> **"Let us make this 38th Redemption Week the best yet."**
- Full-width dark crimson banner with flame gradient
- "Pre-order Merch" button

### Section 9 · Footer
- Logo + "RCF FUTA" wordmark
- Slogan: *"A place where good things never cease"*
- Quick links: Programme · Shop · Fulfil Order · Admin
- Fellowship facts: Founded 1983 · CRM Family
- Copyright © RCFFUTA 2026

---

## 4. Shop Page `/shop`

### Product Grid
- Category tabs: All · T-Shirts · Hoodies · Accessories
- 3-col desktop / 2-col tablet / 1-col mobile
- Filter: available only (demo shows all)

### ProductCard Component
```
[Placeholder Image — fire gradient + product icon]
[Category badge]
[Product Name]
[Price — ₦X,XXX]
[Colour swatch dots — shows available colours]
[Quick "View" or "Add" hover overlay]
```

### Product Detail Drawer/Sheet (slides in from right)
Triggered by clicking a product card:
```
[Large placeholder image — with colour-filtered gradient]
[Colour selector] — swatch buttons: Black · Burgundy · White
[Size selector]   — chip buttons: S · M · L · XL · XXL (greyed if unavailable)
[Quantity stepper]  — − 1 +
[Effective price]  — Updates if variant has price_override
[Add to Cart button]
[Description + atmosphere tags]
```

### Cart
- **Desktop:** sticky right sidebar (slides in when cart has items)
- **Mobile:** bottom drawer / floating "View Cart" button
- Cart item row: image thumbnail · name · variant label · qty stepper · price · remove
- Cart total + "Proceed to Checkout" CTA
- Persisted to `localStorage` under `rw_cart`

---

## 5. Checkout Page `/checkout`

### Step Indicator
```
① Your Info  →  ② Review Cart  →  ③ Order Created
```

### Step 1 — Customer Info
- Full name (required)
- Email (required — for confirmation)
- Phone (required — `080...`)
- Optional note (e.g. "Please hold for Sunday pickup")

### Step 2 — Cart Review
- Table: Product · Variant · Qty · Unit Price · Subtotal
- Order total
- Edit cart link
- Confirm & Place Order button

### Step 3 — Order Created ✓
- Success state — confetti/fireworks animation
- **Order Reference Card** (the key moment):
  ```
  ┌──────────────────────────────────┐
  │  Your Order Reference            │
  │                                  │
  │     ── FF · 3A · 9C ──           │  ← styled like CSS color hex
  │          FF3A9C                  │  ← monospace, large, glowing red
  │                                  │
  │  Save this — share it with       │
  │  whoever will make the payment.  │
  │                                  │
  │  [Copy Ref]  [Go to Payment →]   │
  └──────────────────────────────────┘
  ```
- "Go to Payment" links to `/fulfil?ref=FF3A9C`
- Cart is cleared on success

---

## 6. Order Fulfilment Page `/fulfil`

> **This is a standalone page.** The person paying does NOT have to be the person who ordered. It can be shared via WhatsApp/link.

### URL Handling
- `/fulfil` — shows input form (enter ref manually)
- `/fulfil?ref=FF3A9C` — auto-loads the order immediately

### Layout (after order is loaded)

**Block 1 — Order Summary Card**
- Ref badge `FF3A9C`
- Customer name
- Items list (product · variant · qty · price)
- Total amount
- Status badge (Pending / Partially Paid / Paid)

**Block 2 — Payment Progress**
```
Payment Progress
[████████░░░░░░░░░░░░] 50%
₦4,500 paid of ₦9,000 total · ₦4,500 remaining
```
- Visual fill bar in fire gradient
- Show minimum required for this payment (from payment config)

**Block 3 — Bank Account Details**
```
Transfer to:
Bank:    First Bank
Account: RCF FUTA
Number:  3012 345 678   [Copy]
```

**Block 4 — Make a Payment**
- Amount field: "How much are you paying?" (with min % note: "Minimum ₦X,XXX — X% of total")
- Real-time validation: amount ≥ minimum
- Receipt upload zone (drag-and-drop):
  - "Drop your receipt image here, or click to browse"
  - Accepts: image/jpeg, image/png, application/pdf (≤ 6 MB)
- Submit button

**Block 5 — Extraction Result (after submit)**
```
📄 Receipt Analysis
┌─────────────────────────────────────────┐
│ Sender Name:   John Doe                 │
│ Amount:        ₦4,500                   │
│ Date:          2026-05-04               │
│ Time:          14:32                    │
│ Bank:          GTBank                   │
│ Confidence:    ✓ High                   │
└─────────────────────────────────────────┘

[ ✓ ] This information looks accurate
[ × ] This doesn't look right (admin will review manually)

[Submit Confirmation]
```
- The accuracy checkbox drives a `user_confirmed_accuracy: boolean` field on the payment record
- If unchecked → flags the payment for mandatory manual review
- After final submission: "Receipt received! We'll notify you once confirmed."

**Block 6 — Payment History**
- List of previous payments on this order
- Each row: date · amount · status badge (Pending / Approved / Flagged / Rejected)

---

## 7. Admin Pages

### Admin Layout
- **Sidebar (desktop):** fixed left, dark surface (`#120002`), crimson accents
  - Logo / "RW'26 Admin"
  - Nav items with icons: Dashboard · Orders · Products · Finance · Verdicts · Settings
  - Role badge at bottom: Admin / Moderator / ICT
  - Logout button
- **Mobile:** top rail + hamburger → slide-out drawer

### /admin — Dashboard
- Stats cards (4): Total Orders · Revenue · Pending Payments · Flagged
- Recent orders table (10 rows)
- Quick actions: All Orders · Pending Payments · Generate Verdict

### /admin/orders — Orders Table
- Search bar + filter tabs (All · Pending · Partial · Paid · Confirmed · Flagged · Cancelled)
- Table columns: Ref · Customer · Items · Total · Paid · Status · Date · Actions
- Status badge colour mapping:
  - `pending` → grey · `partially_paid` → orange · `paid` → green
  - `confirmed` → blue · `in_production` → violet · `delivered` → teal
  - `flagged` → red · `cancelled` → dark grey
- Bulk select checkboxes (for verdict generation)

### /admin/orders/[orderRef] — Order Detail
- Order header: ref, customer info (name, email, phone, note), status, dates
- Line items table
- **Payments panel:** each payment as a card:
  - Amount claimed · % of total
  - Receipt image (placeholder signed URL in demo)
  - AI extraction table (sender, amount, date, bank, confidence badge)
  - `user_confirmed_accuracy` indicator
  - Status badge + Review actions: [Approve] [Flag] [Reject] + note field
- **Order actions:** Confirm · Mark In-Production · Mark Delivered · Cancel

### /admin/products — Products List
- Product cards with thumbnail placeholder
- "Add Product" button
- Toggle availability
- Variant count badge

### /admin/products/[id] — Product Detail / Variant Editor
- Product info (name, description, base price, image)
- Variant table: colour · size · design · price override · image · available toggle
- Add variant form

### /admin/finance — Finance Overview
- Summary totals: Collected · Pending · Flagged · Net
- Payments table with export CSV stub

### /admin/verdicts — Verdicts List
- Generated verdict PDFs (mock list)
- "Generate New Verdict" button

### /admin/verdicts/new — Generate Verdict
- Select type: Withdrawal Permit / Production Manifest / Combined
- Order selector (shows confirmed orders)
- Generate button (stub in demo)

### /admin/settings — Settings
- **Payment Config:** bank name · account name · number · min % slider · installment toggle · Save
- **Admin Roles:** table of admins (mock list)

---

## 8. Component Architecture

```
src/components/
├── ui/
│   ├── Button.tsx          variants: primary | outlined | ghost | danger | fire (gradient)
│   ├── Input.tsx           label + error state + dark theme
│   ├── Badge.tsx           status colour mapping
│   ├── Card.tsx            glass surface
│   ├── Drawer.tsx          slide-in panel (right or bottom)
│   └── Spinner.tsx
│
├── public/
│   ├── PublicHeader.tsx    dark sticky nav with cart icon + mobile hamburger
│   ├── PublicFooter.tsx    RCF FUTA footer
│   ├── CountdownTimer.tsx  animated flip digits
│   ├── ProductCard.tsx     image + swatches + hover overlay
│   ├── ProductDrawer.tsx   variant selector sheet
│   ├── CartContext.tsx     localStorage-backed context + hook
│   ├── CartSidebar.tsx     desktop sticky sidebar
│   ├── CartDrawer.tsx      mobile bottom drawer
│   ├── PaymentProgressBar.tsx
│   └── ReceiptUploadZone.tsx
│
└── admin/
    ├── AdminSidebar.tsx
    ├── StatsCard.tsx
    ├── OrdersTable.tsx
    ├── PaymentReviewCard.tsx
    ├── ProductVariantEditor.tsx
    └── OrderStatusBadge.tsx
```

---

## 9. Demo Data Strategy

No Supabase. All data is mocked:

### Products (static, server-safe)
`src/lib/data/products.ts`
```typescript
// 4 products × multiple variants
// 1. Anniversary T-Shirt — Black, White, Burgundy × S M L XL XXL — ₦4,500
// 2. RW'26 Hoodie        — Black, Burgundy × M L XL XXL — ₦12,000
// 3. Anniversary Cap      — Black, White × One Size — ₦3,500
// 4. Sticker Pack         — One Size × One Colour — ₦800
```

### Orders (seeded demo for admin)
`src/lib/data/orders.ts`
```typescript
// 6 mock orders in different statuses
// includes payment history on some
```

### Cart (client-side, localStorage)
`src/components/public/CartContext.tsx` — `rw_cart` key

### Order Creation (client-side demo)
On checkout submit → generate `FF` + 4 alphanumeric chars → store in `localStorage` under `rw_orders_demo`

### Order Lookup on /fulfil
Read from `localStorage` demo store. If not found → show "Order not found" state.

### Payment Config (static)
```typescript
{ bank: 'First Bank', accountName: 'RCF FUTA', accountNumber: '3012345678', minPercent: 50, installmentAllowed: true }
```

### Receipt Extraction (mocked)
On upload → 1.5s fake delay → return hardcoded mock extraction object → display in UI

---

## 10. Content Mapping (from event-details.md)

| Page / Section | Content Used |
|---|---|
| Hero headline | §2: "REDEMPTION WEEK '26" |
| Hero theme | §2: "The Lord's Witnesses: The Purified Army" |
| Hero meta | §1: 38th Anniversary · FUTA, Akure |
| Hero countdown | Dates TBD — placeholder `[EVENT DATE TBD]` |
| 38 Years strip | §2: 4 celebrating lines; §5: 9,000+ alumni, 900+ members, 16 units |
| Programme cards | §3 + §4: All 7 nights with short copy and atmosphere tags |
| About section | §1 short description + §6 aims (5 cards) |
| CTA banner | §8 conclusion copy + CTA line |
| Sponsors section | §7: All 4 tiers + Special + contact details |
| Footer | §1 slogan · fellowship description |

---

## 11. Phase Execution Order

| Phase | Scope | Status |
|---|---|---|
| 1 | `globals.css`, root layout (fonts), delete old files | ⬜ |
| 2 | Public layout (nav + footer), UI primitives | ⬜ |
| 3 | Landing page (all 9 sections) | ⬜ |
| 4 | Demo data (`products.ts`, `orders.ts`) + `CartContext` | ⬜ |
| 5 | Shop page + `ProductCard` + `ProductDrawer` + Cart | ⬜ |
| 6 | Checkout page (3-step) | ⬜ |
| 7 | Fulfil page (`/fulfil?ref=`) | ⬜ |
| 8 | Admin layout + all admin pages | ⬜ |

---

## 12. Still TBD (waiting on committee)

| Item | Impact |
|---|---|
| Exact event dates (Mon–Sun) | Countdown target, programme date chips |
| Venue / auditorium | Hero meta chip |
| Featured speakers per night | Night cards extended detail |
| Confirmed brand hex codes | Using user-provided palette for now |
| RW emblem PNG | Using CSS flame placeholder |
| Product photos / mockups | CSS gradient placeholders |
| Merch item list + prices | Demo data uses estimates |
| Payment account details | Demo uses "First Bank / RCF FUTA / 3012345678" |

---

_Plan v2 — RCF FUTA ICT Unit · rw.rcffuta.com_

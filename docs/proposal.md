# Redemption Week Digital Infrastructure — Committee Proposal

**Prepared by:** [Your Name], ICT Coordinator, RCF FUTA  
**Date:** [Date]  
**Status:** Draft — Pending Committee Review  

---

## 1. Overview

As part of our preparation for this year's Redemption Week, the ICT unit is proposing a dedicated event microsite hosted at **rw.rcffuta.com**, separate from the fellowship's main website at rcffuta.com.

This site will serve two primary purposes:

1. **Event information hub** — programme schedule, night-by-night details, guest/speaker information, and logistics for attendees
2. **Merch pre-order platform** — a structured channel for members and guests to order anniversary merchandise ahead of and during the event week

This document outlines the proposed scope, technical approach, asset requirements, payment handling, and long-term sustainability plan for the committee's review and approval.

---

## 2. Why a Separate Site?

The main fellowship site (rcffuta.com) serves a general, year-round audience. Redemption Week is a high-traffic, time-bound event with its own brand identity, specific content needs, and a commerce component. Keeping it separate:

- Avoids cluttering or destabilising the main site during a high-traffic period
- Allows a focused visual identity specific to the anniversary theme
- Makes it easy to archive or repurpose after the event
- Keeps the merch order system self-contained and manageable

---

## 3. Programme Schedule

The site will publish the full week's programme as follows:

| Day | Date | Event |
|---|---|---|
| Monday | [Date] | Opening Ceremony |
| Tuesday | [Date] | Word Night — Word Conference |
| Wednesday | [Date] | Power Night — Prayer Conference |
| Thursday | [Date] | Drama Night |
| Friday | [Date] | Choir Concert |
| Saturday | [Date] | Alumni Reunion |
| Sunday | [Date] | Handing Over Service |

> *Exact dates and any guest/speaker details to be supplied by the programme committee.*

---

## 4. Feature Scope

### 4.1 Must-Have Features

| Feature | Description |
|---|---|
| Event landing page | Hero section with theme, dates, and venue |
| Programme schedule | Night-by-night breakdown with time and details |
| Merch catalogue | Display of available items with photos, sizes, and prices |
| Pre-order form | Order form capturing name, contact, item selection, size, quantity |
| Payment handling | Squad payment gateway (with manual receipt fallback) |
| Order confirmation | Automated confirmation message/email after successful order |
| Admin order view | Protected page for the merch coordinator to view and manage orders |

### 4.2 Nice-to-Have Features

| Feature | Description | Condition |
|---|---|---|
| Countdown timer | Live countdown to opening night | Easy to implement |
| Guest/speaker profiles | Bio cards for featured ministers or guests | If details are available early enough |
| Photo gallery | Post-event gallery for each night | Post-event update |
| Social sharing | Share individual nights on WhatsApp/Instagram | If time permits |

---

## 5. Merch Pre-Order System

### 5.1 Order Flow

```
Member visits site
    → Browses merch catalogue
        → Selects item(s), size, quantity
            → Fills order form (name, phone, email)
                → Proceeds to payment
                    → Payment confirmed
                        → Order recorded in database
                            → Confirmation sent to member
                                → Merch coordinator sees order in admin dashboard
```

### 5.2 Payment Handling

**Primary: Squad (squadco.com)**  
Squad is a Nigerian-built payment gateway with solid developer support. It will handle card payments and bank transfers automatically, with transaction records stored on their dashboard.

**Fallback: Manual Bank Transfer + Receipt Upload**  
For members who cannot complete online payment, the site will offer an alternative:

- Fellowship account number displayed on checkout
- Member makes transfer and uploads a screenshot of their receipt
- The merch coordinator manually verifies and marks the order as confirmed in the admin dashboard

This hybrid approach covers the full range of our membership's payment capabilities.

### 5.3 Operational Requirements

For the merch system to function, the committee needs to designate:

- **A merch coordinator** — one person responsible for managing the admin dashboard, verifying manual receipts, and coordinating pickup
- **A payment account** — the fellowship's registered account for receiving transfers (also needed for Squad onboarding if applicable)
- **A pickup structure** — where and when members collect their orders during the event week

---

## 6. Technical Stack

The site is built on the fellowship's existing core infrastructure to ensure continuity and reduce maintenance overhead.

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js (TypeScript) | Fast, SEO-friendly, easy to deploy |
| Backend / Database | Supabase | Already in use for fellowship infrastructure; handles auth, database, and storage |
| Backend Logic | Custom TypeScript library | Existing internal library managing Supabase operations — reused here for consistency |
| Hosting | Vercel | Zero-config deployment, connects directly to the rw.rcffuta.com subdomain |
| Payments | Squad + manual fallback | Nigerian-native gateway with good API support |
| Domain | rw.rcffuta.com | Subdomain of existing fellowship domain — no new domain purchase required |

No new infrastructure is being introduced. This is a deliberate decision to keep the system maintainable by future ICT coordinators.

---

## 7. Asset Requirements

For the site to be completed on schedule, the following assets must be delivered to the ICT unit **by [CONTENT DEADLINE — suggest at least 2 weeks before launch].**

### 7.1 Visual Assets

| Asset | Specification | Notes |
|---|---|---|
| Event logo / emblem | PNG, transparent background, min 800×800px | If a specific RW logo is being designed |
| Hero / banner image | 1920×1080px (landscape) + 1080×1080px (square) | Used as the main visual on the landing page |
| Fellowship logo | PNG, transparent background, min 500×500px | Likely already available |
| Speaker / guest photos | Min 600×600px, face centred, clear background | One per featured person |
| Merch product photos | Min 1000×1000px, neutral/white background, front-facing | One clean photo per item variant |

> **Note to creative team:** Please do not send assets embedded in a Word document or as WhatsApp-compressed images. Share via Google Drive or send original files directly.

### 7.2 Brand Colors

If the Redemption Week theme has specific brand colors, please provide the **hex codes** (e.g. `#1A1A2E`). If unavailable, share the closest physical reference (printed material, banner, etc.) and the ICT unit will derive the codes.

If no color scheme exists yet, the ICT unit can propose one for committee approval — please advise.

### 7.3 Content

| Content Item | Who Provides It |
|---|---|
| Full programme schedule (times, venue) | Programme committee |
| Speaker / guest names and bios | Programme committee |
| Merch item list (name, description, price, sizes) | Merch committee |
| Payment account details | Treasurer / Finance |
| Fellowship's Squad account credentials (if applicable) | Treasurer / Finance |

---

## 8. Timeline

> *Adjust dates to match your actual event date.*

| Milestone | Target Date |
|---|---|
| Committee approval of this proposal | [Date] |
| Asset and content deadline (from all units) | [Event date minus 14 days] |
| Development complete, internal review | [Event date minus 7 days] |
| Site live at rw.rcffuta.com | [Event date minus 5 days] |
| Pre-order window opens | [Site launch date] |
| Pre-order cutoff (guaranteed event-week delivery) | [Wednesday of event week] |
| Post-event: gallery update | [1 week after event] |

---

## 9. Sustainability & Handover

This section is included because the current ICT coordinator will be graduating soon. The following decisions have been made specifically to ensure the infrastructure survives leadership transitions.

### 9.1 Design Principles for Longevity

- **No exotic dependencies** — the stack (Next.js, Supabase, Vercel) is industry-standard and well-documented. Any competent developer can pick it up.
- **CMS-ready structure** — content like the programme schedule and merch catalogue is stored in the database, not hardcoded. Future coordinators can update it without touching code.
- **Admin dashboard** — merch coordinators and future ICT leads can manage orders through a simple protected web interface. No database access required for day-to-day operations.

### 9.2 Handover Deliverables

At the end of this project, the outgoing ICT coordinator will produce:

- [ ] A **technical handover document** — stack overview, repo location, environment variables, and deployment process
- [ ] A **credentials document** — domain registrar access, Vercel account, Supabase project, Squad account (stored securely, not in code)
- [ ] An **operations guide** — how to update the programme, add/remove merch items, and manage orders via the admin dashboard
- [ ] A **one-on-one handover session** with the incoming ICT coordinator

> The goal is that the next coordinator inherits a system they can run, not just code they inherited.

---

## 10. What the Committee Needs to Do

For this project to succeed, the ICT unit needs the following from the committee:

- [ ] **Approve this proposal** so development can begin
- [ ] **Designate a merch coordinator** who will manage the admin dashboard and order fulfillment
- [ ] **Designate a content liaison** — one person the ICT unit can chase for content, rather than coordinating across multiple people
- [ ] **Deliver all assets by the content deadline** specified in Section 8
- [ ] **Confirm payment account details** for Squad onboarding and/or manual transfers
- [ ] **Approve the pre-order cutoff date** so it can be published on the site

---

## 11. Open Questions

The following items require committee input before development can be finalised:

1. Is there an existing Redemption Week visual identity (colors, theme name, logo), or should the ICT unit propose one?
2. Has the fellowship's account been registered or verified on Squad? If not, does the committee want to proceed with this, or use manual transfer only?
3. What is the complete list of merch items, prices, and available sizes?
4. Where and when will orders be available for pickup during the event week?
5. Who is the designated merch coordinator?

---

*This document was prepared by the ICT unit of RCF FUTA. Questions and feedback can be directed to [Your Name] via [contact].*

# 🎨 Image Brief — Redemption Week '26 Website
### From: ICT Web Team (Developer) → Design/Media Team

> **How to read this document:**
> Each section below corresponds to one visual area of the website.
> For each image, I've described **exactly where it lives on the page**, **what role it plays in the layout**, **what the image should feel like**, and the **technical specs** you must hit.
>
> Think of this as a storyboard from the developer's side.
> Your job is to bring the creative direction to life with real photos from our archive or from planned shoots.

---

## Overview of the Page Layout

The site is a single-page experience with these sections in order, top to bottom:

```
[ HEADER — sticky, always visible ]
[ HERO — full-screen, first impression ]
[ STATS — dark band, numbers only ]
[ MARQUEE — scrolling photo strip ]
[ SEVEN NIGHTS — programme with photo sidebar ]
[ ABOUT — two-column with photo collage ]
[ MERCH — product cards with product photos ]
[ GALLERY — full-screen photo wall ]
[ SPONSORS — no photos, text/cards only ]
[ CTA BANNER — dark cinematic call-to-action ]
[ FOOTER — dark, logos only ]
```

---

## 1. Logos *(Header + Footer + Hero)*

### How they appear:
Two logos sit side-by-side in the top-left corner of the header (which is always visible as users scroll). They also appear in the footer. When a user lands on the site, these logos are the first branded element they see — before the hero image fully loads.

### What I need:

| File | Where it goes | Description |
|------|--------------|-------------|
| `rcf-futa-logo.png` | Header (top-left), Footer | The main RCFFUTA fellowship crest. Already provided — confirm it's the latest version. Must work on both white and deep maroon (#1C0003) backgrounds. |
| `rw26-logo.png` | Header (beside RCF logo), Hero strip | The official **Redemption Week '26** event logo. This is the second logo in the pair. It will sit in a small rounded square (≈40px on mobile, 48px on desktop). Must have a transparent background so it adapts to both light and dark surfaces. |
| `lords-witnesses-logo.png` | Footer brand area (optional) | The tenure theme logo — *"The Lord's Witnesses: The Purified Army"*. Lower priority, but ideally present in the footer as a mark of the current tenure. |

> **Tip:** Export each logo at 400×400px minimum at 2x resolution. The site will size them down automatically.

---

## 2. Hero Section *(Full-screen, First Thing Users See)*

### How it appears:
This is a **full-screen, full-height background image** — it fills the entire first view of the website (100% viewport height). Over it, a white gradient sweeps in from the left side to create a clean reading area for the text. The right side of the image remains visible and atmospheric.

On desktop: the left half is washed white (text on top), the right half shows the raw image.
On mobile: a translucent white overlay softens the entire image, with text centered on top.

### What I need:

**File:** `hero-bg.jpg` (desktop) + `hero-bg-mobile.jpg` (mobile portrait crop)

**The shot:** A wide-angle, landscape photograph of a **packed worship auditorium** — ideally from a previous Redemption Week. Hundreds of students with their hands raised toward a lit stage. Stage lighting should be warm — orange, red, amber. There should be haze/fog machine effect if possible. It needs to feel electric and reverent at the same time.

The left side of the image can be slightly less busy (it will be covered by the white sweep), but the right side — showing the crowd depth and stage — should be the most powerful part.

**What it must NOT be:** A posed group photo. A daytime outdoor shot. A small group. Anything that feels generic.

| Variant | Dimensions | Notes |
|---------|-----------|-------|
| Desktop | 1920 × 1080px | Landscape. Main action in center-right. |
| Mobile | 768 × 1024px | Portrait crop. Main action centered vertically. |

---

## 3. Marquee Scrolling Strip *(Just Below the Hero)*

### How it appears:
A horizontal strip of photos that **scrolls automatically** (infinite loop, left to right). It sits just below the hero section and above the programme. Users can hover over each photo to pause it. The strip is **full-width** — edge to edge — with no container margin.

Each photo is displayed at a fixed height (208px) with a 320px width. They're slightly rounded. On hover, the image zooms in slightly and a label appears.

### What I need:
8 photos — one per night of Redemption Week. Each should be a **highlight moment** from that night (from previous editions).

| File | Night | What the photo should show |
|------|-------|---------------------------|
| `marquee-01-opening.jpg` | Opening Ceremony | Grand opening hall — cultural procession, students in attire, auditorium view |
| `marquee-02-word.jpg` | Word Night | A preacher/speaker at a podium, congregation attentive with Bibles open |
| `marquee-03-power.jpg` | Power Night | Students in intense prayer — hands raised, kneeling, or standing with closed eyes |
| `marquee-04-drama.jpg` | Drama Night | Actors on a lit stage — a powerful scene or emotional climax moment |
| `marquee-05-choir.jpg` | Choir Concert | The choir in formation on stage — mouths open, singing |
| `marquee-06-alumni.jpg` | RIFE & Alumni | Alumni and students together — handshakes, laughter, old friends reuniting |
| `marquee-07-handover.jpg` | Handing Over | The leadership handover moment — outgoing and incoming leaders, joyful |
| `marquee-08-community.jpg` | Any | A candid fellowship moment — students praying together, sharing, smiling |

**All files:** 320 × 208px minimum. Landscape orientation. Good contrast — they're small, so the main subject must be clear even at that size.

---

## 4. Seven Nights Section — Programme Sidebar *(Right Column, Desktop Only)*

### How it appears:
On desktop, the programme section has a **sticky sidebar on the right** — a tall portrait image that swaps as the user clicks through each night. On mobile, these become small horizontal scroll cards.

The image is displayed at roughly **440 × 587px** (3:4 portrait ratio). It has a dark gradient overlay at the bottom with the night name and hosting unit shown over it.

### What I need:
7 portrait-format photos — one per night. These are the **hero image for each night**, so they should be more cinematic and dramatic than the marquee thumbnails.

| File | Night | Description | Orientation |
|------|-------|-------------|-------------|
| `night-01-opening.jpg` | Opening Ceremony | Wide, dramatic shot of the full hall during opening — all lights, full crowd | Portrait 440×587 |
| `night-02-word.jpg` | Word Night | Close-up of a speaker in motion — hands gesturing, microphone, engaged crowd visible in BG | Portrait 440×587 |
| `night-03-power.jpg` | Power Night | One or a few students in deep prayer — atmospheric, moody lighting | Portrait 440×587 |
| `night-04-drama.jpg` | Drama Night | A theatrical moment — dramatic pose, costumes, stage lighting | Portrait 440×587 |
| `night-05-choir.jpg` | Choir Concert | The full choir on stage — wide shot showing formation and lighting | Portrait 440×587 |
| `night-06-alumni.jpg` | RIFE & Alumni | Two or three alumni with students — warm, candid, generational feel | Portrait 440×587 |
| `night-07-handover.jpg` | Handing Over | The handover moment — symbolic passing of the baton/mantle | Portrait 440×587 |

> **Important:** The bottom 30% of each image will be obscured by a dark gradient overlay with text. Keep the most important subject in the **top 65%** of the frame.

---

## 5. About Section — Fellowship Photo Collage *(Left Column)*

### How it appears:
The About section is a **two-column layout** — the left column has the heading, paragraph, and a collage of 5 photos arranged in an asymmetric grid. The right column has text (aims list).

The grid is:
- Row 1: Two photos side by side (photo 1 and 2)
- Row 2: One wide photo spanning both columns (photo 3)
- Row 3: Two photos side by side (photo 4 and 5)

The effect should feel like a **photo journal or mood board** — organic, warm, human.

### What I need:

| File | Position in collage | Dimensions | Description |
|------|--------------------|-----------|----|
| `about-01-community.jpg` | Top-left | 340 × 280px | Students laughing together — arms around each other, campus setting |
| `about-02-worship.jpg` | Top-right (offset lower) | 340 × 280px | Arms raised in worship, joyful faces |
| `about-03-campus.jpg` | Middle wide | 700 × 220px | Wide panoramic — a group on campus lawn or in front of the auditorium |
| `about-04-teaching.jpg` | Bottom-left | 340 × 240px | Someone reading/studying Bible, or a small group Bible study |
| `about-05-prayer.jpg` | Bottom-right | 340 × 240px | Bowed heads in prayer — intimate, sincere |

---

## 6. Gallery Section *(Full-Screen Photo Wall)*

### How it appears:
This is the most photo-intensive section. It stretches **completely edge-to-edge** — no margins, no container. The images tile in a **masonry/mosaic grid** with tiny gaps between them. Some images are large (spanning 2 columns and 2 rows), some are small squares, some are tall portraits.

The section has a **deep maroon (#1C0003) background**, so there's a branded colour even where images haven't been loaded yet.

### What I need:
14 photos from previous Redemption Week editions, in this exact grid order:

| Slot | Grid size | Dimensions | Description |
|------|-----------|-----------|-------------|
| `gallery-01.jpg` | 2×2 (large square — featured) | 800 × 800px | The most powerful, iconic RW image you have. Full crowd, worship moment, or stage wide-shot. This is the anchor of the gallery. |
| `gallery-02.jpg` | 2×1 (wide landscape) | 800 × 400px | A wide crowd or stage shot — different from slot 1 |
| `gallery-03.jpg` | 1×2 (tall portrait) | 400 × 800px | A person — speaker, performer, or worshipper — in a vertical portrait crop |
| `gallery-04.jpg` | 1×1 (small square) | 400 × 400px | A candid community moment |
| `gallery-05.jpg` | 1×1 (small square) | 400 × 400px | Choir, drama, or another unit highlight |
| `gallery-06.jpg` | 1×1 (small square) | 400 × 400px | Students in fellowship — eating, talking, smiling |
| `gallery-07.jpg` | 1×1 (small square) | 400 × 400px | A prayer or spiritual moment |
| `gallery-08.jpg` | 1×2 (tall portrait) | 400 × 800px | A different performer or leader — vertical crop |
| `gallery-09.jpg` | 2×2 (large square — second feature) | 800 × 800px | Second anchor image — should contrast with slot 1 (e.g., if slot 1 is indoor, make this outdoor) |
| `gallery-10.jpg` | 2×1 (wide landscape) | 800 × 400px | Campus life or outdoor event moment |
| `gallery-11.jpg` | 1×1 | 400 × 400px | Any joyful moment |
| `gallery-12.jpg` | 1×1 | 400 × 400px | Any sincere/spiritual moment |
| `gallery-13.jpg` | 1×1 | 400 × 400px | Any cultural/variety moment |
| `gallery-14.jpg` | 1×1 | 400 × 400px | Any conclusion/legacy moment |

> **Visual direction:** The gallery should feel like looking through a window into the full soul of Redemption Week — joy, worship, community, drama, prayer. Vary the tones and moments so it tells a complete story.

---

## 7. Merchandise Product Images *(Shop Page)*

### How they appear:
Each product has one primary image shown in a **card** with a 5:6 portrait aspect ratio. On hover, the image zooms in slightly. A category label appears in the bottom-right corner of the image.

### What I need:

| File | Product | Dimensions | Notes |
|------|---------|-----------|-------|
| `merch-tee-black.jpg` | Holy Spirit Tee (Black) | 480 × 576px | Flat lay OR model shot. Clean background preferred. |
| `merch-tee-white.jpg` | Holy Spirit Tee (White) | 480 × 576px | |
| `merch-tee-burgundy.jpg` | Holy Spirit Tee (Burgundy) | 480 × 576px | |
| `merch-hoodie-black.jpg` | RW'26 Hoodie (Black) | 480 × 576px | |
| `merch-hoodie-burgundy.jpg` | RW'26 Hoodie (Burgundy) | 480 × 576px | |
| `merch-hoodie-wine.jpg` | RW'26 Hoodie (Wine Red) | 480 × 576px | |
| `merch-cap.jpg` | Anniversary Cap | 480 × 480px | Square OK |
| `merch-stickers.jpg` | Sticker Pack | 480 × 480px | All 5 stickers laid flat |

---

## 8. CTA Banner Background *(Near Bottom of Page)*

### How it appears:
A **full-width, dark section** near the bottom of the page. The background is deep maroon (#1C0003) with the image overlaid at ~15% opacity — so it's more of a texture than a literal photo. The image just adds depth and atmosphere.

Large heading, two buttons, and a sponsor contact link sit on top.

**File:** `cta-bg.jpg`
**Dimensions:** 1920 × 640px landscape
**The shot:** A worship crowd from above or behind — silhouettes with stage lighting. Because it runs at low opacity, the image doesn't need to be sharp but should have strong tonal contrast (dark crowd, bright stage).

---

## Delivery Instructions

- Deliver files to the ICT team via **Google Drive** shared with the web team lead
- Use the **exact filenames** listed in each table above
- Organise into subfolders: `/logos/`, `/hero/`, `/nights/`, `/about/`, `/marquee/`, `/gallery/`, `/merch/`
- Format: **JPEG** for photos (quality 85%+), **PNG** for logos (transparent background)
- The public folder path maps as: `public/images/{subfolder}/{filename}`

---

*Prepared by the RCF FUTA ICT Web Team — Redemption Week '26*

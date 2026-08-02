# Rona OS — Visual Design Direction

**Version:** 1.0
**Date:** July 31, 2026
**Scope:** Visual language only. Product architecture, workflows, content hierarchy and functionality are unchanged.
**Implemented in:** `rona-os/src/styles/tokens.css` and the component layer. Live specimen at **Spheres → Design system**.

---

## 1. Mood & rationale

### 1.1 The brief in one line

An operating system that reads like a **world-class executive briefing**, prepared by someone who knows Rona well, and printed on good paper.

### 1.2 What the system is

Rona has spent decades at a world-leading creative agency. She has seen every dashboard, every SaaS onboarding, every well-meaning productivity tool. The interface cannot ask for her admiration — it has to earn her trust in the first four seconds and then get out of the way.

That pushes the design toward **editorial** rather than **application**. An editorial page assumes an intelligent reader, uses space as a structural device, and reserves emphasis for the few places it genuinely belongs. A dashboard assumes the opposite: that the reader must be guided, colour-coded, and reassured with progress rings.

Three decisions follow from that, and everything else is downstream:

**A single editorial moment per screen.** Home opens with a serif greeting, the date, and one sentence describing the shape of the day. Then the serif stops. Everything below is sans, quiet, and scannable. The serif is a signature, not a theme — the moment it appears twice on a screen it stops meaning anything.

**Gold means one thing.** Selection, ownership, curation, importance. The Top three carry a gold edge. The selected filter is gold. The primary action is gold. Focus rings are gold. Gold **never** means urgency and never appears as trim. This is what keeps it feeling like a signature rather than a brand colour applied liberally.

**Colour is rationed, and urgency gets almost all of it.** Only two of the five urgency steps carry hue. The rest step down in weight and tone. On a realistic day, 23% of dated items carry colour, and the two that shout are genuinely the two that should.

### 1.3 Femininity without cliché

Expressed structurally, never decoratively:

- **Proportion.** A 680px reading column on Home against a 900px working column. Generous section gaps of 64px. Type that is assured at 34px rather than shouting at 56px.
- **Restraint.** Almost no shadow. Hairline borders at 1px in a warm grey that recedes. Corner radii of 3–7px — precise, never soft or "cute".
- **Line quality.** A 2px gold rule that runs 34px and then hands off to a hairline. A 2px accent edge on a card, tucked 10px in from top and bottom rather than running the full height — a detail almost nobody will notice consciously, and everybody will feel.
- **Warmth in the neutrals.** Every grey is warm. The page is ivory, not white. The borders are stone, not silver. This is where the personality actually lives.
- **Language.** "Good morning, Rona." "Worth reconnecting with." "Requires you." Sentence case throughout. The system speaks like a chief of staff, not a ticketing tool.

No pink. No florals. No script faces. No gradients. No glassmorphism.

### 1.4 What was deliberately avoided

Coloured tile grids · stat tiles on Home · progress rings · thick borders · heavy shadows · pill-shaped cards · purple · uppercase section headers that shout · empty-state illustrations · anything that would read as a template.

---

## 2. Colour

### 2.1 Surface — warm, never blue-white

| Token | Value | Role |
|---|---|---|
| `--bg` | `#FAF8F3` | Page. Soft ivory |
| `--surface` | `#FFFFFF` | Elevated — cards, sheets |
| `--surface-2` | `#F4F1E8` | Warm stone — sunk, secondary, hover |
| `--surface-3` | `#EDE9DE` | Pressed |
| `--border` | `#E9E4D8` | Hairline, low visual weight |
| `--border-2` | `#D9D3C4` | Emphasis, hover |

### 2.2 Ink — warm neutrals

| Token | Value | Contrast on white | Role |
|---|---|---|---|
| `--ink` | `#22211F` | 15.9:1 | Charcoal — primary text |
| `--ink-2` | `#6B675F` | 5.9:1 | Warm slate — secondary |
| `--ink-3` | `#857F74` | 4.6:1 | Taupe — metadata (passes AA) |
| `--ink-4` | `#B4AEA1` | — | Hairlines and decorative marks **only** |

`--ink-4` never carries text. It exists for the faint ring on a "later" urgency dot and the tick before an attention item.

### 2.3 Gold — the signature

| Token | Value | Contrast | Role |
|---|---|---|---|
| `--gold` | `#C99A2E` | — | The mark: rules, edges, selected indicators |
| `--gold-bright` | `#F2C94C` | — | Undo link on dark, sparingly |
| `--gold-deep` | `#8A6418` | 5.4:1 | **The only gold used for text** |
| `--gold-surface` | `#FFF7DC` | — | Pale wash — selected filters, primary actions |
| `--gold-line` | `#E7CE86` | — | Border on gold surfaces |

**Rules.** Gold signals selection, ownership, importance, signature. It never signals urgency. It never appears purely decoratively. `--gold` at 2.6:1 is a *graphic* value — it is legitimate for a 2px rule or a dot, never for a word.

Where gold appears, and nowhere else: the Top three card edge · the selected rail item marker · the selected filter chip · primary action buttons · the focus ring · the greeting rule · the Quick Capture header rule · the "Why does this matter?" quote rule · the monogram underline · the mobile capture ring.

### 2.4 Urgency — separate, accessible, and mostly colourless

The most consequential decision in the system. Gold cannot mean urgency, and amber-adjacent hues would collide with it — so the urgency ramp abandons yellow entirely and, past the second step, abandons hue altogether.

| Step | Foreground | Surface | Dot treatment | Meaning |
|---|---|---|---|---|
| **Overdue** | `#9E2B20` (7.6:1) | `#FBEEEB` | 7px filled, 3px halo | Past due |
| **Today** | `#A9521C` (5.1:1) | `#FDF3EB` | 7px filled | Due today |
| **Soon** | `--ink` | — | 6px filled charcoal | Within 7 days |
| **Upcoming** | `--ink-2` | — | 6px hollow ring | Within 30 days |
| **Later** | `--ink-3` | — | 5px faint hollow ring | Beyond 30 days, or undated |

**Why only two coloured steps.** If five steps carried hue, a realistic executive day would render as a wall of colour and the scale would stop discriminating. Two coloured steps, plus a weight-and-fill ramp beneath, means red and rust keep their force. Measured on the live fixtures: **23% of dated items carry colour**, and only **11 of the 39 items Home renders**.

**Never colour alone.** Every step pairs a distinct dot geometry (filled/hollow, five sizes) with a written relative date — "11 days overdue", "in 3 days". The ramp survives greyscale and every form of colour blindness.

---

## 3. Typography

### 3.1 The pairing

```
--font-sans:  ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI",
              Inter, "Helvetica Neue", Arial, sans-serif
--font-serif: ui-serif, "New York", "Iowan Old Style", "Palatino Linotype",
              Palatino, "Book Antiqua", Georgia, serif
```

**No webfonts.** NFR-7 forbids runtime network requests, and a prototype that phones a CDN is not honestly front-end-only. The system serif stack resolves to New York on Apple platforms and Iowan Old Style / Palatino elsewhere — genuinely refined, and free. If a licensed display face is wanted later it self-hosts as woff2 without breaking the constraint.

### 3.2 Roles — strict

**Serif** appears in exactly five places: the morning greeting, page titles, the Quick Capture input, the "Why does this matter?" pull quote, and empty states. Nowhere else. It is a signature, not a texture.

**Sans** carries everything else: navigation, card titles, metadata, actions, badges, filters, forms.

### 3.3 Scale

| Token | px | Role |
|---|---|---|
| `--fs-serif-lg` | 34 | Morning greeting |
| `--fs-serif-md` | 24 | Page titles, capture input |
| `--fs-serif-sm` | 18 | Pull quotes, decision titles, empty states |
| `--fs-lead` | 17 | Inputs |
| `--fs-body` | 15 | Card title, body |
| `--fs-meta` | 13 | Context line |
| `--fs-action` | 12 | Actions, badges |
| `--fs-micro` | 11 | Eyebrows, counts |

Line heights: `1.28` tight (titles), `1.55` body, `1.65` reading.
Tracking: `-0.011em` on sans headlines, `-0.006em` on serif, `+0.11em` on uppercase eyebrows.

**Three levels inside a card, never four:** title (15) → context (13) → action (12).

**Headlines are assured, not oversized.** The greeting is 34px. Hierarchy comes from weight, space and family contrast rather than scale — which is what separates editorial confidence from startup enthusiasm.

---

## 4. Space, form, motion

### 4.1 Rhythm

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 88`

Section gap is **64px**. Sections separate by *space first, rule second* — the hairline under a section header exists to anchor the label, not to fence the content.

Reading columns: **680px** on Home (low density, for scanning) · **900px** on working views (denser, for working).

### 4.2 Radius

`3 · 5 · 7 · 12` — plus a pill radius reserved for chips, filters and the toast. Cards use 7px, dense rows 5px, sheets 12px. Nothing is over-rounded.

### 4.3 Shadow

| Token | Value | Use |
|---|---|---|
| `--shadow-rest` | `none` | Every card at rest |
| `--shadow-hover` | `0 1px 2px rgba(34,33,31,.05)` | Card hover |
| `--shadow-float` | `0 18px 52px -14px …, 0 2px 6px …` | Sheets and toast only |

Elevation is communicated by **border weight**, not by shadow. Two elevations exist in the whole product: the page, and the two things that float above it.

### 4.4 Motion

`--t-fast: 90ms` · `--t: 140ms`, both `cubic-bezier(.2,0,.2,1)`. Nothing exceeds 150ms. The capture sheet fades and rises 6px. `prefers-reduced-motion` disables all of it.

---

## 5. Navigation

### 5.1 Desktop — a slim editorial rail

216px. A serif monogram **R** with a 22px gold underline, the wordmark in 11px uppercase, then the destinations at 13px. The selected item takes a 2px gold marker at its left edge and a warm stone ground.

A hairline divider separates the six daily destinations from Spheres. Capture sits at the bottom as a charcoal button with a `⌘K` hint in 10px at 50% opacity.

### 5.2 Mobile — an executive companion

Five items: **Home · Today · [Capture] · Commitments · More**. Capture is a 46px charcoal circle with a 1px gold ring, centred and thumb-reachable. Everything else lives in a More sheet that rises from the bottom.

The bar is 96%-opaque white with a 12px backdrop blur and respects `env(safe-area-inset-bottom)`. Touch targets are 44px minimum. Detail views are full-screen pushes, and the capture sheet becomes a bottom sheet.

This is a different composition from the desktop layout, not a compressed one.

---

## 6. Home

Priority order is unchanged. The visual treatment now reinforces it.

1. **The greeting.** Date in 11px uppercase → serif 34px "Good morning, Rona." → one sentence of orientation assembled from real counts ("1 overdue commitment, 3 meetings today, and 3 decisions waiting on you") → a gold rule.
2. **Overdue.** A tinted card group with an oxblood accent edge and an oxblood section rule. Restraint, not a filled alarm block — understatement reads as more serious.
3. **Top three.** Gold-edged cards. Curation made visible.
4. **Requires you.** Decide / Review / Connect / Do as four columns of plain sentences under hairline-ruled eyebrows. No tiles, no counts, no colour. Each item takes a 4px tick that extends and turns gold on hover.
5. **Everything else** in priority order, each section hiding itself when empty.
6. **Inbox** as a quiet count above a hairline, last on the page.

Section titles are editorial sentence case — "Today's schedule", "You owe", "Waiting on others", "Worth reconnecting with", "Coming due". Counts are 11px and secondary, appearing only when items are hidden by the cap.

---

## 7. Components

### 7.1 Card

White surface, 1px warm hairline, 7px radius, no shadow at rest. Hover raises the border to `--border-2` and adds a 1px shadow.

A 2px accent edge appears **only** when earned — gold for curation, urgency colour for overdue — and is inset 10px from top and bottom rather than running the full height.

Inline actions sit at 50% opacity and come to full on row hover or focus-within, on pointer devices only. Titles clamp to two lines and never break mid-word.

### 7.2 Commitment direction

The strongest non-urgency signal in the product.

| | Treatment | Reads as |
|---|---|---|
| **I owe** | Filled charcoal, ↑ arrow, "I owe" | Outward responsibility |
| **Waiting on** | Outlined charcoal, ↓ arrow, "Waiting on" | Incoming dependency |

Fill, arrow direction and wording all differ. Recognisable in greyscale and from across a room — which is the actual acceptance test.

The primary action differs to match: "I owe" offers **Done**; "Waiting on" offers **Follow up**, because Rona's move there is to *ask*, not to *do*.

### 7.3 Status

Shape carries the meaning: **filled** (in motion) · **outlined dashed** (blocked on someone external) · **muted** (parked) · **struck** (closed).

### 7.4 Filters, buttons, forms

Filter chips are pill-shaped and transparent until selected, when they take the gold surface, gold line and deep-gold text. Buttons are 12px medium in a 5px radius with a 30px minimum height; primary uses gold. Capture hints are pills that fill gold when active and carry `aria-pressed`.

### 7.5 States

| State | Treatment |
|---|---|
| Hover | Border to `--border-2`, 1px shadow, actions to full opacity |
| Focus | 2px `--gold-deep` outline, 2px offset, never removed |
| Selected | Gold surface + gold line + deep-gold text, or a gold edge marker |
| Disabled | 45% opacity, default cursor |
| Completed | 55% opacity, struck title |

---

## 8. Signature moments

Five, and no more — the point of a signature is that it is rare.

1. **The morning greeting** — serif, dated, with a one-sentence brief drawn from real counts.
2. **The gold rule** — 34px of gold handing off to a hairline. Under the greeting and at the head of the capture sheet.
3. **The monogram** — a serif **R** with a gold underline in the rail.
4. **Quick Capture** — a 12px-radius sheet opening with a 2px gold rule, an "Capture" eyebrow, and a 24px serif input reading "What's on your mind?" The footer states the contract plainly: *Goes to Inbox. Nothing else required.*
5. **"Why does this matter?"** — the venture and nonprofit field set as a serif pull quote against a gold rule. The one place the system asks Rona a question rather than telling her something.

---

## 9. Accessibility

- Every text value meets **WCAG 2.1 AA**. Contrast ratios are recorded beside each token in §2 and on the live Design system page.
- **Never colour alone.** Urgency pairs hue with dot geometry and a written relative date. Status pairs colour with badge shape. Direction pairs fill with an arrow and a word.
- Focus is visible everywhere, in deep gold at 2px with 2px offset. Never removed.
- Cards opened by click are keyboard-reachable and respond to Enter.
- 44px minimum touch targets on mobile; 30px minimum on desktop.
- Titles clamp to two lines without breaking words.
- Relative dates throughout — "11 days overdue" changes behaviour in a way "20 July" does not.
- `prefers-reduced-motion` disables all transitions.
- Semantic landmarks: `nav[aria-label]`, `main`, `section`, `dl` for field pairs, `aria-current` on the active destination, `role="status"` on undo.

---

## 10. Token specification

Portable. Copy `rona-os/src/styles/tokens.css` verbatim into any implementation.

```css
:root {
  /* Surface — warm, never blue-white */
  --bg: #FAF8F3;  --surface: #FFFFFF;  --surface-2: #F4F1E8;  --surface-3: #EDE9DE;
  --border: #E9E4D8;  --border-2: #D9D3C4;

  /* Ink — all body values AA */
  --ink: #22211F;  --ink-2: #6B675F;  --ink-3: #857F74;  --ink-4: #B4AEA1;

  /* Gold — selection, ownership, signature. NEVER urgency. */
  --gold: #C99A2E;  --gold-bright: #F2C94C;  --gold-deep: #8A6418;
  --gold-surface: #FFF7DC;  --gold-line: #E7CE86;

  /* Urgency — separate ramp; only the top two carry hue */
  --u-overdue-fg: #9E2B20;  --u-overdue-bg: #FBEEEB;  --u-overdue-line: #E9CBC4;
  --u-today-fg:   #A9521C;  --u-today-bg:   #FDF3EB;  --u-today-line:   #EFD9C4;
  --u-soon-fg:     var(--ink);
  --u-upcoming-fg: var(--ink-2);
  --u-later-fg:    var(--ink-3);

  /* Type */
  --font-sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI",
               Inter, "Helvetica Neue", Arial, sans-serif;
  --font-serif: ui-serif, "New York", "Iowan Old Style", "Palatino Linotype",
                Palatino, "Book Antiqua", Georgia, serif;
  --fs-micro: .6875rem; --fs-action: .75rem;  --fs-meta: .8125rem;
  --fs-body: .9375rem;  --fs-lead: 1.0625rem;
  --fs-serif-sm: 1.125rem; --fs-serif-md: 1.5rem; --fs-serif-lg: 2.125rem;
  --lh-tight: 1.28; --lh-body: 1.55; --lh-read: 1.65;
  --ls-eyebrow: .11em; --ls-tight: -.011em; --ls-serif: -.006em;

  /* Space */
  --s1: 4px; --s2: 8px;  --s3: 12px; --s4: 16px; --s5: 24px;
  --s6: 32px; --s7: 48px; --s8: 64px; --s9: 88px;
  --gap-section: var(--s8);

  /* Form */
  --r-xs: 3px; --r-sm: 5px; --r: 7px; --r-lg: 12px; --r-pill: 999px;
  --shadow-rest: none;
  --shadow-hover: 0 1px 2px rgba(34,33,31,.05);
  --shadow-float: 0 18px 52px -14px rgba(34,33,31,.24), 0 2px 6px rgba(34,33,31,.06);

  /* Motion — 150ms ceiling */
  --t-fast: 90ms cubic-bezier(.2,0,.2,1);
  --t: 140ms cubic-bezier(.2,0,.2,1);

  /* Layout */
  --rail-w: 216px; --col-home: 680px; --col-work: 900px;
}
```

---

## 11. The test

Every choice above answers to one question:

> Does this help Rona know, in under sixty seconds, what deserves her attention?

Colour was rationed because a coloured screen cannot prioritise. Serif was restricted to one moment per screen because a signature repeated is a pattern. Shadow was removed because elevation without meaning is noise. Space was made generous because a crowded screen forces reading where it should permit scanning.

The result should feel like it was made for one person — because it was.

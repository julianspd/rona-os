# Rona OS — Executive Operating System (front-end prototype)

A **front-end-only** prototype built to the spec in [`docs/RM_OS_PRD.md`](docs/RM_OS_PRD.md),
with the visual language defined in [`docs/RONA_OS_DESIGN_SYSTEM.md`](docs/RONA_OS_DESIGN_SYSTEM.md).
The original brief the PRD derives from is [`docs/RM_OS.md`](docs/RM_OS.md).

There is no database, no authentication, no backend, and no network traffic at
runtime. Everything renders from hand-authored fixtures held in memory, and all
changes reset on reload. That is deliberate — see PRD §0.

```bash
npm install
npm run dev                     # http://localhost:5173
npm run build
npx tsx scripts/check-home.ts   # verifies the fixtures against the PRD
```

## What is built

**Slice 0 — foundations**
`src/styles/tokens.css` — the five-step urgency scale (PRD D.1), status tokens,
type scale. Settled first because it is the load-bearing visual decision.

**Slice 1 — fixtures**
`src/fixtures/` — 42 contacts, 22 commitments, 32 tasks, 13 opportunities,
11 entities, 27 reminders, 9 projects, 7 goals, 17 inbox items. Deliberately
includes the uncomfortable states from PRD E.3: an overdue commitment, a stalled
opportunity, a dormant inner-circle contact, a thrice-postponed errand, a project
at risk, a goal with no project attached.

**Slice 2 — Home + Quick Capture + navigation shell**

**Slices 3–4** — Commitments, People, Tasks, Today, Inbox, Search, Detail.

**Slice 5 — the Entity engine.** `SphereGrid` + one `EntityList` + one
`EntityDetail`, driven by `src/lib/entityConfig.ts`. Ventures, consulting,
nonprofits, properties, vehicles and trips are all the same two screens with a
different config entry. Adding a sphere costs an entry, not a screen.

**Slice 6** — Opportunities (grouped by stage, list-first), Projects, Goals,
Renewals (the 90-day ladder), Documents, Decision log.

Remaining: Calendar, Money, Digital Presence, Reviews, Evidence Bank, mock AI.

## The two components that carry the design

`src/components/SectionBlock.tsx` — owns the item cap, hide-when-empty, and the
"show all" affordance for every section on Home. Enforced once so it cannot drift.

`src/lib/home.ts` — implements PRD H.1: an item appears in **exactly one** Home
section. Sections are evaluated in §9.1 order; an item lands in the first section
it qualifies for and cascades if that section is full.

## Verification

`scripts/check-home.ts` runs the Home composition against the real fixtures and
asserts the PRD's own criteria: H.1 de-duplication, FX-8 (every section
exercised), MD-4 volumes, FX-7 urgency distribution. It found three real defects
during the build — written up as PRD H.8.

## Honesty constraints

- `stalled`, `at-risk`, `dormant`, `postponed` are **hand-authored in the
  fixtures, not computed**. The banner says so.
- AI surfaces, when built, will render pre-written text. No model calls.
- No dead buttons: anything needing a backend is absent, not disabled-looking.
- Zero network requests at runtime — check the network tab.

## Content rules

All content is invented. No real people, organisations or addresses. Properties
and vehicles use aliases ("Lakeside Unit", "The Sedan"). There are no fields
anywhere for policy numbers, account numbers, identifiers, medical detail or
credentials — per PRD §13, the rule is *don't build the field*.

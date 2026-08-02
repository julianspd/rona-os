# Product Requirements Document — Rona OS
### Executive Operating System — **Front-End Prototype**

**Version:** 2.0 — front-end only
**Date:** July 31, 2026
**Status:** Draft for approval
**Source document:** `RM_OS.md`
**Executive / primary user:** **Rona**

---

## 0. Scope of this document — read first

This PRD specifies a **front-end build only**, running entirely on mock data.

### 0.1 Explicitly NOT in this build

| Not building | Why it is absent |
|---|---|
| Database or data schema | No persistence layer exists. Data is a set of hand-authored mock fixtures loaded into memory |
| Authentication / login / accounts | Single simulated user (Rona). The app opens directly to Home |
| Backend, API, or server | No network calls of any kind. The app runs fully client-side |
| Migrations, ORM, seeding scripts | Not applicable |
| Sync, offline queue, conflict resolution | Not applicable |
| Encryption, backup, export pipelines | Not applicable |
| Integrations (calendar, email, storage) | Not applicable |
| Real AI calls | AI surfaces are rendered from pre-written mock output |
| Analytics or telemetry | Not applicable |

### 0.2 What this build IS

A **complete, navigable, high-fidelity front end** for Rona's Executive Operating System:

- Every screen in the navigation renders with realistic mock content
- Every list, filter, and view specified below is visible and browsable
- Interactions (complete, snooze, capture, filter, navigate, edit) work **against in-memory state** and reset on reload
- It is convincing enough to evaluate the *product* — the information architecture, the attention model, the daily rhythm — before anyone commits to building a real system

**The deliverable is a decision-making instrument, not a working product.** Its job is to answer: *does this dashboard actually tell Rona what deserves attention?*

### 0.3 A note on "data"

The build needs data *shapes* to render — a commitment card needs to know it has a person and a direction. Those shapes are defined in §7 as **mock fixture shapes**: plain in-memory objects, hand-authored, living in the front-end codebase. They are a rendering contract, not a database design. No table definitions, no keys, no constraints, no persistence.

---

## 1. Problem statement

Rona operates across at least eight spheres simultaneously: an executive professional role, owned ventures, consulting and advisory engagements, nonprofit and board service, real estate, personal and household administration, health, and a public professional brand. Each sphere generates commitments, deadlines, and relationships.

The failure mode is not a lack of information. It is that information lives in incompatible places — calendar, inbox, notes app, memory, other people's memory — so that:

- **Commitments leak.** A promise Rona makes verbally in one sphere has no home and is silently dropped.
- **Opportunities stall invisibly.** A warm introduction goes cold not from a decision but from the absence of a next action.
- **Relationships decay by default.** Important people go uncontacted because nothing surfaces them.
- **Administrative deadlines ambush.** Registration, insurance, and renewal dates arrive as emergencies.
- **Attention is allocated by whatever is loudest**, not by what matters.

Existing tools fail for a structural reason: they model *tasks*, and a task is the wrong primitive for most of this. A promise made to another person, a stalled opportunity, a decision awaiting input, and a delegated assignment all behave differently from a to-do and need to look and act differently on screen.

**What this prototype tests:** whether a single attention-first interface, spanning all of Rona's spheres, is legible and useful in under sixty seconds a day.

## 2. Vision for the prototype

> One screen that tells Rona *"here is what deserves your attention right now, and here is what will bite you if you ignore it"* — across every sphere of her life.

The prototype succeeds if, after browsing it, Rona can point at the Home screen and say *"yes — that's the list I need every morning"* or *"no — it's showing me the wrong things."* Either answer is a win. Ambiguity is the failure case.

## 3. Goals & non-goals

### 3.1 Goals of the front-end build

| # | Goal | How the prototype demonstrates it |
|---|---|---|
| G1 | Prove the Home screen directs attention correctly | Home renders a realistic, populated day in Rona's life |
| G2 | Prove capture is effortless | Quick Capture is reachable in one tap from every screen and requires only text |
| G3 | Prove cross-sphere surfacing reads clearly | A nonprofit gala, a vehicle renewal, and a consulting proposal coexist on Home without confusion |
| G4 | Prove Commitments are a distinct, legible object | I Owe / Waiting On views are visually and behaviorally different from task lists |
| G5 | Prove the system stays calm at realistic volume | Mock data is dense enough to stress the layout, not a tidy demo of five items |
| G6 | Establish the visual and interaction language | Typography, spacing, color, urgency signals, and card patterns are settled here |

### 3.2 Non-goals

**[Scope call]** Out of scope, and to be resisted in review:

- **No persistence.** State resets on reload. This is intentional and should be stated in the demo.
- **No real intelligence.** "Stalled," "at risk," and "dormant" flags are pre-set in the mock fixtures, not computed. AI text is written by hand.
- **No editing depth.** Forms render and accept input; they do not validate beyond what's needed to look real.
- **No settings, preferences, or admin surfaces.** One hard-coded configuration.
- **No responsive edge cases beyond phone + desktop.** Two breakpoints, both good.
- **No accessibility exceptions**, however — see §12. Accessibility is in scope.
- **Not a medical, accounting, project-management, or document-storage product**, even visually. Those framings are wrong for this system.

## 4. The user — Rona

Rona is a senior executive who is simultaneously an owner, an advisor, and a community figure. The characteristics that drive design:

- **Time-poor, decision-rich.** She will not do maintenance work on the system. She will not tag, file, or groom.
- **Mobile for capture, desktop for review.** Thoughts arrive while walking, driving, between meetings.
- **High trust threshold.** One commitment the system should have caught and didn't destroys confidence permanently.
- **Cross-context.** A single conversation may generate a nonprofit commitment, a business opportunity, and a personal reminder.

**Design implication for the prototype:** every screen must be legible in a glance. If a reviewer has to study a screen to understand it, that screen has failed, regardless of how much information it holds.

Rona is the only user. There is no login, no user switching, no second persona. Her name and photo appear only where an interface would naturally show them.

## 5. Core insight & design principles

### 5.1 The organizing insight

**Most of the source brief's 20 "modules" are not modules. They are filtered views over a small set of card types.**

A "Vehicles module" is: reminders + expenses + documents + tasks, filtered to a vehicle. A "Nonprofit module" is: contacts + commitments + events + tasks, filtered to an organization. Building 20 independent screens produces 20 places for the same pattern to diverge visually — and 20 things to maintain in mock data.

**Therefore:** build a small library of **card and list components**, plus a **Life Area** filter dimension, and compose every module from them. One `EntityDetail` screen configured per type covers ventures, nonprofits, properties, vehicles, and trips.

This is the single most consequential decision in this document. It is what makes 20 modules buildable as a front end.

### 5.2 Principles

| P1 | **Capture before classify.** Any input is valid. Organizing is optional. |
|---|---|
| P2 | **Every open item shows a next action or an explicit park.** No item may look like it is in limbo. |
| P3 | **Surfacing beats storing.** If a field cannot change what Rona does today, question whether to render it. |
| P4 | **One fact, one place.** Cross-linking, never duplicating — including in the mock data. |
| P5 | **Calm over comprehensive.** Home shows few items. Depth is one click away, never on the surface. |
| P6 | **Degrade gracefully.** Empty sections are invisible, not empty-state noise. |
| P7 | **Honest mock AI.** Anything AI-generated is visibly labeled and shows its stated reason. |

---

## 6. Build phases

### 6.1 Phase 1 — The Trust Core (build first)

The smallest set of screens that can prove the concept:

- **Quick Capture** (global)
- **Home / Daily Brief**
- **Today**
- **Inbox**
- **Commitments** — I Owe / Waiting On
- **Tasks** — including the Mine / Delegated / Waiting filter
- **Delegation** views (FR-DEL-1 – 4 are P0; they live inside Tasks, not a separate screen)
- **Contacts / CRM** (list + detail)
- **Search**
- **Life Area filter** (cross-cutting)
- **Reminder cards** — rendering only, on Home. The dedicated `Renewals` screen is Phase 2 (see H.2)

**Rationale:** If Home doesn't work, no amount of additional modules fixes it. Phase 1 is reviewable on its own.

### 6.2 Phase 2 — Sphere coverage

Every remaining module, composed from the Phase 1 component library:

- Projects · Opportunities pipeline · Ventures & Consulting · Nonprofit & Community · Properties · Vehicles · Personal Life Admin · Health & Fitness · Travel · Goals · Documents & Links · Digital Presence · Calendar (read-only view) · Money (read-only summaries)

### 6.3 Phase 3 — Depth & intelligence surfaces

- Decision Log · Evidence Bank · Career Equity · Content Calendar · Relationship intelligence views · Gifts & Important Dates · Weekly / Monthly / Quarterly Review flows · Mock AI Daily Brief · Mock meeting-prep briefs

### 6.4 Not in any phase of this build

Integrations, sync, real AI, persistence, accounts. Those belong to a future engineering effort this prototype is meant to inform.

---

## 7. Mock data model (rendering contract)

Plain in-memory objects, hand-authored as fixtures in the front-end codebase. **No database, no schema, no persistence.**

### 7.1 Card types the UI must render

**Tier 1 — Phase 1**

| Card type | What it represents | Why it isn't a task card |
|---|---|---|
| **InboxItem** | Unclassified capture | Pre-classification; may become anything |
| **Task** | Something Rona does | — |
| **Commitment** | A promise between Rona and another person | Has a *counterparty* and a *direction*; survives even when no action is defined |
| **Delegation** | Work assigned to someone else | Has *definition of done* and a *check-in date*; Rona is accountable but not the doer |
| **Contact** | A person | — |
| **Reminder** | A time-triggered surface | Recurs; may carry no action, only awareness |
| **Note** | Free text attached to anything | — |

**Tier 2 — Phase 2**

| Card type | Notes |
|---|---|
| **Project** | Work with an objective and an end |
| **Opportunity** | Pipeline card with a stage and a next move |
| **Entity** | **[Scope call]** One shape covering venture, consulting engagement, nonprofit, property, vehicle, and trip, distinguished by `entityType` |
| **Goal** | Outcome with a horizon and a measure |
| **Document** | Title + link + metadata |
| **Event** | Calendar item |
| **Interaction** | A logged touchpoint with a contact |

**Tier 3 — Phase 3**
Decision · Evidence · ContentPiece · Expense · ImportantDate · PlatformProfile

### 7.2 The Entity consolidation **[Scope call]**

The source brief specifies ventures, properties, vehicles, trips, and nonprofits as separate modules. On screen they are the same layout: a header, a status, a next action, and tabbed panels of related contacts, tasks, reminders, and documents. Their differences are a handful of type-specific rows — a vehicle shows mileage, a property shows an HOA, a trip shows dates.

**Decision:** one `Entity` shape with `entityType`, plus a `typeFields` object for type-specific rows, plus a per-type field configuration that drives the detail layout.

**Benefit:** one detail screen to build, style, and maintain; a new sphere costs a config entry, not a new screen.
**Cost:** the detail component is more configurable than a bespoke one would be. Accepted.

### 7.3 Attributes every card carries

```
id                — string
title             — the only field Quick Capture requires
lifeAreas         — array; see 7.4
status            — see §11
importance        — Critical | High | Normal | Low
attentionType     — Decide | Review | Connect | Do | Delegate | Wait
timeHorizon       — Today | This Week | This Month | Later
dueDate           — optional
nextAction        — optional text
nextActionDate    — optional
owner             — Me | Delegated | Waiting on other
relatedIds        — array of ids, for cross-links
tags              — array
lastTouched       — date; drives the "stale" visual treatment
flags             — pre-set in mock data: stalled | at-risk | dormant | postponed
                    | delegatable | not-staffed | revisit-due
```

**`flags` is pre-authored, not computed.** In a real system these states would be derived. In the prototype they are set by hand in the fixtures so the UI can demonstrate them. This must be stated plainly when the prototype is presented — it is the single most likely source of a reviewer misunderstanding what they're looking at.

### 7.4 Life Areas (the cross-cutting filter)

`Work · Ventures · Consulting · Nonprofit · Relationships · Property · Personal · Vehicles · Health · Travel · Money · Brand · Learning · Career`

Multi-valued — a nonprofit gala can be Nonprofit, Relationships, and Brand at once. This single filter mechanism powers module scoping, Home grouping, and the travel "what can I combine" view.

### 7.5 Cross-links

Cards reference each other by `relatedIds`. The UI resolves them at render time from the fixture set and displays them as chips linking to the related card's detail screen. One mechanism covers every cross-linking example in the source brief.

### 7.6 Mock data volume & quality requirements

The fixtures are a deliverable in their own right. Thin mock data produces a prototype that looks good and proves nothing.

| ID | Requirement |
|---|---|
| MD-1 | **All content is fictional.** Invented people, organizations, ventures, and places. No real client names, employers, addresses, or identifiers |
| MD-2 | Properties and vehicles use aliases only — "Lakeside Unit," "The Sedan." Never addresses, VINs, plates, or policy numbers |
| MD-3 | No content resembling medical records, diagnoses, prescriptions, financial account numbers, or credentials — including as fake-but-plausible strings |
| MD-4 | Volume targets: ≥40 contacts, ≥30 tasks, ≥20 commitments (both directions), ≥12 opportunities across all stages, ≥10 entities spanning every type, ≥25 reminders, ≥8 projects, ≥6 goals, ≥15 inbox items |
| MD-5 | Data is **dated relative to a fixed "today"** so the prototype always shows a live-looking mix of overdue, due today, and upcoming |
| MD-6 | Deliberately includes uncomfortable states: overdue commitments, a stalled opportunity, a dormant inner-circle contact, a thrice-postponed errand, a project at risk |
| MD-7 | Names and details are coherent across modules — the same person appears in Contacts, on a commitment, and in an opportunity, consistently |
| MD-8 | Text lengths vary realistically, including a few long titles that stress-test truncation |

MD-6 matters most. A prototype full of tidy, on-track items cannot demonstrate the product's actual purpose.

---

## 8. Functional requirements

IDs: `FR-<module>-<n>`. Priority: **P0** = Phase 1, **P1** = Phase 2, **P2** = Phase 3.

### 8.1 Quick Capture

| ID | Requirement | Pri |
|---|---|---|
| FR-CAP-1 | A global "Add Something" control is reachable in ≤1 tap from every screen, desktop and mobile | P0 |
| FR-CAP-2 | Capture requires **only** a text string. No type, date, or category may be mandatory | P0 |
| FR-CAP-3 | Captured items appear immediately at the top of Inbox with status `Inbox` | P0 |
| FR-CAP-4 | Optional one-tap type hints (Task / Person / Commitment / Idea / Renewal) pre-fill but never block | P0 |
| FR-CAP-5 | Inbox processing converts an item to any card type via a simple picker, preserving its text | P0 |
| FR-CAP-6 | Inbox count is visible on Home but styled as neutral, never as an alarm | P0 |
| FR-CAP-7 | Mock AI classification: a suggested destination, type, date, and person appear as an editable proposal with a visible one-line reason and a one-tap accept | P2 |

**Acceptance:** From any screen, a reviewer can enter a rough thought and see it in Inbox in under 10 seconds, having typed nothing but the thought.

### 8.2 Home / Executive Daily Brief

The single most important screen in the build.

| ID | Requirement | Pri |
|---|---|---|
| FR-HOME-1 | Home renders the sections in §9.1, in order, with the stated caps | P0 |
| FR-HOME-2 | Each section shows **at most its §9.1 cap** (never more than 5), with a "show all" link whenever items are hidden | P0 |
| FR-HOME-2b | **An item appears in exactly one Home section**, per the precedence rule in H.1 | P0 |
| FR-HOME-3 | Sections with zero items are **hidden entirely** — no empty states | P0 |
| FR-HOME-4 | Every Home item supports inline action — complete, snooze, reschedule, open — without leaving Home | P0 |
| FR-HOME-5 | Executive Attention groups items into Decide / Review / Connect / Do | P0 |
| FR-HOME-6 | Top 3 Priorities are settable and persist for the session | P0 |
| FR-HOME-7 | Overdue commitments render above everything else, regardless of section order | P0 |
| FR-HOME-8 | Home is fully legible on a phone with priority content above the fold | P0 |
| FR-HOME-9 | Life Area filter chips scope the entire Home screen | P1 |
| FR-HOME-10 | Mock AI narrative summary at the top, visibly labeled as AI, each claim pointing to a real card in the fixtures | P2 |

**Acceptance:** A reviewer who reads only Home can correctly state what Rona's three most urgent obligations are, what she is waiting on, and what is coming due — within 60 seconds, without clicking.

### 8.3 Commitments

The highest-value differentiated screen. Nothing else in the system delivers G4.

| ID | Requirement | Pri |
|---|---|---|
| FR-COM-1 | Commitment cards show `direction` — I Owe / They Owe — as their dominant visual signal | P0 |
| FR-COM-2 | Every commitment shows its counterparty by name and, where relevant, organization | P0 |
| FR-COM-3 | Card shows: commitment, direction, person, related item, created date, due date, follow-up date, status, importance | P0 |
| FR-COM-4 | Views: I Owe · Waiting On · Overdue · Due This Week · High Importance · By Person | P0 |
| FR-COM-5 | Commitments with no due date render a distinct "no date set" treatment plus a follow-up prompt | P0 |
| FR-COM-6 | "They Owe" cards offer *Follow up* as the primary action, not *Complete* — Rona's move is to **ask**, not to **do** | P0 |
| FR-COM-7 | Creating a commitment requires exactly two inputs: the promise and the person | P0 |
| FR-COM-8 | Contact detail shows a per-person rollup of open commitments in both directions | P1 |

**Acceptance:** A reviewer can distinguish "something I promised Marisol" from "something Marisol promised me" from across the room, without reading the text.

### 8.4 Delegation

| ID | Requirement | Pri |
|---|---|---|
| FR-DEL-1 | Card shows: assignment, delegated to, date assigned, due date, priority, **definition of done**, check-in date, status | P0 |
| FR-DEL-2 | Views: Delegated by me · Check-in needed · Overdue · Completed · By person | P0 |
| FR-DEL-3 | Check-in date is displayed distinctly from due date — they drive different behavior | P0 |
| FR-DEL-4 | Task lists filter to Mine / Delegated / Waiting as three visible states | P0 |
| FR-DEL-5 | "What could someone else do?" view lists tasks flagged `delegatable` in the fixtures | P1 |

### 8.5 Opportunities / Growth pipeline

| ID | Requirement | Pri |
|---|---|---|
| FR-OPP-1 | Stages rendered: Identified → Intro Requested → Connected → Discovery → Qualified → Proposal/Scope → Negotiation → Decision Pending → Won / Lost / Paused / Nurture | P1 |
| FR-OPP-2 | **"What must happen next to move this forward?"** is displayed prominently on every active opportunity card, and its absence is visually flagged | P1 |
| FR-OPP-3 | Types shown: new business, client expansion, partnership, consulting, advisory, career, recruiter, board, speaking, jury, investment, sponsorship, introduction, collaboration | P1 |
| FR-OPP-4 | Opportunities flagged `stalled` in the fixtures render with a distinct treatment and appear in the Stalled view | P1 |
| FR-OPP-5 | Views: Active pipeline · Stalled · Follow-up due · High potential · Warm introductions · Won/Lost · Nurture | P1 |
| FR-OPP-6 | Cards display strategic value, potential value, probability, relationship strength, source, and decision maker | P1 |
| FR-OPP-7 | Won/Lost cards display an outcome note — the archive reads as a learning asset | P1 |
| FR-OPP-8 | **List view is the default.** A board view is optional and secondary | P1 |

### 8.6 Relationships / CRM

| ID | Requirement | Pri |
|---|---|---|
| FR-CRM-1 | Creating a contact requires only a name | P0 |
| FR-CRM-2 | Relationship strength displayed: Inner Circle · Active · Warm · New · Dormant | P0 |
| FR-CRM-3 | Contacts past their cadence render a "reconnect" treatment; cadence values live in the fixtures | P0 |
| FR-CRM-4 | One-tap "Logged today" updates last interaction in session state | P0 |
| FR-CRM-5 | Detail shows: how we know each other, what they care about, what they're working on, ways I can help, introductions made/promised, important dates, location, industry | P1 |
| FR-CRM-6 | Views: Follow-up due · Important relationships · Dormant · New · Introductions promised · Reconnect · Birthdays/milestones · By city · By organization | P1 |
| FR-CRM-7 | Contact detail shows a unified timeline: interactions, commitments both directions, opportunities, delegations, notes | P1 |
| FR-CRM-8 | Trip detail lists contacts whose city matches the destination | P1 |
| FR-CRM-9 | Promised introductions render as commitments, not notes | P1 |

**Acceptance:** An inner-circle contact who is past cadence in the fixtures appears under Connect on Home and carries a visible reconnect signal on their card.

### 8.7 Reminders & renewals

One component family serving vehicles, properties, documents, health, subscriptions, memberships, and travel documents.

| ID | Requirement | Pri |
|---|---|---|
| FR-REM-1 | Types rendered: one-time · recurring · due-date · renewal · follow-up · waiting-on · check-in · preventive maintenance | P0 |
| FR-REM-2 | Renewal cards display their alert ladder position — 90 / 60 / 30 / 14 / 7 / today — with escalating visual urgency | P0 |
| FR-REM-3 | Reminders display their parent item (vehicle, property, document) as a link | P0 |
| FR-REM-4 | Completing a recurring reminder visibly rolls it to its next date in session state | P0 |
| FR-REM-5 | Snooze offers a reason; items flagged `postponed` show a "postponed 3×" badge | P1 |
| FR-REM-6 | A consolidated "Renewals — next 90 days" view spans every sphere | P1 |

**Acceptance:** The mock data includes a registration at 30 days, an insurance renewal at 60, and a membership at 7 — and each is visually distinguishable at a glance by urgency.

### 8.8 Tasks & Projects

| ID | Requirement | Pri |
|---|---|---|
| FR-TSK-1 | Creating a task requires only a title | P0 |
| FR-TSK-2 | Owner state visible: Mine / Delegated / Waiting | P0 |
| FR-TSK-3 | Recurring tasks display their recurrence rule | P0 |
| FR-TSK-4 | Tasks may exist with no project — **no forced hierarchy** | P0 |
| FR-TSK-5 | Project detail shows: strategic objective, priority, status, stakeholders, next milestone, next action, decision required, risks/blockers, waiting on, delegated items | P1 |
| FR-TSK-6 | Views: Executive priorities · Active · At risk · Decisions needed · Delegated · Waiting on · Upcoming milestones · Completed wins | P1 |
| FR-TSK-7 | Projects flagged `at-risk` in the fixtures render with a distinct treatment and appear in the At Risk view | P1 |

### 8.9 Entity-backed modules — Ventures, Nonprofit, Properties, Vehicles, Travel

All rendered by one configurable `EntityDetail` screen.

| ID | Requirement | Pri |
|---|---|---|
| FR-ENT-1 | Each entity type has a configured detail layout and field set | P1 |
| FR-ENT-2 | Every entity detail surfaces: status, next action, open tasks, commitments, reminders, documents, key contacts | P1 |
| FR-ENT-3 | **Ventures** additionally show: role, partners, revenue model, clients, deliverables, invoices, payments due, and **"Why does this matter?"** | P1 |
| FR-ENT-4 | **Nonprofit** additionally shows: mission, Rona's role, board responsibilities, impact goals, fundraising goals, contributions, introductions to make, speaking opportunities | P1 |
| FR-ENT-5 | Informal community work renders as a nonprofit entity with no organization attached | P1 |
| FR-ENT-6 | **Properties** additionally show: alias, type, HOA, insurance renewal, tax dates, vendors, warranties, open issues, recurring inspections | P1 |
| FR-ENT-7 | **Vehicles** additionally show: alias, registration renewal, insurance renewal, inspection, service schedule, mileage, warranty, permits, recalls | P1 |
| FR-ENT-8 | **Trips** additionally show: destination, dates, purpose, reservations, people to see, pre-trip tasks, return follow-ups, and **"What can be combined while I'm there?"** | P1 |
| FR-ENT-9 | Trip detail surfaces contacts in the destination city and opportunities linked to that location | P1 |
| FR-ENT-10 | Aliases only. The UI must never display an address or identifier, and the fixtures must never contain one | P1 |

### 8.10 Health & Fitness

| ID | Requirement | Pri |
|---|---|---|
| FR-HLT-1 | Renders: appointments, providers, preventive-care reminders, follow-ups, questions to ask a provider | P1 |
| FR-HLT-2 | Habits and metrics limited to a small selected set (≤5) | P2 |
| FR-HLT-3 | The UI contains no field, and the fixtures no content, resembling diagnoses, labs, prescriptions, or medical history | P1 |

### 8.11 Money

| ID | Requirement | Pri |
|---|---|---|
| FR-MNY-1 | Renders: bills, recurring payments, payments due, invoices receivable, reimbursements, tax reminders | P1 |
| FR-MNY-2 | Expenses display against their parent entity — property, vehicle, venture, trip | P1 |
| FR-MNY-3 | Read-only summary rollups by life area and entity. No ledger, no reconciliation | P2 |
| FR-MNY-4 | The UI contains no field, and the fixtures no content, resembling account numbers, credentials, or tax IDs | P1 |

### 8.12 Digital Presence & Content

| ID | Requirement | Pri |
|---|---|---|
| FR-DIG-1 | Platform directory: platform, public URL, handle, account type, current bio, last profile update, last post | P1 |
| FR-DIG-2 | Flags rendered: profile needs update · inconsistent bio · broken link · outdated photo | P1 |
| FR-DIG-3 | Bio comparison view showing stored bios side by side with divergences highlighted | P2 |
| FR-DIG-4 | Content calendar: idea → draft → review → scheduled → published, plus a repurposing queue | P2 |
| FR-DIG-5 | No credential field exists anywhere in the UI, and no credential-like string in the fixtures | P1 |

### 8.13 Career Equity & Evidence Bank

| ID | Requirement | Pri |
|---|---|---|
| FR-CAR-1 | Evidence card shows: achievement, date, category, context, action, result, quantitative result, supporting link, approved-for-public, resume-ready, bio-ready, case-study-ready | P2 |
| FR-CAR-2 | Filter evidence by readiness flags to assemble a resume, bio, nomination, or case study view | P2 |
| FR-CAR-3 | Career equity records — bios, portfolio, awards, jury roles, press, references — render independently of any employer | P2 |
| FR-CAR-4 | Evidence is capturable from Quick Capture as a single line and enriched later | P2 |

FR-CAR-4 matters most: evidence is captured in the moment of the win or never.

### 8.14 Decision Log

| ID | Requirement | Pri |
|---|---|---|
| FR-DEC-1 | Card shows: decision, date, area, related item, context, options considered, decision made, rationale, people involved, follow-up, **revisit date**, outcome | P2 |
| FR-DEC-2 | Decisions past their revisit date surface on Home under Review | P2 |
| FR-DEC-3 | Views: recent · pending · to revisit · by project · by area | P2 |

### 8.15 Goals

| ID | Requirement | Pri |
|---|---|---|
| FR-GOL-1 | Card shows: goal, area, why it matters, horizon, target date, success measure, related projects, progress, next milestone, status, review date | P1 |
| FR-GOL-2 | Goals with no linked active project render a **"stated but not staffed"** flag | P1 |
| FR-GOL-3 | Views: annual · quarterly · current focus · at risk · completed · by life area | P1 |

FR-GOL-2 is the highest-value goal feature: it makes visible the gap between what Rona says matters and where her work actually is — and it needs no intelligence, only a link check.

### 8.16 Search

| ID | Requirement | Pri |
|---|---|---|
| FR-SCH-1 | One search field across every card type in the fixtures | P0 |
| FR-SCH-2 | Results show card type, life area, status, and a matching-context snippet — never titles alone | P0 |
| FR-SCH-3 | Filter results by type, life area, and status | P1 |

### 8.17 Reviews

| ID | Requirement | Pri |
|---|---|---|
| FR-REV-1 | Weekly review screen: wins · misses · stalled · overdue commitments · waiting on · delegated · relationships · opportunities · money · health · home · community · **next week's Big 3** · stop/defer/archive | P2 |
| FR-REV-2 | Monthly and quarterly review screens per the source brief's question sets | P2 |
| FR-REV-3 | Review screens are pre-populated from the fixtures — Rona edits rather than authors | P2 |

### 8.18 Documents

| ID | Requirement | Pri |
|---|---|---|
| FR-DOC-1 | Card shows: title, type, related item, date, expiration date, version, link | P1 |
| FR-DOC-2 | Documents surface from the related item, not from a folder tree | P1 |
| FR-DOC-3 | Documents with an expiration date appear in the renewals view | P1 |
| FR-DOC-4 | Links only. No upload, no viewer, no file handling **[Scope call]** | P1 |

### 8.19 Global UI

| ID | Requirement | Pri |
|---|---|---|
| FR-GLB-1 | Archive action on every card, with an Archive view — no destructive delete in the prototype | P0 |
| FR-GLB-2 | Life Area filter available globally | P1 |
| FR-GLB-3 | Tags render and filter | P1 |
| FR-GLB-4 | Consolidated Calendar view with per-sphere layers, read-only | P1 |
| FR-GLB-5 | A visible, dismissible banner stating this is a prototype on fictional data that resets on reload | P0 |

FR-GLB-5 is not optional. Every reviewer must know what they're looking at.

---

## 9. UX requirements

### 9.1 Home screen composition

Ordered, with hard item caps:

| # | Section | Cap | Rendered when |
|---|---|---|---|
| 0 | **Overdue commitments** | 3 | Any exist — always first, breaking normal order |
| 1 | Today — date, next meeting, deadlines | — | Always |
| 2 | Top 3 Priorities | 3 | Always |
| 3 | Executive Attention: Decide / Review / Connect / Do | 3 each | Any exist |
| 4 | Meetings & appointments (today + tomorrow) | 5 | Any exist |
| 5 | I Owe | 5 | Any exist |
| 6 | Waiting On | 5 | Any exist |
| 7 | Opportunities needing movement | 3 | Any stalled or due |
| 8 | Projects at risk | 3 | Any exist |
| 9 | Delegation check-ins due | 3 | Any exist |
| 10 | Relationships to reconnect | 3 | Any past cadence |
| 11 | Renewals & life admin (next 30 days) | 5 | Any exist |
| 12 | Health & fitness | 3 | Any exist |
| 13 | Travel — next trip | 1 | Trip within 14 days |
| 14 | Inbox to process | count only | Always |

**[Scope call]** The source brief's suggested order includes separate always-on sections for Properties/Vehicles, Community, and Content. Those are folded into §11 Renewals or surfaced only when they carry live items. The brief warns against "too many widgets on the home screen"; 17 always-on sections would defeat its own north star.

### 9.2 Interaction requirements

| ID | Requirement |
|---|---|
| UX-1 | Progressive disclosure: summary → detail → full record. Never all three at once |
| UX-2 | Every list item supports inline action without navigation |
| UX-3 | Home, Today, Quick Capture, and Search are first-class on mobile |
| UX-4 | No create form shows more than 3 fields by default; "more fields" expands |
| UX-5 | Status vocabulary is shared across modules (§11) — Rona learns it once |
| UX-6 | Empty modules render nothing, not onboarding prompts |
| UX-7 | **No charts on Home.** Charts elsewhere only where they beat a number |
| UX-8 | Color signals urgency and status only, never decoration |
| UX-9 | Two breakpoints — phone and desktop — both fully designed |

### 9.3 Tone

Calm, executive, fast. The interface should feel like a well-briefed chief of staff: it tells Rona the three things that matter and stays quiet otherwise. It must be **hard to clutter** — a design constraint, not an aspiration. When in doubt between showing something and hiding it, hide it.

### 9.4 Prototype-specific UI honesty

| ID | Requirement |
|---|---|
| UX-10 | The prototype banner (FR-GLB-5) is present on first load of every session |
| UX-11 | Anything AI-generated is visibly labeled and shows its stated reason |
| UX-12 | No screen implies a saved state, sync, or account. No "saved to cloud" language, no account menu, no settings |
| UX-13 | Actions that would require a backend — export, share, invite, connect an integration — are either absent or visibly disabled with a "not in prototype" label. **Never a dead button** |

---

## 10. Mock AI surfaces (Phase 3)

No model calls. Every AI output is hand-written text in the fixtures, rendered through a distinct visual treatment.

| ID | Requirement |
|---|---|
| AI-1 | Every AI surface is visibly labeled as AI |
| AI-2 | Every suggestion displays its stated reason — "no interaction logged since March 2" |
| AI-3 | Every suggestion is editable and dismissible |
| AI-4 | Daily brief answers: what are the five things that matter, what needs a decision, what's at risk, what has been ignored repeatedly |
| AI-5 | Meeting prep assembles contact history, open commitments both directions, related opportunities, last interaction, promised introductions |
| AI-6 | Inbox classification appears as a pre-fill proposal, never an auto-file |
| AI-7 | Relationship prompts: who is overdue for contact, which important relationships have gone dormant, which introductions are promised, who is in an upcoming destination city |
| AI-8 | Goal alignment: which goals have no active projects |
| AI-9 | The prototype is fully navigable with AI surfaces hidden — they are a lens, never the substance |

---

## 11. Universal status vocabulary

**Work:** Inbox · Next · Active · Waiting · Delegated · Blocked · Scheduled · On Hold · Complete · Archived
**Ideas:** Inbox · Exploring · Incubating · Active · Someday/Maybe · Archived
**Opportunities:** the stages in FR-OPP-1
**Commitments:** Open · Follow-up scheduled · Overdue · Fulfilled · Released
**Entities:** Active · Incubating · On Hold · Dormant · Closed · Archived

**Attention type:** Decide · Review · Connect · Do · Delegate · Wait
**Importance:** Critical · High · Normal · Low
**Horizon:** Today · This Week · This Month · Later

No composite priority score. Attention routing reads as attention type × importance × horizon.

Each status needs one consistent visual token — color, weight, or badge — reused everywhere it appears.

---

## 12. Non-functional requirements

Front-end only. Nothing here implies infrastructure.

| ID | Requirement | Target |
|---|---|---|
| NFR-1 | Home renders | <1s from navigation, on the full mock dataset |
| NFR-2 | Interaction response | <100ms; all state is local |
| NFR-3 | Search results | Instant — in-memory filter over the fixtures |
| NFR-4 | Bundle stays small enough to load fast on a phone over cellular | Required |
| NFR-5 | Accessibility | WCAG 2.1 AA — contrast, focus order, keyboard navigation, semantic landmarks |
| NFR-6 | Layout holds at the mock volumes in MD-4 without breaking or scrolling horizontally | Required |
| NFR-7 | No network requests of any kind at runtime | Required |
| NFR-8 | Renders correctly in current Chrome, Safari, and Firefox | Required |

NFR-7 is a hard requirement and a useful test: if the network tab is empty, the build is honestly front-end-only.

---

## 13. Content safety rules for mock data

Restated from §7.6 because it is the requirement most likely to be violated casually.

**All content is invented.** No real people, employers, clients, organizations, addresses, or identifiers — including Rona's own.

**Must never appear in the fixtures or the UI**, even as plausible-looking fake strings:

Confidential client names or strategies · proprietary company information · non-public financials · private employee information · private correspondence · medical records, diagnoses, labs, or prescriptions · bank credentials · account numbers · insurance policy numbers · tax identification numbers · driver license numbers · VINs · real addresses · sensitive legal documents · passwords · recovery codes · authentication tokens · security questions

The rule is stronger than "don't use real data": **don't build the field.** If there is no policy-number row in the vehicle layout, no one can put a policy number in it later.

---

## 14. How this prototype is evaluated

There are no usage analytics — there is no backend. Evaluation is a structured review with Rona.

### 14.1 The 60-second test

Rona opens Home cold. Within 60 seconds, without clicking, she can state:
1. Her three most urgent obligations
2. What she is waiting on from other people
3. What is coming due that she'd otherwise forget

**If she cannot, Home is wrong** — and that is the finding the prototype exists to produce.

### 14.2 The capture test

From any screen, Rona captures a rough thought in under 10 seconds, typing only the thought, and finds it in Inbox.

### 14.3 The recognition test

Shown the Commitments screen, Rona distinguishes "I owe" from "they owe" instantly, and confirms the distinction matches how she actually thinks about obligations.

### 14.4 The volume test

At the mock volumes in MD-4, Home still reads as calm. If it reads as busy, the caps in §9.1 are wrong and must be tightened before any real build.

### 14.5 The falsification test

**If Rona reviews the Phase 1 prototype and cannot say the Home screen is the list she wants every morning, Phase 2 should not be built as specified.** The failure is one of: wrong content on Home, wrong ordering, or capture friction. Diagnose before expanding scope.

---

## 15. Risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | **Prototype mistaken for a working product** — reviewers assume data persists or AI is real | Critical | FR-GLB-5 banner; UX-11 AI labeling; UX-13 no dead buttons; state the pre-authored `flags` limitation explicitly in the demo |
| R2 | **Thin mock data flatters the design** — a tidy demo proves nothing | Critical | MD-4 volumes and MD-6 uncomfortable states are hard requirements, reviewed before the UI is reviewed |
| R3 | **Scope collapse** — 20 modules half-built | Critical | Entity consolidation (§7.2); the Phase 1 / Phase 2 split; non-goals in §3.2 treated as binding |
| R4 | **Home clutter** — every sphere fights for space and the screen stops being calm | High | Hard caps in §9.1; hide-when-empty; charts prohibited on Home |
| R5 | **Sensitive content in fixtures** — a "realistic" policy number or address gets typed in | High | §13; don't build the field |
| R6 | **Front end built around shapes that don't survive a real build** | Medium | §7 shapes are intentionally simple and denormalized; treat them as a rendering contract, not a design commitment |
| R7 | **Interaction depth creeps** — the prototype starts becoming a real app | Medium | §3.2: forms render, they don't validate; no settings; no persistence |
| R8 | **Pre-set flags mislead** — reviewer believes stall detection works | Medium | Say it plainly in the demo; note it in the banner copy |

---

## 16. Open questions

| # | Question | Needed by | Impact if unresolved |
|---|---|---|---|
| Q1 | Is the deliverable a clickable design file or a real front-end app in code? | Before any build | Changes tooling, timeline, and how much interaction is feasible |
| Q2 | What is the fixed "today" the fixtures are dated against? | Before fixtures | Everything relative-dated depends on it |
| Q3 | Which relationship cadences per strength tier — 30/90/180 days? | Phase 1 | Wrong values make the Connect section noisy or empty |
| Q4 | Is there an existing brand or visual language to inherit? | Phase 1 | Determines whether the design language is invented or applied |
| Q5 | Which Phase 2 modules matter most to Rona? | Phase 2 | If not all fourteen ship, ordering must follow her actual spheres |
| Q6 | Does the prototype need session persistence via local storage, or is reset-on-reload acceptable? | Phase 1 | Local storage is still front-end-only, but changes demo behavior |
| Q7 | Is a board/kanban view for Opportunities wanted, or is the list sufficient? | Phase 2 | Board view is meaningful extra build |
| Q8 | Who authors the mock content — this build team, or Rona, so it reads true to her life? | Before fixtures | Rona-authored fixtures make the 60-second test far more valid |

Q8 is worth resolving deliberately. A prototype populated with content that resembles Rona's actual week tests the product; one populated with generic filler tests only the layout.

---

## 17. Requirement traceability

| Source brief section | Covered in |
|---|---|
| §1–2 Purpose, principles | §1, §2, §5 |
| §3 Navigation | §7.4 Life Areas, §9.1 Home |
| §4 Daily brief | §8.2, §9.1 |
| §5 Work | §8.8 |
| §6 Growth pipeline | §8.5 |
| §7 Ventures | §8.9 (FR-ENT-3) |
| §8 Nonprofit | §8.9 (FR-ENT-4, 5) |
| §9 CRM | §8.6 |
| §10 Commitments | §8.3 |
| §11 Delegation | §8.4 |
| §12 Decision log | §8.14 |
| §13 Career equity | §8.13 |
| §14 Digital presence | §8.12 |
| §15 Content | §8.12 (FR-DIG-4) |
| §16 Properties | §8.9 (FR-ENT-6) |
| §17 Personal life admin | §8.7, §8.9 |
| §18 Vehicles | §8.9 (FR-ENT-7) |
| §19 Health | §8.10 |
| §20 Travel | §8.9 (FR-ENT-8, 9) |
| §21 Money | §8.11 |
| §22 Learning & ideas | §11 idea statuses; Inbox + Note cards |
| §23 Goals | §8.15 |
| §24 Gifts & dates | §8.6, Phase 3 ImportantDate card |
| §25 Pets | §8.9 Entity type `other` **[Scope call: no dedicated type]** |
| §26 Inbox | §8.1 |
| §27 Shared objects | §7 |
| §28 Status system | §11 |
| §29 Priority logic | §7.3, §11 |
| §30 Reviews | §8.17 |
| §31 AI layer | §10 (mock only) |
| §32 Notifications | §8.7 (in-app surfacing only; no push) |
| §33 Search | §8.16 |
| §34 Documents | §8.18 |
| §35 Calendar | §8.19 (FR-GLB-4, read-only) |
| §36 Global features | §8.19 — **backend-dependent items excluded**: export, backup, integrations, activity history |
| §37 Privacy | §13 |
| §38–41 Phasing | §6 — **integration phase excluded entirely** |
| §42 UX guidance | §9 |
| §43 Home hierarchy | §9.1 |
| §44 North star | §2 |

---

## 18. Definition of done — Phase 1

Phase 1 is complete when all of the following are true:

1. The app opens directly to Home. No login, no account, no setup.
2. Home renders the §9.1 sections in order, with caps enforced and empty sections hidden.
3. Overdue commitments appear above everything else.
4. Quick Capture is one tap from every screen, requires only text, and lands the item in Inbox.
5. Commitments show direction as their dominant visual signal, and "They Owe" offers *Follow up* rather than *Complete*.
6. Contacts, Tasks, Inbox, Today, and Search all render fully populated from the fixtures.
7. Search returns results across every card type with context snippets.
8. The mock dataset meets MD-4 volumes and includes every MD-6 uncomfortable state.
9. All content is fictional and §13 contains no violations.
10. The prototype banner is present, no dead buttons exist, and the network tab is empty at runtime.
11. Home and Quick Capture are fully usable on a phone.
12. Contrast, focus order, and keyboard navigation meet WCAG 2.1 AA.

---

# Appendix A — Navigation & screen inventory

The source brief lists 20 top-level navigation items. Twenty is not a navigation bar; it is a directory. §5.1 established that most of those are filtered views, so the navigation must reflect that hierarchy rather than flattening it.

## A.1 Navigation structure

**Primary — always visible, the daily loop**

| Item | Purpose |
|---|---|
| **Home** | The attention dashboard |
| **Today** | Time-bound view of the current day |
| **Inbox** | Unprocessed capture |
| **Commitments** | I Owe / Waiting On |
| **People** | CRM |
| **Search** | Global |
| **+ Capture** | Persistent control, not a nav item — see A.3 |

Six items. Rona touches all six most days.

**Secondary — "Spheres," one level down**

Work & Projects · Opportunities · Ventures & Consulting · Nonprofit & Community · Properties · Vehicles · Travel · Personal Admin · Health & Fitness · Money · Brand & Content · Goals · Learning & Ideas · Career Equity

Reached from a single "Spheres" entry that opens a grid. Each sphere is an `EntityList` or filtered `CardList`, not a bespoke screen.

**Tertiary — reference surfaces**

Calendar · Documents · Decision Log · Evidence Bank · Reviews · Archive

Reached from Spheres or from the object they relate to. Never in primary nav.

**[Scope call]** Collapsing 20 nav items to 6 + a grid is the navigation equivalent of the Entity consolidation. If a sphere earns primary placement through use, promote it — but start narrow. A navigation bar that shows everything communicates nothing.

## A.2 Desktop vs. mobile

| | Desktop | Mobile |
|---|---|---|
| Primary nav | Left rail, always visible, labeled | Bottom tab bar: Home · Today · **Capture** · Commitments · Search |
| Spheres | Rail entry → grid overlay | "More" sheet |
| Capture | Persistent button, top-right + keyboard shortcut | Center tab, thumb-reachable |
| Detail views | Side panel over the list where sensible | Full-screen push |

Capture occupies the center mobile tab. It is the highest-frequency action and the one most punished by friction.

## A.3 Screen inventory

**Phase 1 — 11 screens**

`Home` · `Today` · `Inbox` · `InboxProcess` · `Commitments` (tabbed: I Owe / Waiting On / Overdue) · `CommitmentDetail` · `Tasks` · `People` · `ContactDetail` · `Search` · `QuickCapture` (sheet/modal, overlays any screen)

**Phase 2 — 12 screens**

`SphereGrid` · `Projects` · `ProjectDetail` · `Opportunities` · `OpportunityDetail` · `EntityList` (configured per type — covers ventures, nonprofits, properties, vehicles, trips) · `EntityDetail` (configured per type) · `Renewals` · `Goals` · `Calendar` · `Money` · `DigitalPresence`

One `EntityList` + one `EntityDetail` covers five of the brief's modules. That is the whole return on the §7.2 consolidation.

**Phase 3 — 7 screens**

`DecisionLog` · `EvidenceBank` · `ContentCalendar` · `WeeklyReview` · `MonthlyReview` · `QuarterlyReview` · `MeetingBrief`

**Total: 30 screens**, of which roughly 8 are genuinely distinct layouts. The rest are configurations.

---

# Appendix B — Component library

The build is a component library plus configuration. Building screens independently is the failure mode this appendix exists to prevent.

## B.1 Primitives

| Component | Responsibility |
|---|---|
| `StatusBadge` | Renders any §11 status with its assigned token |
| `UrgencyDot` | The five-step urgency scale (D.1) |
| `PersonChip` | Avatar/initials + name; links to `ContactDetail` |
| `RelatedChips` | Resolves `relatedIds` into linked chips |
| `LifeAreaTag` | One life area, color-coded |
| `DateLabel` | Relative-first ("in 3 days," "11 days overdue"), absolute on hover |
| `NextActionLine` | Next action text, or a flagged absence |
| `InlineActions` | Complete · Snooze · Reschedule · Delegate · Open, per card type |
| `AILabel` | Wraps any mock-AI output; carries the reason string |

`DateLabel` earns its place: "11 days overdue" changes behavior in a way that "July 20" does not.

## B.2 Cards

All extend one `AttentionCard` base — title, status, urgency, life areas, next action, inline actions.

`CommitmentCard` (direction-dominant) · `TaskRow` · `DelegationCard` (check-in date distinct from due date) · `ContactCard` (strength + cadence state) · `OpportunityCard` (stage + next move, absence flagged) · `ReminderRow` (ladder position) · `EntityCard` · `ProjectCard` · `GoalCard` (staffed / not staffed) · `DocumentRow` · `InboxRow`

Every card renders in list, Home-section, and detail-panel contexts without a separate implementation.

## B.3 Composition

| Component | Responsibility |
|---|---|
| `SectionBlock` | Titled group with a hard item cap, "show all" link, and **hide-when-empty** built in — §9.1's caps and FR-HOME-3 live here, not in each section |
| `CardList` | Filterable, sortable list of any card type |
| `FilterBar` | Life area chips + status + type |
| `TabbedViews` | The saved views each module specifies |
| `DetailShell` | Header + panels + related items; the base for every detail screen |
| `EntityDetail` | `DetailShell` + per-type field configuration |
| `Timeline` | Chronological mixed-card stream (contact history, project activity) |
| `PrototypeBanner` | FR-GLB-5 |

**`SectionBlock` is the most important component in the build.** Home's calmness is a property of one component, enforced once. If caps and hide-when-empty are implemented per-section, they will drift and Home will become the cluttered dashboard §9.3 forbids.

---

# Appendix C — Session state model

No persistence. This appendix defines what changes during a session so behavior is consistent rather than improvised per screen.

## C.1 Mutable in session

Captured items · completions · snoozes and reschedules · Top 3 Priorities · "Logged today" on contacts · status changes · archive actions · filter and view selections · inbox processing · recurring reminder roll-forward

## C.2 Immutable

The fixture set itself · pre-authored `flags` · mock AI text · relationship cadence values · entity type configurations

## C.3 Rules

| ID | Requirement |
|---|---|
| ST-1 | All mutations are optimistic and instant. Nothing shows a spinner — there is nothing to wait for |
| ST-2 | Mutations propagate everywhere immediately: completing a commitment on Home removes it from Commitments and the contact's timeline in the same frame |
| ST-3 | Every mutation is undoable for ~5 seconds via a toast |
| ST-4 | Reload resets to the fixture baseline. The banner says so |
| ST-5 | **No fabricated latency.** Artificial delays to "feel real" make the prototype feel slow and teach reviewers nothing |

ST-2 is the one that proves the product thesis. The brief's core claim — "information entered in one area surfaces automatically in another" — is demonstrated by a single cross-screen propagation, or not at all.

## C.4 Optional local persistence

If Q6 resolves toward persistence, session state may serialize to browser local storage. Still front-end-only: no server, no account. Requires a visible "Reset to demo data" control.

---

# Appendix D — Visual system

§11 requires each status to have one consistent visual token. This appendix defines the system so tokens are assigned once rather than invented per screen.

## D.1 Urgency scale

Five steps, the only place strong color is permitted:

| Step | Meaning | Treatment |
|---|---|---|
| **Overdue** | Past due | Strongest signal — full-weight color, highest contrast |
| **Today** | Due today | Strong, distinct hue from overdue |
| **Soon** | ≤7 days, or renewal at 14/7 | Medium |
| **Upcoming** | ≤30 days | Light |
| **Later** | Beyond 30 days, or no date | Neutral — no color |

**Most items must render at Later.** If a realistic day shows many items in strong color, the scale has failed and Rona will learn to ignore it — the exact failure the product exists to prevent.

## D.2 Status tokens

Shape, not just color, so status survives grayscale and colorblind viewing:

- **Waiting / Delegated / Blocked** — outlined badge (something external is required)
- **Active / Next / Scheduled** — filled badge
- **On Hold / Someday / Nurture** — muted, lower contrast
- **Complete / Archived** — struck or dimmed

Direction on commitments — **I Owe** vs **They Owe** — gets the strongest non-urgency treatment in the system, per FR-COM-1 and the §14.3 recognition test. Icon direction plus position, not color alone.

## D.3 Typography & density

- Three type sizes on cards: title, metadata, action. No more.
- Titles truncate at two lines, never mid-word, with full text on hover/tap.
- Home is **lower density than module lists** — deliberately. Home is for scanning; lists are for working.
- Numbers only where a number changes a decision. No stat tiles on Home.

## D.4 Prohibited

Charts on Home (UX-7) · progress rings and gauges · decorative color (UX-8) · more than two accent hues outside the urgency scale · icons without labels in navigation · animation beyond ≤150ms state transitions

## D.5 Dark mode

Out of scope for the prototype unless Q4 resolves otherwise. The urgency scale must be validated in light mode first — it is the load-bearing visual decision, and validating it twice costs twice.

---

# Appendix E — The fixture cast

§7.6 sets volume targets. This appendix gives the fixtures a **coherent world**, so the same names recur across modules (MD-7) and the uncomfortable states (MD-6) attach to specific, believable situations rather than being sprinkled at random.

All content below is invented. Aliases only for properties and vehicles, per FR-ENT-10.

## E.1 Rona's spheres

| Sphere | Fixture |
|---|---|
| Work | **Meridian Grove** — consumer brands company. Rona is SVP, Brand & Growth |
| Venture | **Coastline Provisions** — owned small-batch food business, co-owned |
| Consulting | **Fieldnote Advisory** — Rona's own advisory practice |
| Client | **Halden Athletic** — active consulting client, expansion in play |
| Nonprofit | **Bayfront Youth Collective** — board member |
| Community | **Neighborhood Arts Fund** — informal, no formal org attached (tests FR-ENT-5) |
| Properties | **Lakeside Unit** · **The Cottage** |
| Vehicles | **The Sedan** · **The Wagon** |
| Travel | **Chicago — Aug 12–14** (within 14 days, so Home §13 renders) · **Lisbon — March** (archived) |
| Health | **Annual physical — Aug 6** · a standing Tuesday training session |
| Brand | Personal site · LinkedIn · Instagram · a dormant Substack |

The Chicago dates are deliberate: at a fixed "today" of July 31, a September trip would never trigger Home section 13, leaving that section undemonstrated. The health fixtures exist for the same reason — see H.4.

## E.2 Recurring cast

Twelve named people carry the cross-module coherence. The remaining ~28 contacts (MD-4) can be thinner.

| Person | Role | Appears in |
|---|---|---|
| **Marisol Vega** | Inner Circle; former colleague, now VP at Halden Athletic | Contacts · the stalled opportunity · a Waiting On commitment |
| **Desmond Achebe** | Board chair, Bayfront Youth Collective | Contacts · an overdue I Owe · board meeting event |
| **Priya Raman** | Rona's direct report at Meridian Grove | Contacts · three delegations · a check-in due |
| **Ellery Nakamura** | Co-owner, Coastline Provisions | Contacts · venture entity · a pending decision |
| **Tobias Lind** | Executive recruiter | Contacts · a career opportunity in Nurture |
| **Nadia Sorenson** | Inner Circle — **dormant, 147 days** | Contacts · the Connect section on Home |
| **Cyrus Bell** | Founder seeking an introduction | Contacts · a promised-introduction commitment |
| **Joaquin Reyes** | Based in Chicago | Contacts · surfaces on the Chicago trip (FR-CRM-8) |
| **Simone Ashby** | Conference organizer | Contacts · a speaking opportunity |
| **Grant Whitfield** | Contractor | Contacts · Lakeside Unit open issue |
| **Imani Cole** | Mentee | Contacts · community sphere · a standing monthly |
| **Aunt Ines** | Family | Contacts · a birthday · a gift idea |

## E.3 The uncomfortable states — mapped

MD-6 is the requirement most likely to be satisfied vaguely. Each state gets a specific fixture:

| State | Fixture |
|---|---|
| **Overdue commitment** | Rona owes Desmond a fundraising target draft — **11 days overdue** |
| **Waiting On, aging** | Marisol owes an introduction to Halden's CFO — **19 days**, no follow-up logged |
| **Stalled opportunity** | Halden Athletic expansion — **34 days** without stage change, no next move set |
| **Dormant inner circle** | Nadia Sorenson — **147 days** since last interaction, cadence is 30 |
| **Repeatedly postponed** | "Donate the boxes in the hall closet" — **snoozed 3×** |
| **Project at risk** | Meridian Grove Q4 launch — milestone missed, blocked 9 days |
| **Goal stated but not staffed** | "Publish a POV piece quarterly" — zero linked projects |
| **Delegation past check-in** | Priya's competitive scan — check-in date passed 4 days ago |
| **Decision to revisit** | Whether to keep The Cottage — revisit date reached |
| **Commitment with no due date** | "Send Cyrus the intro to Ellery" — created 26 days ago, no date |

## E.4 The renewal ladder — one item per rung

FR-REM-2's ladder is only demonstrable if every rung is occupied:

| Rung | Fixture |
|---|---|
| 90 days | Passport expiration |
| 60 days | The Cottage insurance renewal |
| 30 days | The Sedan registration |
| 14 days | Bayfront board materials due |
| 7 days | Gym membership auto-renew |
| Today | Quarterly tax reminder |

## E.5 Authoring rules

| ID | Requirement |
|---|---|
| FX-1 | Every named person in E.2 appears in **at least two** modules |
| FX-2 | Every uncomfortable state in E.3 exists, dated relative to the fixed "today" (Q2) |
| FX-3 | Every renewal rung in E.4 is occupied by exactly one item |
| FX-4 | The Chicago trip links to Joaquin Reyes, one opportunity, and one pre-trip task — proving FR-ENT-9 |
| FX-5 | At least one item carries **three** life areas, proving multi-valued tagging |
| FX-6 | At least four titles run long enough to force truncation (MD-8) |
| FX-7 | Roughly 70% of all dated items sit at urgency **Later** (D.1) |
| FX-8 | **Every Home section in §9.1 has at least one qualifying item** in the primary fixture state — otherwise that section ships undemonstrated |
| FX-9 | A second fixture state, **"quiet Tuesday,"** empties several sections — this is how FR-HOME-3 hide-when-empty is proven. A demo toggle switches between the two |

FX-7 is the discipline that makes the urgency scale mean anything. FX-8 and FX-9 are a pair: the primary state proves every section works, the quiet state proves they disappear.

---

# Appendix F — Home wireframe

Desktop. Mobile is the same order, single column, sections 0–3 above the fold.

```
┌──────────────────────────────────────────────────────────────┐
│  ⚠  Prototype · fictional data · resets on reload      [×]   │
├────────────┬─────────────────────────────────────────────────┤
│            │  Thursday, July 31                    [+ Capture]│
│  ▸ Home    │                                                  │
│  ▸ Today   │  ╭── OVERDUE ─────────────────────────────────╮  │
│  ▸ Inbox ⑨ │  │ ● Fundraising target draft → Desmond       │  │
│  ▸ Commit. │  │   I OWE · 11 days overdue      [Do][Snooze]│  │
│  ▸ People  │  ╰────────────────────────────────────────────╯  │
│  ▸ Search  │                                                  │
│            │  TOP 3 PRIORITIES                        [edit]  │
│  ▸ Spheres │  1. Halden expansion — set next move             │
│            │  2. Q4 launch blocker — decide                   │
│            │  3. Board materials — review                     │
│            │                                                  │
│            │  EXECUTIVE ATTENTION                             │
│            │  ┌ DECIDE ─────┬ REVIEW ─────┬ CONNECT ────────┐ │
│            │  │ Cottage:    │ Board deck  │ Nadia Sorenson  │ │
│            │  │  keep/sell  │ Q4 scope    │  · 147 days     │ │
│            │  │ Coastline   │             │ Marisol — nudge │ │
│            │  │  packaging  │             │                 │ │
│            │  └─────────────┴─────────────┴─────────────────┘ │
│            │                                          [DO ▸]  │
│            │  TODAY'S MEETINGS                                │
│            │  10:00  Priya — 1:1                              │
│            │  14:30  Bayfront board call                      │
│            │                                                  │
│            │  I OWE (3)                                       │
│            │  ○ Intro: Cyrus → Ellery      no date set        │
│            │  ○ Thank-you note — Simone    due Fri            │
│            │  ○ Coastline pricing sheet    due Aug 8          │
│            │                                                  │
│            │  WAITING ON (3)                         show all │
│            │  ◇ Marisol — CFO intro        19 days  [Follow up]│
│            │  ◇ Grant — Lakeside quote     6 days   [Follow up]│
│            │                                                  │
│            │  OPPORTUNITIES NEEDING MOVEMENT (1)              │
│            │  ▪ Halden expansion · STALLED 34d · no next move │
│            │                                                  │
│            │  PROJECTS AT RISK (1)                            │
│            │  ▪ Q4 launch · blocked 9d · milestone missed     │
│            │                                                  │
│            │  DELEGATION CHECK-INS (1)                        │
│            │  ▪ Priya — competitive scan · check-in +4d       │
│            │                                                  │
│            │  RELATIONSHIPS TO RECONNECT (2)                   │
│            │  ▪ Nadia Sorenson · 147d · Inner Circle          │
│            │  ▪ Imani Cole · monthly overdue                  │
│            │                                                  │
│            │  RENEWALS — NEXT 30 DAYS (2)                     │
│            │  ▪ The Sedan registration      30 days           │
│            │  ▪ Gym membership              7 days            │
│            │                                                  │
│            │  HEALTH (1)                                      │
│            │  ▪ Annual physical             Aug 6             │
│            │                                                  │
│            │  TRAVEL — CHICAGO, AUG 12                        │
│            │  ▪ 3 pre-trip tasks · 1 person to see            │
│            │                                                  │
│            │  ⟳ 9 items in Inbox                    [Process] │
└────────────┴─────────────────────────────────────────────────┘
```

**What the wireframe encodes:**

- Overdue breaks order and sits above Top 3 (FR-HOME-7)
- "They Owe" rows offer **Follow up**, "I Owe" rows offer **Do** (FR-COM-6)
- The overdue Desmond commitment appears **only** in section 0 — not again under I Owe, and not under Executive Attention/Do (FR-HOME-2b, H.1)
- Nadia appears under CONNECT only. Relationships to reconnect holds the **overflow** past Connect's cap of 3 — first-qualifying-section wins (H.1)
- Every §9.1 section renders here, per FX-8. Hide-when-empty is proven by the "quiet Tuesday" state (FX-9), not by this one
- The stalled opportunity displays its missing next move as the finding, not a blank
- Inbox is a neutral count with a process affordance, not an alert (FR-CAP-6)

---

# Appendix G — Build sequence

Ordered so something reviewable exists early and each slice de-risks the next.

| Slice | Contents | Reviewable output |
|---|---|---|
| **0 · Foundations** | Visual system (D), primitives (B.1), `SectionBlock`, `AttentionCard` base | A styleguide page showing every token, urgency step, and card type |
| **1 · Fixtures** | The full cast (E), all volumes (MD-4), every uncomfortable state (E.3) and renewal rung (E.4) | Data review — **before** any screen is built |
| **2 · Home** | `Home` + `QuickCapture` + nav shell | **The 60-second test (§14.1) runs here** |
| **3 · Commitments** | `Commitments`, `CommitmentDetail`, contact rollup | The recognition test (§14.3) |
| **4 · Phase 1 remainder** | `Today`, `Inbox`, `InboxProcess`, `Tasks`, `People`, `ContactDetail`, `Search` | Phase 1 Definition of Done (§18) |
| **5 · Entity engine** | `EntityList` + `EntityDetail` + type configs | Five spheres at once |
| **6 · Pipeline & work** | Opportunities, Projects, Goals, Renewals | — |
| **7 · Remaining spheres** | Money, Calendar, Digital Presence, Health, Travel | Phase 2 complete |
| **8 · Phase 3** | Reviews, Decision Log, Evidence Bank, mock AI surfaces | — |

**Slice 1 before slice 2 is the sequencing decision that matters.** Building Home against three placeholder rows produces a screen that looks calm because it is empty. Home must be built against the full, uncomfortable dataset from its first commit, or §14.4 gets answered wrong.

**Slice 0 before everything** for the same reason in reverse: the urgency scale (D.1) is the load-bearing visual decision. Settling it in a styleguide costs a day; discovering it's wrong after 30 screens costs the build.

Gate after slice 2. If Home fails the 60-second test, §14.5 says stop and diagnose rather than proceeding to slice 3.

---

# Appendix H — Consistency resolutions

Contradictions found in a full read-through of this document, and how each is resolved. Recorded rather than silently patched, so the reasoning survives.

## H.1 Home section overlap — the significant one

**The contradiction.** §9.1 defines 15 sections whose membership rules overlap heavily. The overdue commitment to Desmond qualifies for section 0 (Overdue), section 5 (I Owe), *and* section 3 under Executive Attention/Do. Nadia qualifies for both Connect and section 10. A project at risk qualifies for section 8 and Executive Attention/Decide. As written, Home renders the same item two or three times — producing exactly the clutter §9.3 forbids and §14.4 tests for.

**Resolution — first-qualifying-section wins, with cap overflow cascading.**

1. Sections are evaluated in §9.1 order, 0 through 14.
2. An item is placed in the **first** section it qualifies for and is then removed from consideration.
3. If that section is already at its cap, the item **cascades to the next section it qualifies for**, and so on.
4. If it qualifies for no further section, it does not appear on Home. It remains reachable in its module.

**Consequences, stated plainly:**

- Overdue commitments appear only in section 0. I Owe (5) shows on-time obligations only.
- Executive Attention (3) is the primary triage surface; the domain sections below it hold overflow. This is why Connect is capped at 3 and Relationships to reconnect exists at 10 — they are one queue rendered in two places.
- Projects at risk (8) shows only those not already surfaced as a Decide item.

**Why this rule and not "show it wherever it qualifies":** duplication makes Home longer without adding information, and it breaks the count in every section header. A reviewer who sees "I OWE (4)" and counts three visible plus one overdue above cannot trust either number.

**Alternative rejected:** section-specific exclusion lists. Equivalent behavior, but the logic lives in 15 places instead of one — the same drift risk B.3 flags for `SectionBlock`. The precedence rule belongs in `SectionBlock` alongside the caps.

## H.2 P0 requirements without a Phase 1 screen

**The contradiction.** §8 declares P0 = Phase 1. But FR-REM-1 through FR-REM-4 are P0, while `Renewals` is a Phase 2 screen (A.3) built in slice 6 (Appendix G). Same for FR-DEL-1 through FR-DEL-4, P0 with no Phase 1 Delegation screen.

**Resolution.** P0 attaches to a **behavior**, not a screen. Both sets are P0 because they must render on Home in Phase 1:

| Requirement set | Phase 1 delivery | Dedicated screen |
|---|---|---|
| FR-REM-1 – 4 | `ReminderRow` on Home sections 11–12 | `Renewals`, Phase 2 |
| FR-DEL-1 – 4 | `DelegationCard` on Home section 9, plus the Mine/Delegated/Waiting filter inside Tasks | Delegation views, Phase 2 |

§6.1 has been amended to say this explicitly. **The general rule: a P0 requirement means the behavior is visible in Phase 1, on whatever surface already exists.**

## H.3 Cap wording

FR-HOME-2 said "at most 5 items" while §9.1 caps most sections at 3. Amended: FR-HOME-2 now defers to the §9.1 cap with 5 as the ceiling. §9.1 is the single source of truth for caps.

## H.4 Sections no fixture could exercise

**The contradiction.** Home section 13 renders only for a trip within 14 days; Appendix E placed the Chicago trip in September against a July 31 "today." Section 12 requires health items; the original cast had none. Both sections would have shipped undemonstrated — and an unexercised section is an unreviewed section.

**Resolution.** Chicago moved to Aug 12–14. Health fixtures added (annual physical Aug 6, standing Tuesday session). **FX-8** now requires every §9.1 section to have a qualifying item in the primary fixture state.

This created a second problem: with every section populated, nothing demonstrates FR-HOME-3 hide-when-empty. **FX-9** resolves it with a second "quiet Tuesday" fixture state and a demo toggle. Two states, one proving every section works, the other proving they vanish.

## H.5 Flag vocabulary incomplete

§7.3 listed four `flags` values, but FR-DEL-5 references `delegatable`, FR-GOL-2 needs a not-staffed state, and FR-DEC-2 needs a revisit-due state. All three added to §7.3.

## H.6 Open question partly answered

Q3 asks which relationship cadences apply per strength tier. Appendix E.3 already assumes **30 days for Inner Circle** (Nadia dormant at 147 against a cadence of 30). Q3 remains open for Active / Warm / New, but the Inner Circle value is now a stated assumption in the fixtures rather than an unknown — flagged here so the two sections are not read as contradicting each other.

## H.7 Standing check

Every future edit to §9.1, §8, or Appendix E should be checked against H.1, H.2, and FX-8. Those three are where this document is most likely to drift back out of agreement with itself.

## H.8 Found while building slices 0–2

Three problems the specification could not have revealed on paper. All were caught by an automated check (`scripts/check-home.ts`) that runs the §9.1 composition against the real fixtures.

**H.8.1 — H.1 precedence can starve a section permanently.**
The Q4 launch project is both `at-risk` and an attention type of `Decide`. H.1 correctly routed it to Executive Attention, which meant *Projects at risk* rendered empty on every load — a section shipped but never seen, exactly what FX-8 exists to prevent.

*Resolution:* fixtures now carry a second at-risk project whose attention type is `Wait`, so it is not eligible for any Executive Attention bucket and falls through to its domain section. **General rule: any section whose only candidates also qualify for an earlier section will starve. FX-8 must be verified by running the composition, never by inspection.**

**H.8.2 — P4 "one fact, one place" is violable inside the fixtures.**
H.1 guarantees a *card* appears once. It cannot stop two different cards from representing the same real-world obligation. The first fixture pass had three:

| Duplicate | Already carried by |
|---|---|
| "Annual physical" reminder | the calendar event |
| "Follow up with Marisol" reminder | the commitment's own `followUpDate` |
| "Check in with Priya" reminder | the delegation's own `checkInDate` |

Each would have put the same obligation on Home twice under different section headings. *Resolution:* all three deleted; the commitment and delegation objects carry their own dates, which is what those fields are for. **Rule added: never create a reminder for something an existing object already schedules.**

**H.8.3 — FX-7 as written fights FX-8.**
FX-7 asks that ~70% of dated items sit at urgency `Later`. FX-8 asks that every Home section have a qualifying item, and most sections qualify on near-term dates. Pushing dates out far enough to satisfy FX-7 literally begins emptying the sections FX-8 requires.

Measured after tuning: **61% at `Later`, and 23% of dated items in a strong-colour step** (overdue, today, soon).

*Resolution:* the 61% is accepted, and **FX-7 is restated to measure what D.1 actually cares about — the strong-colour share, not the `Later` count**:

> **FX-7 (revised).** No more than **25%** of dated items may render in a strong-colour urgency step (overdue / today / soon). The `Later` share should be the largest single step but need not reach any fixed threshold.

D.1's stated concern is "if a realistic day shows many items in strong colour, the scale has failed." That is a statement about colour saturation, not about a date histogram. The revised form is measurable, is what the design actually requires, and does not fight FX-8.

---

*End of document.*
